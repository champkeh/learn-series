import MagicString, { SourceMap } from 'magic-string';
import Module from '../Module';
import {
	DecodedSourceMapOrMissing,
	EmittedFile,
	ExistingRawSourceMap,
	Plugin,
	PluginContext,
	RollupError,
	RollupWarning,
	SourceDescription,
	TransformModuleJSON,
	TransformPluginContext,
	TransformResult,
	WarningHandler
} from '../rollup/types';
import { collapseSourcemap } from './collapseSourcemaps';
import { decodedSourcemap } from './decodedSourcemap';
import { augmentCodeLocation, errNoTransformMapOrAstWithoutCode } from './error';
import { getTrackedPluginCache } from './PluginCache';
import { PluginDriver } from './PluginDriver';
import { throwPluginError } from './pluginUtils';

export default function transform(
	source: SourceDescription,
	module: Module,
	pluginDriver: PluginDriver,
	warn: WarningHandler
): Promise<TransformModuleJSON> {
	const id = module.id;
	const sourcemapChain: DecodedSourceMapOrMissing[] = [];

	let originalSourcemap = source.map === null ? null : decodedSourcemap(source.map);
	const originalCode = source.code;
	let ast = source.ast;
	const transformDependencies: string[] = [];
	const emittedFiles: EmittedFile[] = [];
	let customTransformCache = false;
	const useCustomTransformCache = () => (customTransformCache = true);
	let curPlugin: Plugin;
	const curSource: string = source.code;

	function transformReducer(
		this: PluginContext,
		previousCode: string,
		result: TransformResult,
		plugin: Plugin
	): string {
		let code: string;
		let map: string | ExistingRawSourceMap | { mappings: '' } | null | undefined;
		if (typeof result === 'string') {
			code = result;
		} else if (result && typeof result === 'object') {
			module.updateOptions(result);
			if (result.code == null) {
				if (result.map || result.ast) {
					warn(errNoTransformMapOrAstWithoutCode(plugin.name));
				}
				return previousCode;
			}
			({ code, map, ast } = result);
		} else {
			return previousCode;
		}

		// strict null check allows 'null' maps to not be pushed to the chain,
		// while 'undefined' gets the missing map warning
		if (map !== null) {
			sourcemapChain.push(
				decodedSourcemap(typeof map === 'string' ? JSON.parse(map) : map) || {
					missing: true,
					plugin: plugin.name
				}
			);
		}

		return code;
	}

	return pluginDriver
		.hookReduceArg0(
			'transform',
			[curSource, id],
			transformReducer,
			(pluginContext, plugin): TransformPluginContext => {
				curPlugin = plugin;
				return {
					...pluginContext,
					cache: customTransformCache
						? pluginContext.cache
						: getTrackedPluginCache(pluginContext.cache, useCustomTransformCache),
					warn(warning: RollupWarning | string, pos?: number | { column: number; line: number }) {
						if (typeof warning === 'string') warning = { message: warning } as RollupWarning;
						if (pos) augmentCodeLocation(warning, pos, curSource, id);
						warning.id = id;
						warning.hook = 'transform';
						pluginContext.warn(warning);
					},
					error(err: RollupError | string, pos?: number | { column: number; line: number }): never {
						if (typeof err === 'string') err = { message: err };
						if (pos) augmentCodeLocation(err, pos, curSource, id);
						err.id = id;
						err.hook = 'transform';
						return pluginContext.error(err);
					},
					emitAsset(name: string, source?: string | Uint8Array) {
						emittedFiles.push({ type: 'asset' as const, name, source });
						return pluginContext.emitAsset(name, source);
					},
					emitChunk(id, options) {
						emittedFiles.push({ type: 'chunk' as const, id, name: options && options.name });
						return pluginContext.emitChunk(id, options);
					},
					emitFile(emittedFile: EmittedFile) {
						emittedFiles.push(emittedFile);
						return pluginDriver.emitFile(emittedFile);
					},
					addWatchFile(id: string) {
						transformDependencies.push(id);
						pluginContext.addWatchFile(id);
					},
					setAssetSource() {
						return this.error({
							code: 'INVALID_SETASSETSOURCE',
							message: `setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook.`
						});
					},
					getCombinedSourcemap() {
						const combinedMap = collapseSourcemap(
							id,
							originalCode,
							originalSourcemap,
							sourcemapChain,
							warn
						);
						if (!combinedMap) {
							const magicString = new MagicString(originalCode);
							return magicString.generateMap({ includeContent: true, hires: true, source: id });
						}
						if (originalSourcemap !== combinedMap) {
							originalSourcemap = combinedMap;
							sourcemapChain.length = 0;
						}
						return new SourceMap({
							...combinedMap,
							file: null as any,
							sourcesContent: combinedMap.sourcesContent!
						});
					}
				};
			}
		)
		.catch(err => throwPluginError(err, curPlugin.name, { hook: 'transform', id }))
		.then(code => {
			if (!customTransformCache) {
				// files emitted by a transform hook need to be emitted again if the hook is skipped
				if (emittedFiles.length) module.transformFiles = emittedFiles;
			}

			return {
				ast,
				code,
				customTransformCache,
				meta: module.info.meta,
				originalCode,
				originalSourcemap,
				sourcemapChain,
				transformDependencies
			};
		});
}

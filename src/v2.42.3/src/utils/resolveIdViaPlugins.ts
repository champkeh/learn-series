import { CustomPluginOptions, Plugin, PluginContext, ResolvedId } from '../rollup/types';
import { BLANK } from './blank';
import { PluginDriver, ReplaceContext } from './PluginDriver';

export function resolveIdViaPlugins(
	source: string,
	importer: string | undefined,
	pluginDriver: PluginDriver,
	moduleLoaderResolveId: (
		source: string,
		importer: string | undefined,
		customOptions: CustomPluginOptions | undefined,
		skip: { importer: string | undefined; plugin: Plugin; source: string }[] | null
	) => Promise<ResolvedId | null>,
	skip: { importer: string | undefined; plugin: Plugin; source: string }[] | null,
	customOptions: CustomPluginOptions | undefined
) {
	let skipped: Set<Plugin> | null = null;
	let replaceContext: ReplaceContext | null = null;
	if (skip) {
		skipped = new Set();
		for (const skippedCall of skip) {
			if (source === skippedCall.source && importer === skippedCall.importer) {
				skipped.add(skippedCall.plugin);
			}
		}
		replaceContext = (pluginContext, plugin): PluginContext => ({
			...pluginContext,
			resolve: (source, importer, { custom, skipSelf } = BLANK) => {
				return moduleLoaderResolveId(
					source,
					importer,
					custom,
					skipSelf ? [...skip, { importer, plugin, source }] : skip
				);
			}
		});
	}
	return pluginDriver.hookFirst(
		'resolveId',
		[source, importer, { custom: customOptions }],
		replaceContext,
		skipped
	);
}

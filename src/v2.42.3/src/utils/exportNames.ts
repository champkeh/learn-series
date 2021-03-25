import Variable from '../ast/variables/Variable';
import { toBase64 } from './base64';
import { RESERVED_NAMES } from './reservedNames';

export function assignExportsToMangledNames(
	exports: Set<Variable>,
	exportsByName: Record<string, Variable>,
	exportNamesByVariable: Map<Variable, string[]>
) {
	let nameIndex = 0;
	for (const variable of exports) {
		let exportName = variable.name[0];
		if (exportsByName[exportName]) {
			do {
				exportName = toBase64(++nameIndex);
				// skip past leading number identifiers
				if (exportName.charCodeAt(0) === 49 /* '1' */) {
					nameIndex += 9 * 64 ** (exportName.length - 1);
					exportName = toBase64(nameIndex);
				}
			} while (RESERVED_NAMES[exportName] || exportsByName[exportName]);
		}
		exportsByName[exportName] = variable;
		exportNamesByVariable.set(variable, [exportName]);
	}
}

export function assignExportsToNames(
	exports: Set<Variable>,
	exportsByName: Record<string, Variable>,
	exportNamesByVariable: Map<Variable, string[]>
) {
	for (const variable of exports) {
		let nameIndex = 0;
		let exportName = variable.name;
		while (exportsByName[exportName]) {
			exportName = variable.name + '$' + ++nameIndex;
		}
		exportsByName[exportName] = variable;
		exportNamesByVariable.set(variable, [exportName]);
	}
}

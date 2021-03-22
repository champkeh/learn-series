const { has } = require('../utils/object')
const { getName, quoteId } = require('../utils/map-helpers')

function amd ( bundle, magicString, exportMode, options ) {
	const indentStr = magicString.getIndentString();

	let deps = bundle.externalModules.map( quoteId );
	let args = bundle.externalModules.map( getName );

	if ( exportMode === 'named' ) {
		args.unshift( `exports` );
		deps.unshift( `'exports'` );
	}

	const params =
		( has( options, 'moduleId' ) ? `['${options.moduleId}'], ` : `` ) +
		( deps.length ? `[${deps.join( ', ' )}], ` : `` );

	const intro = `define(${params}function (${args.join( ', ' )}) { 'use strict';\n\n`;

	const exports = bundle.entryModule.exports;

	let exportBlock;

	if ( exportMode === 'default' ) {
		exportBlock = `return ${bundle.entryModule.getCanonicalName('default')};`;
	} else {
		exportBlock = '\n\n' + Object.keys( exports ).map( name => {
			return `exports.${name} = ${exports[name].localName};`;
		}).join( '\n' );
	}

	return magicString
		.append( exportBlock )
		.trim()
		.indent()
		.append( '\n\n});' )
		.prepend( intro );
}

module.exports = amd

import help from 'help.md';
import { version } from 'package.json';
import argParser from 'yargs-parser';
import { commandAliases } from '../src/utils/options/mergeOptions';
import run from './run/index';

const command = argParser(process.argv.slice(2), {
	alias: commandAliases,
	configuration: { 'camel-case-expansion': false }
});

if (command.help || (process.argv.length <= 2 && process.stdin.isTTY)) {
	console.log(`\n${help.replace('__VERSION__', version)}\n`);
} else if (command.version) {
	console.log(`rollup v${version}`);
} else {
	try {
		require('source-map-support').install();
	} catch (err) {
		// do nothing
	}

	run(command);
}

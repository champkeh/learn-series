// Rollup.js with npm modules
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from "@rollup/plugin-replace"
import buble from "@rollup/plugin-buble"
import { terser } from 'rollup-plugin-terser'

const
    dev = (process.env.NODE_ENV !== 'production'),
    sourcemap = dev ? 'inline' : false,

    input = './src/main.js',

    watch = { clearScreen: false },

    // web design token replacements
    tokens = {
        __CLOCKSELECTOR__: '.clock',
        __CLOCKINTERVAL__: 1200,
        __CLOCKFORMAT__: 'formatHMS'
    };

console.log(`running in ${dev ? 'development' : 'production'} mode`)

export default [
    {
        // ES6 output
        input,
        watch,

        plugins: [
            replace({
                ...tokens,
                __POLYFILL__: '', // no polyfill for ES6
                preventAssignment: true,
            }),
            resolve({browser: true}),
            commonjs()
        ],

        output: {
            file: './build/bundle.mjs',
            format: 'iife',
            sourcemap,
            plugins: [
                terser({
                    ecma: 2018,
                    mangle: {toplevel:true},
                    compress: {
                        module: true,
                        toplevel: true,
                        unsafe_arrows: true,
                        drop_console: !dev,
                        drop_debugger: !dev,
                    },
                    output: {quote_style: 1}
                })
            ]
        }
    },
    {
        // ES5 output
        input,
        watch,

        plugins: [
            replace({
                ...tokens,
                __POLYFILL__: "import './lib/polyfill.js'", // ES5 polyfill
                preventAssignment: true,
            }),
            resolve({browser: true}),
            commonjs(),
            buble()
        ],

        output: {
            file: './build/bundle.js',
            format: 'iife',
            sourcemap,
            plugins: [
                terser({
                    ecma: 2015,
                    mangle: {toplevel: true},
                    compress: {
                        toplevel: true,
                        drop_console: !dev,
                        drop_debugger: !dev,
                    },
                    output: {quote_style: 1}
                })
            ]
        }
    }
]

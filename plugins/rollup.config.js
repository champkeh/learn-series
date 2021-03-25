import myExample from './rollup-plugin-my-example.js'

export default {
    input: 'main.js',
    output: {
        format: 'iife',
    },
    plugins: [
        myExample()
    ]
}

const path = require('path')
const rollup = require('../src/rollup')

rollup.rollup(path.resolve(__dirname, 'import-default-binding/main.js'), {}).then(bundle => {
    const {code} = bundle.generate()
    console.log(code)
})

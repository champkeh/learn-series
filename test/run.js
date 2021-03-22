const rollup = require('../src/v0.3/rollup')

// const entry = './test/import-default-binding/main.js'
const entry = 'test/form/self-contained-bundle/main'

rollup.rollup(entry, {}).then(bundle => {
    const res = bundle.generate()
    console.log(res)
})


{
    let a = 232;

    {
        let b = 3;
    }
}

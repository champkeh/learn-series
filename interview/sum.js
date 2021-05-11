function asyncAdd(a, b, callback) {
    setTimeout(() => {
        callback(null, a + b)
    }, 1000)
}

function add(a, b) {
    return new Promise(resolve => {
        asyncAdd(a, b, (_, sum) => {
            resolve(sum)
        })
    })
}

function sum(...args) {
    return new Promise(resolve => {
        args.reduce((p, n) => p.then(total => add(total, n)), Promise.resolve(0)).then(resolve)
    })
}

;(async () => {
    const result = await sum(1, 2, 3, 4)
    console.log(result)
})()

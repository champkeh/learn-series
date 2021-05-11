const data = [
    {
        key: '1',
        value: 'xxx',
        children: [
            {
                key: '11',
                value: 'yyy',
                children: [
                    {
                        key: '111',
                        value: 'zzz'
                    }
                ]
            }
        ]
    },
    {
        key: '2',
        value: 'aaa',
        children: [
            {
                key: '22',
                value: 'bbb'
            }
        ]
    },
]


function flat(data, result, prefix = '') {
    data.forEach(obj => {
        const key = prefix ? prefix + '-' + obj.key : obj.key
        result.push({
            key,
            value: obj.value,
        })
        if (obj.children && obj.children.length > 0) {
            flat(obj.children, result, key)
        }
    })
    return result
}

const result = flat(data, [])
console.log(result)


function getBits(binaryNum, mask) {
    const query = binaryNum & mask
    return Boolean(query)
}

function getBitsFrom(binaryNum, position) {
    const mask = 1 << position
    return getBits(binaryNum, mask)
}

function toggleBits(binaryNum, mask) {
    return binaryNum ^ mask
}

function toggleBitsForm(binaryNum, position) {
    const mask = 1 << position
    return toggleBits(binaryNum, mask)
}


// let literal = 0b1000_0000_0000_0000_0000_0000_0000_0000
// let calc = 1 << 31
// console.log(literal)
// console.log(calc)
//
// let query = getBitsFrom(calc, 29)
// console.log(query)

let m = 0b0010_1100_1101_0100_1000
let n = 0b0010_0010_1001_0000_1110_0111_1110_0001
console.log(n)
console.log(n >> 13)

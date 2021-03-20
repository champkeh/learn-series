// time formatting

// return 2-digit value
function timePad(n) {
    return String(n).padStart(2, '0')
}

// return time in HH:MM format
export function formatHM(d = new Date()) {
    return timePad(d.getHours()) + ':' + timePad(d.getMinutes())
}

// return time in HH:MM:SS format
export function formatHMS(d = new Date()) {
    return formatHM(d) + ':' + timePad(d.getSeconds())
}

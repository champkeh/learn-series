const task_start = performance.now()

let count = 0
for (let i = 0; i < 1e2; i++) {
    count++
}

const task_end = performance.now()

console.log(globalThis)
console.log({
    'task': 'Some document task',
    'start_time': task_start,
    'duration': task_end - task_start,
})

const worker = new SharedWorker('worker.js')
worker.port.onmessage = function (e) {
    const msg = e.data

    msg.start_time = msg.start_time - performance.timeOrigin
    msg.end_time = msg.end_time - performance.timeOrigin

    console.log(globalThis)
    console.log(msg)
}
worker.port.postMessage({})

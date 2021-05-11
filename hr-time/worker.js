onconnect = function (e) {
    const port = e.ports[0]
    port.onmessage = function (e) {
        // Time execution in worker
        const task_start = performance.now()
        let count = 0
        for (let i = 0; i < 1e7; i++) {
            count += 1
        }
        const task_end = performance.now()

        port.postMessage({
            'task': 'Some worker task',
            'start_time': task_start + performance.timeOrigin,
            'end_time': task_end + performance.timeOrigin,
            'result': count,
        })
    }
}

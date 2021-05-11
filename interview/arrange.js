function arrange(taskId) {
    const queue = []

    queue.push({type: 'notify', value: taskId})
    return {
        wait(time) {
            queue.push({type: 'wait', value: time})
            return this
        },
        waitFirst(time) {
            queue.unshift({type: 'wait', value: time})
            return this
        },
        do(task) {
            queue.push({type: 'do', value: task})
            return this
        },
        execute() {
            let promise = Promise.resolve()
            queue.forEach(task => {
                promise = promise.then(() => {
                    switch (task.type) {
                        case 'wait':
                            return new Promise(resolve => {
                                setTimeout(() => {
                                    resolve()
                                }, task.value * 1000)
                            })
                        case 'notify':
                            console.log(task.value + ' is notified')
                            break
                        case 'do':
                            console.log('Start do ' + task.value)
                            break
                    }
                })
            })
        }
    }
}

// arrange('William').execute()
// arrange('William').do('commit').execute()
// arrange('William').wait(5).do('commit').execute()
arrange('William').waitFirst(5).do('push').execute()
console.log(2)

const { Machine, interpret } = require('xstate')

const promiseMachine = Machine({
    id: 'promise',
    initial: 'pending',
    states: {
        pending: {
            on: {
                RESOLVE: 'resolved',
                REJECT: 'rejected',
            }
        },
        resolved: {
            type: 'final',
        },
        rejected: {
            type: 'final',
        },
    }
})

const promiseService = interpret(promiseMachine).onTransition(state => {
    console.log(state.value)
})

promiseService.start()

promiseService.send('RESOLVE')
promiseService.send('REJECT')

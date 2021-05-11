const { createMachine, assign, interpret } = require('@xstate/fsm');

const lightMachine = createMachine({
    id: 'light',
    initial: 'green',
    context: { redLights: 0 },
    states: {
        green: {
            on: {
                TIMER: 'yellow',
            }
        },
        yellow: {
            on: {
                TIMER: {
                    target: 'red',
                    actions: 'f1'
                },
            }
        },
        red: {
            entry: assign({ redLights: ctx => ctx.redLights + 1 }),
            on: {
                TIMER: 'green'
            }
        }
    },
}, {
    actions: {
        f1(ctx, event) {
            console.log('action:')
            console.log(ctx)
            console.log(event)
        }
    }
});

const lightService = interpret(lightMachine);

lightService.subscribe(state => {
    console.log('state:')
    console.log(state)
});

lightService.start()

lightService.send('TIMER')
lightService.send('TIMER')

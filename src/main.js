__POLYFILL__
import * as dom from './lib/dom.js'
import {__CLOCKFORMAT__} from './lib/time.js'

// get clock element
const clock = dom.get('__CLOCKSELECTOR__')

if (clock) {
    console.log('initializing clock')

    setInterval(() => {
        clock.textContent = __CLOCKFORMAT__()
    }, __CLOCKINTERVAL__)
}

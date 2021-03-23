import name from './foo';
import { bar } from './bar';

let a = 1;

function foo() {
    console.log(a);
    a = 2;
    console.log(name);
}

console.log(bar)

export default foo

import { c as color, s as size } from './config-65f5a896.js';

CSS.paintWorklet.addModule(new URL('worklet.js', import.meta.url).href);

document.body.innerHTML += `<h1 style="background-image: paint(vertical-lines);">color: ${color}, size: ${size}</h1>`;

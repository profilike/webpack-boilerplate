import createMenu from './components/menu'

let menu = createMenu(['Main','About Us','Portfolio'], 'list-group');
let rootEl = document.getElementById('app-root');
rootEl.appendChild(menu)  

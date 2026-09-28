const fs = require('fs');
const c = fs.readFileSync('src/App.jsx', 'utf8');
const routes = c.match(/<Route path="([^"]+)"/g);
console.log(routes ? routes.join('\n') : 'No routes found');

const fs = require('fs');
const india = require('@svg-maps/india').default;
const paths = india.locations.map(loc => `<path d="${loc.path}" id="${loc.id}" name="${loc.name}" fill="#FFC107" stroke="none" />`).join('');
const svg = `<svg viewBox="${india.viewBox}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
fs.writeFileSync('public/india-map.svg', svg);
console.log('india-map.svg generated successfully');

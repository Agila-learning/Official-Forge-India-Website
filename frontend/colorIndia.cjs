const fs = require('fs');
let svg = fs.readFileSync('public/india-map.svg', 'utf8');
svg = svg.replace(/<svg /, '<svg fill="#FFC107" ');
svg = svg.replace(/fill="[^"]+"/g, 'fill="#FFC107"');
svg = svg.replace(/stroke="[^"]+"/g, 'stroke="none"');
fs.writeFileSync('public/india-map.svg', svg);

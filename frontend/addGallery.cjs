const fs = require('fs');
let c = fs.readFileSync('src/pages/Home.jsx', 'utf8');

if (!c.includes('GallerySection')) {
  c = c.replace(/import DigitalTools from '\.\.\/components\/sections\/DigitalTools';/, "$&\nimport GallerySection from '../components/sections/GallerySection';");
  c = c.replace(/<AboutSection \/>/, "<AboutSection />\n        <GallerySection />");
  fs.writeFileSync('src/pages/Home.jsx', c);
  console.log('Added GallerySection');
}

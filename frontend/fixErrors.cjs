const fs = require('fs');

// 1. Fix SVG React props in Testimonials.jsx
let testContent = fs.readFileSync('src/components/sections/Testimonials.jsx', 'utf8');
testContent = testContent.replace(/stroke-width/g, 'strokeWidth');
testContent = testContent.replace(/stroke-linecap/g, 'strokeLinecap');
testContent = testContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
fs.writeFileSync('src/components/sections/Testimonials.jsx', testContent);

// 2. Fix SVG React props in GallerySection.jsx
let galContent = fs.readFileSync('src/components/sections/GallerySection.jsx', 'utf8');
galContent = galContent.replace(/stroke-width/g, 'strokeWidth');
galContent = galContent.replace(/stroke-linecap/g, 'strokeLinecap');
galContent = galContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
fs.writeFileSync('src/components/sections/GallerySection.jsx', galContent);

// 3. Fix AtomyPreview.jsx double api issue
let atomyContent = fs.readFileSync('src/components/sections/AtomyPreview.jsx', 'utf8');
// Fix if it uses api.get('/api/products') or axios.get('/api/products')
// In our axios instance 'api', baseURL is '/api'
atomyContent = atomyContent.replace(/api\.get\(['`]\/api\/products/g, "api.get('/products");
atomyContent = atomyContent.replace(/axios\.get\(['`]\/api\/products/g, "api.get('/products");
// also fix if it used backticks like `/api/products?category=Atomy...`
atomyContent = atomyContent.replace(/\/api\/products\?/g, '/products?');
fs.writeFileSync('src/components/sections/AtomyPreview.jsx', atomyContent);

console.log("Fixed SVG props and AtomyPreview API endpoint");

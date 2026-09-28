const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Add import
const importGallery = "import GallerySection from '../components/sections/GallerySection';";
const importFIC = "import GallerySection from '../components/sections/GallerySection';\nimport FICExperienceCarousel from '../components/sections/FICExperienceCarousel';";

home = home.replace(importGallery, importFIC);

// Replace component
const oldGallery = "<GallerySection previewMode={true} />";
const newGallery = "<FICExperienceCarousel />\n        <GallerySection previewMode={true} />";

home = home.replace(oldGallery, newGallery);

fs.writeFileSync('src/pages/Home.jsx', home);
console.log('Added FICExperienceCarousel to Home.jsx');

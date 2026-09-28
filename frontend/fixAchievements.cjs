const fs = require('fs');

// 1. Update Testimonials.jsx
let testContent = fs.readFileSync('src/components/sections/Testimonials.jsx', 'utf8');

// Remove mockFallbacks
testContent = testContent.replace(/const mockFallbacks = \[[\s\S]*?\];/g, '');
testContent = testContent.replace(/const displayReviews = reviews\.length > 0 \? reviews : mockFallbacks;/g, 'const displayReviews = reviews;');

// Change slice(0, 6) to slice(0, previewMode ? 3 : undefined) - actually let's just make Testimonials accept previewMode
testContent = testContent.replace(/const Testimonials = \(\) => {/, 'const Testimonials = ({ previewMode = false }) => {');
testContent = testContent.replace(/displayReviews\.slice\(0, 6\)/g, 'displayReviews.slice(0, previewMode ? 3 : undefined)');

// Add a button below if previewMode and displayReviews.length > 3
const buttonHtml = `
  {previewMode && (
    <div className="mt-12 text-center">
      <a href="/achievements" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-blue-600 transition-colors shadow-xl shadow-primary/20">
        View More Achievements <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  )}
`;
testContent = testContent.replace(/<\/div>\s*<div className="mt-20 flex/, `</div>\n${buttonHtml}\n<div className="mt-20 flex`);

fs.writeFileSync('src/components/sections/Testimonials.jsx', testContent);

// 2. Update GallerySection.jsx
let galContent = fs.readFileSync('src/components/sections/GallerySection.jsx', 'utf8');
galContent = galContent.replace(/const GallerySection = \(\) => {/, 'const GallerySection = ({ previewMode = false }) => {');
// Slice gallery items if previewMode
galContent = galContent.replace(/const filteredGallery = filter === 'All' \s*\n\s*\? gallery \s*\n\s*: gallery\.filter\(item => item\.category === filter\);/, `let filteredGallery = filter === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === filter);
    
  if (previewMode) {
    filteredGallery = filteredGallery.slice(0, 3);
  }`);

const galButtonHtml = `
  {previewMode && (
    <div className="mt-12 text-center">
      <a href="/achievements" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-blue-600 transition-colors shadow-xl shadow-primary/20">
        View Full Gallery <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  )}
`;
galContent = galContent.replace(/<\/AnimatePresence>\s*<\/motion\.div>/, `</AnimatePresence>\n        </motion.div>\n${galButtonHtml}`);

fs.writeFileSync('src/components/sections/GallerySection.jsx', galContent);

// 3. Update Home.jsx to pass previewMode={true}
let homeContent = fs.readFileSync('src/pages/Home.jsx', 'utf8');
homeContent = homeContent.replace(/<Testimonials \/>/g, '<Testimonials previewMode={true} />');
homeContent = homeContent.replace(/<GallerySection \/>/g, '<GallerySection previewMode={true} />');
fs.writeFileSync('src/pages/Home.jsx', homeContent);

console.log("Updated Testimonials, Gallery, and Home");

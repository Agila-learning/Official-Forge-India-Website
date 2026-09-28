const fs = require('fs');

// 1. Fix ServicePageTemplate.jsx
let tplContent = fs.readFileSync('src/components/templates/ServicePageTemplate.jsx', 'utf8');
tplContent = tplContent.replace(
  /<a href="#inquiry" className={`px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest bg-gradient-to-r \$\{accentFrom\} \$\{accentTo\} hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 hover:gap-5`}>\n\s*Get Started <ArrowRight size=\{18\} \/>\n\s*<\/a>/,
  `<button onClick={() => document.getElementById('inquiry').scrollIntoView({ behavior: 'smooth' })} className={\`px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest bg-gradient-to-r \${accentFrom} \${accentTo} hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 hover:gap-5\`}>
              Get Started <ArrowRight size={18} />
            </button>`
);
fs.writeFileSync('src/components/templates/ServicePageTemplate.jsx', tplContent);


// 2. Fix Hero.jsx Pill animation
let heroContent = fs.readFileSync('src/components/sections/Hero.jsx', 'utf8');
const oldPillText = 'Technology • Careers • Education • Business';
const newPillText = `<motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 0 }}>Technology</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>Careers</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }}>Education</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 3 }}>Business</motion.span>`;
heroContent = heroContent.replace(oldPillText, newPillText);
fs.writeFileSync('src/components/sections/Hero.jsx', heroContent);


// 3. Fix GallerySection.jsx Lightbox mobile layout & close button
let galContent = fs.readFileSync('src/components/sections/GallerySection.jsx', 'utf8');
// Replace old close button
galContent = galContent.replace(
  /<button\n\s*onClick=\{\(\) => setSelectedImage\(null\)\}\n\s*className="absolute top-6 right-6 p-3 bg-white\/10 hover:bg-white\/20 text-white rounded-full transition-colors"\n\s*>\n\s*<X size=\{24\} \/>\n\s*<\/button>/,
  `<button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[1000] flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors shadow-2xl"
            >
              <X size={18} /> <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Close</span>
            </button>`
);

// Fix layout overflowing in mobile view
// Change from flex-col to overflow-y-auto on mobile
galContent = galContent.replace(
  /className="max-w-5xl w-full max-h-\[85vh\] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"/,
  'className="max-w-5xl w-full max-h-[90vh] md:max-h-[85vh] bg-slate-800 rounded-3xl overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row relative mt-8 md:mt-0"'
);
galContent = galContent.replace(
  /className="flex-1 bg-black relative flex items-center justify-center min-h-\[300px\] md:min-h-\[500px\]"/,
  'className="flex-1 bg-black/50 relative flex items-center justify-center min-h-[40vh] md:min-h-[500px]"'
);
fs.writeFileSync('src/components/sections/GallerySection.jsx', galContent);


// 4. Add Blast animation to AchievementsPage.jsx
let achContent = fs.readFileSync('src/pages/AchievementsPage.jsx', 'utf8');

if (!achContent.includes('framer-motion')) {
  achContent = achContent.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';");
}

const blastHtml = `
      <AnimatePresence>
        {showBlast && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
          >
            <div className="w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gradient-to-r from-primary via-blue-400 to-cyan-300 opacity-50 mix-blend-screen blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
`;

if (!achContent.includes('showBlast')) {
  achContent = achContent.replace('const AchievementsPage = () => {', 'const AchievementsPage = () => {\n  const [showBlast, setShowBlast] = useState(true);\n  useEffect(() => {\n    const timer = setTimeout(() => setShowBlast(false), 1500);\n    return () => clearTimeout(timer);\n  }, []);\n');
  achContent = achContent.replace('<main className="bg-white">', `<main className="bg-white relative overflow-hidden">\n${blastHtml}`);
  fs.writeFileSync('src/pages/AchievementsPage.jsx', achContent);
}

console.log("Applied all 4 fixes!");

const fs = require('fs');

// 1. Fix Hero.jsx pill
let hero = fs.readFileSync('src/components/sections/Hero.jsx', 'utf8');
hero = hero.replace(
  'className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest mb-8 backdrop-blur-md"',
  'className="inline-flex flex-wrap justify-center items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 rounded-3xl md:rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest mb-8 backdrop-blur-md max-w-[90vw]"'
);
fs.writeFileSync('src/components/sections/Hero.jsx', hero);


// 2. Fix AchievementsPage.jsx blast animation
let ach = fs.readFileSync('src/pages/AchievementsPage.jsx', 'utf8');
ach = ach.replace(
  '<div className="w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gradient-to-r from-primary via-blue-400 to-cyan-300 opacity-50 mix-blend-screen blur-xl" />',
  '<div className="w-[100vw] h-[100vh] bg-gradient-to-br from-primary via-blue-500 to-cyan-300 opacity-80" />'
);
ach = ach.replace(
  'animate={{ scale: 3, opacity: 0 }}',
  'animate={{ scale: [1, 1], opacity: [1, 0.8, 0] }}'
);
ach = ach.replace(
  'transition={{ duration: 1.2, ease: "easeOut" }}',
  'transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.4, 1] }}'
);
fs.writeFileSync('src/pages/AchievementsPage.jsx', ach);


// 3. Fix GallerySection.jsx lightbox text scrolling and alignment
let gal = fs.readFileSync('src/components/sections/GallerySection.jsx', 'utf8');
gal = gal.replace(
  'className="w-full md:w-80 bg-white p-8 flex flex-col justify-center shrink-0"',
  'className="w-full md:w-96 bg-white p-8 flex flex-col shrink-0 overflow-y-auto"'
);
fs.writeFileSync('src/components/sections/GallerySection.jsx', gal);

console.log("Fixed pill, blast, and gallery modal scrolling");

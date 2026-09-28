const fs = require('fs');
let ach = fs.readFileSync('src/pages/AchievementsPage.jsx', 'utf8');

const oldBlastRegex = /<AnimatePresence>.*?<\/AnimatePresence>/s;

const newBlast = `<AnimatePresence>
        {showBlast && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden bg-slate-900/40 backdrop-blur-sm"
          >
            {/* Massive Color Expanding Orb */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.5, 3], opacity: [1, 0.8, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[50vmin] h-[50vmin] rounded-full bg-gradient-to-tr from-primary via-blue-500 to-cyan-300 mix-blend-screen blur-[80px]"
            />
            {/* Particles Explosion */}
            {[...Array(40)].map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 50 + Math.random() * 150;
              const tx = Math.cos(angle) * velocity;
              const ty = Math.sin(angle) * velocity;
              const colors = ['bg-primary', 'bg-blue-400', 'bg-cyan-300', 'bg-amber-400', 'bg-indigo-500'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, Math.random() + 0.5, 0], 
                    opacity: [1, 1, 0],
                    x: tx + "vw",
                    y: ty + "vh"
                  }}
                  transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                  className={\`absolute w-4 h-4 md:w-6 md:h-6 rounded-full \${color} shadow-lg\`}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>`;

ach = ach.replace(oldBlastRegex, newBlast);
fs.writeFileSync('src/pages/AchievementsPage.jsx', ach);
console.log('Fixed blast');

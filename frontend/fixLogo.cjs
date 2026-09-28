const fs = require('fs');

let nav = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');

const oldLogoSection = `<div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center gap-2 group relative shrink-0">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
              <motion.img 
                src="/logo.jpg" 
                alt="Forge India Connect" 
                decoding="async"
                className="w-[90%] h-[90%] object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo.jpg";
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] md:text-sm lg:text-[13px] xl:text-lg 2xl:text-xl font-black tracking-tighter block leading-none uppercase truncate">
                <span className="text-blue-600 dark:text-blue-400">FORGE INDIA</span>
              </span>
              <div className="mt-0.5 scale-[0.5] md:scale-[0.8] lg:scale-[0.7] xl:scale-100 origin-left flex justify-start">
                <AnimatedConnectText key={location.pathname} />
              </div>
            </div>
            </Link>
          </div>`;

const newLogoSection = `<div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group relative shrink-0 transition-opacity hover:opacity-90">
              <img 
                src="/logo.jpg" 
                alt="FIC Mark" 
                decoding="async"
                className="h-10 lg:h-12 xl:h-14 w-auto object-contain mix-blend-multiply dark:mix-blend-screen shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo.jpg";
                }}
              />
              <div className="flex flex-col justify-center min-w-0 pt-0.5">
                <span className="text-[14px] md:text-[16px] lg:text-[20px] xl:text-[24px] font-bold tracking-tight block leading-none uppercase text-blue-700 dark:text-blue-400 font-sans" style={{ letterSpacing: '0.02em' }}>
                  FORGE INDIA
                </span>
                <div className="mt-0.5 md:mt-1 scale-[0.6] md:scale-[0.7] lg:scale-[0.85] xl:scale-[1.1] origin-left flex justify-start">
                  <AnimatedConnectText key={location.pathname} />
                </div>
              </div>
            </Link>
          </div>`;

nav = nav.replace(oldLogoSection, newLogoSection);
fs.writeFileSync('src/components/layout/Navbar.jsx', nav);
console.log('Fixed Header Logo');

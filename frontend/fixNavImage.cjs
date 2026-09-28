const fs = require('fs');

let nav = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');

const oldLogoRegex = /<img\s*src="\/logo\.jpg"[^>]+>/;
const newLogo = `<img 
                src="/fic-symbol.png" 
                alt="FIC Mark" 
                decoding="async"
                className="h-10 lg:h-12 xl:h-14 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo.jpg";
                }}
              />`;

nav = nav.replace(oldLogoRegex, newLogo);
fs.writeFileSync('src/components/layout/Navbar.jsx', nav);
console.log("Updated Navbar Logo Image");

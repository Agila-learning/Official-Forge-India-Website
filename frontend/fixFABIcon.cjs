const fs = require('fs');
let c = fs.readFileSync('src/components/ui/GlobalCTABar.jsx', 'utf8');

c = c.replace(
  /<svg className="w-7 h-7 fill-white" viewBox="0 0 24 24"><path d="[^"]+"\/><\/svg>/g,
  '<MessageCircle size={28} className="text-white" />'
);

fs.writeFileSync('src/components/ui/GlobalCTABar.jsx', c);

const fs = require('fs');
let c = fs.readFileSync('src/components/ui/ChatWidget.jsx', 'utf8');

// Remove FAB
c = c.replace(/\{\/\* Floating Chat Button \*\/\}[\s\S]*?<\/motion\.button>/g, '{/* FAB Removed */}');

// Add Close button to Threads list
c = c.replace(/<button\s*\n?\s*onClick=\{\(\) => setTab\(tab === 'threads' \? 'contacts' : 'threads'\)\}[\s\S]*?<\/button>/, `$&
  <button onClick={() => setIsOpen(false)} className="px-2 py-1.5 rounded-xl text-zinc-400 hover:text-white transition-all">
    <X size={18} />
  </button>`);

// Add Close button to Active Chat header
c = c.replace(/<button className="p-2 bg-white\/5 hover:bg-white\/10 rounded-xl text-white transition-all">\s*<Phone size=\{18\} \/>\s*<\/button>/, `$&
  <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl text-white transition-all">
    <X size={18} />
  </button>`);

fs.writeFileSync('src/components/ui/ChatWidget.jsx', c);

const fs = require('fs');
let c = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');

c = c.replace(
  '{React.cloneElement(item.icon, { size: 14 })}',
  '{item.icon ? React.cloneElement(item.icon, { size: 14 }) : <ChevronRight size={14} />}'
);

fs.writeFileSync('src/components/layout/Navbar.jsx', c);
console.log('Fixed Navbar.jsx cloneElement issue');

const fs = require('fs');

let page = fs.readFileSync('src/pages/JobConsultingPage.jsx', 'utf8');

const oldStr = `  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Tactical Partners</p>
  <div className="flex flex-wrap gap-x-6 gap-y-3">
  {sector.companies.map(c => <span key={c} className="text-gray-500 dark:text-gray-400 font-black text-xs md:text-sm uppercase tracking-tight">{c}</span>)}
  </div>
  </div>
  </div>`;

const newStr = `  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Tactical Partners</p>
  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
  {sector.companies.map(c => <span key={c} className="text-gray-500 dark:text-gray-400 font-black text-xs md:text-sm uppercase tracking-tight">{c}</span>)}
  </div>
  <Link 
    to={sector.name.includes('Banking') ? '/services/category/banking-finance' : '/explore-jobs'} 
    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary hover:text-white transition-all border border-gray-200 dark:border-gray-800 hover:border-primary mt-6"
  >
    {sector.name.includes('Banking') ? 'View Jobs' : 'Find Jobs'} <ArrowRight size={14} />
  </Link>
  </div>
  </div>`;

let lines = page.split('\n');
let replaced = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Tactical Partners')) {
    // This is line 200 basically.
    lines.splice(i+1, 1, '  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">');
    // Lines structure:
    // i: Tactical Partners
    // i+1: div
    // i+2: {sector.companies...
    // i+3: </div>
    // i+4: </div>
    // Insert after i+3
    const insertStr = `  <Link 
    to={sector.name.includes('Banking') ? '/services/category/banking-finance' : '/explore-jobs'} 
    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary hover:text-white transition-all border border-gray-200 dark:border-gray-800 hover:border-primary mt-6"
  >
    {sector.name.includes('Banking') ? 'View Jobs' : 'Find Jobs'} <ArrowRight size={14} />
  </Link>`;
    lines.splice(i+4, 0, insertStr);
    replaced = true;
    break;
  }
}

if (replaced) {
  fs.writeFileSync('src/pages/JobConsultingPage.jsx', lines.join('\n'));
  console.log('Successfully inserted buttons.');
} else {
  console.log('Failed to find Tactical Partners section.');
}

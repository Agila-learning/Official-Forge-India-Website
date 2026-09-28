const fs = require('fs');
let content = fs.readFileSync('src/pages/ExploreJobs.jsx', 'utf8');

// Find the index of '<div className="flex-grow text-center md:text-left">'
const startIndex = content.indexOf('<div className="flex-grow text-center md:text-left">');
// Find the index of '</motion.div>' which comes after startIndex
const endIndex = content.indexOf('</motion.div>', startIndex) + '</motion.div>'.length;

const cleanBlock = `<div className="flex-grow text-center md:text-left">
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
    <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight text-gray-900 dark:text-white">{job.title}</h3>
    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest self-center md:self-auto font-black">
      {job.status}
    </span>
  </div>
  <p className="font-bold text-gray-600 dark:text-gray-400 mb-4">{job.companyName}</p>
  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-bold uppercase tracking-tight">
    <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {job.location}</span>
    <span className="flex items-center gap-2"><DollarSign size={16} className="text-secondary" /> {job.salary}</span>
    <span className="flex items-center gap-2"><Briefcase size={16} className="text-purple-400" /> {job.experience || 'Entry Level'}</span>
    <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {new Date(job.createdAt).toLocaleDateString()}</span>
  </div>
</div>
<div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
  <button
    onClick={() => setViewingJob(job)}
    className="w-full px-6 py-3 font-black rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest text-[10px]"
  >
    <Eye size={15} /> View Details
  </button>
  <button
    onClick={() => !myApplications.some(app => app.job?._id === job._id) && handleApply(job)}
    disabled={myApplications.some(app => app.job?._id === job._id)}
    className={\`w-full px-8 py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest text-xs \${
      myApplications.some(app => app.job?._id === job._id)
      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 cursor-not-allowed shadow-none'
      : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
    }\`}
  >
    {myApplications.some(app => app.job?._id === job._id) ? <><CheckCircle2 size={18} /> Applied</> : <><ArrowRight size={18} /> Apply Now</>}
  </button>
</div>
</motion.div>`;

content = content.substring(0, startIndex) + cleanBlock + content.substring(endIndex);
fs.writeFileSync('src/pages/ExploreJobs.jsx', content);

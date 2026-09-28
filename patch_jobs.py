content = open(r'frontend/src/pages/ExploreJobs.jsx', encoding='utf-8').read()

# Find the IIFE apply button block dynamically
idx = content.find('const alreadyApplied = myApplications.some(app =>')
end_idx = content.find('</motion.div>', idx) + len('</motion.div>')
old_block = content[idx-4:end_idx]

new_block = (
    '  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">\n'
    '  <button\n'
    '  onClick={() => setViewingJob(job)}\n'
    '  className="w-full px-6 py-3 font-black rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest text-[10px]"\n'
    '  >\n'
    '  <Eye size={15} /> View Details\n'
    '  </button>\n'
    '  {(() => {\n'
    '  const alreadyApplied = myApplications.some(app => app.job?._id === job._id);\n'
    '  return (\n'
    '  <button\n'
    '  onClick={() => !alreadyApplied && handleApply(job)}\n'
    '  disabled={alreadyApplied}\n'
    '  className={`w-full px-8 py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest text-xs ${\n'
    "  alreadyApplied\n"
    "  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 cursor-not-allowed shadow-none'\n"
    "  : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'\n"
    '  }`}\n'
    '  >\n'
    '  {alreadyApplied ? <><CheckCircle2 size={18} /> Applied</> : <><ArrowRight size={18} /> Apply Now</>}\n'
    '  </button>\n'
    '  );\n'
    '  })()}\n'
    '  </div>\n'
    '  </motion.div>'
)

modal_html = (
    '\n  {/* ── JOB DESCRIPTION MODAL ── */}\n'
    '  <AnimatePresence>\n'
    '  {viewingJob && (\n'
    '  <motion.div\n'
    '  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}\n'
    '  onClick={() => setViewingJob(null)}\n'
    '  className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-4 overflow-y-auto"\n'
    '  >\n'
    '  <motion.div\n'
    '  initial={{ opacity: 0, scale: 0.9, y: 20 }}\n'
    '  animate={{ opacity: 1, scale: 1, y: 0 }}\n'
    '  exit={{ opacity: 0, scale: 0.9, y: 20 }}\n'
    '  onClick={e => e.stopPropagation()}\n'
    '  className="w-full max-w-2xl my-auto bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden"\n'
    '  >\n'
    '  <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start gap-4">\n'
    '  <div>\n'
    '  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-[9px] font-black uppercase rounded-full tracking-widest inline-block mb-2">{viewingJob.status}</span>\n'
    '  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{viewingJob.title}</h3>\n'
    '  <p className="text-gray-500 dark:text-gray-400 font-bold">{viewingJob.companyName}</p>\n'
    '  </div>\n'
    '  <button onClick={() => setViewingJob(null)} className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors">\n'
    '  <X size={18} />\n'
    '  </button>\n'
    '  </div>\n'
    '  <div className="p-8 space-y-6 max-h-[55vh] overflow-y-auto">\n'
    '  <div className="flex flex-wrap gap-2">\n'
    '  <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><MapPin size={11} /> {viewingJob.location}</span>\n'
    '  <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><DollarSign size={11} /> {viewingJob.salary}</span>\n'
    '  <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={11} /> {viewingJob.experience || "Entry Level"}</span>\n'
    '  </div>\n'
    '  {viewingJob.description ? (\n'
    '  <div>\n'
    '  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-3">Job Description</h4>\n'
    '  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-medium whitespace-pre-wrap">{viewingJob.description}</p>\n'
    '  </div>\n'
    '  ) : (\n'
    '  <p className="text-gray-400 italic text-sm">No detailed description available. Contact our team for more information.</p>\n'
    '  )}\n'
    '  {viewingJob.requirements && (\n'
    '  <div>\n'
    '  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-3">Requirements</h4>\n'
    '  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-medium whitespace-pre-wrap">{viewingJob.requirements}</p>\n'
    '  </div>\n'
    '  )}\n'
    '  </div>\n'
    '  <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">\n'
    '  <button onClick={() => { setSelectedJob(viewingJob); setIsFormOpen(true); setViewingJob(null); }} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">\n'
    '  <ArrowRight size={16} /> Apply for This Job\n'
    '  </button>\n'
    '  <button onClick={() => setViewingJob(null)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">\n'
    '  Close\n'
    '  </button>\n'
    '  </div>\n'
    '  </motion.div>\n'
    '  </motion.div>\n'
    '  )}\n'
    '  </AnimatePresence>\n'
)

if old_block in content:
    content = content.replace(old_block, new_block)
    print('Replaced apply button block')
else:
    print('Block not found')

marker = '\n  {/* Mobile Filter Drawer */}'
if marker in content:
    content = content.replace(marker, modal_html + '\n\n  {/* Mobile Filter Drawer */}')
    print('Added modal block')

with open(r'frontend/src/pages/ExploreJobs.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')

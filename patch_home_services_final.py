import re

content = open(r'frontend/src/pages/HomeServices/HomeServices.jsx', encoding='utf-8').read()

idx_start = content.find(' {/* --- SERVICE GRID SECTION --- */}')
idx_end = content.find('  </main>')

if idx_start != -1 and idx_end != -1:
    launching_soon = """ {/* --- LAUNCHING SOON SECTION --- */}
 <main className="max-w-7xl mx-auto py-20 px-6 text-center">
   <motion.div 
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     className="max-w-3xl mx-auto bg-white/5 rounded-[3rem] border border-white/10 p-12 overflow-hidden relative shadow-2xl"
   >
     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
     <div className="relative z-10">
       <div className="w-24 h-24 mx-auto bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
         <Clock size={40} />
       </div>
       <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Launching <span className="text-blue-500">Soon</span></h2>
       <p className="text-white/60 font-medium text-lg mb-8 leading-relaxed">
         We are currently refining our operational protocols. Premium home cleaning, plumbing, salon services, and more will be available shortly in your area.
       </p>
       <div className="inline-flex px-8 py-4 bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-[0.4em] rounded-full">
         Stay Tuned for Updates
       </div>
     </div>
   </motion.div>\n"""
    
    content = content[:idx_start] + launching_soon + content[idx_end:]
    open(r'frontend/src/pages/HomeServices/HomeServices.jsx', 'w', encoding='utf-8').write(content)
    print("Success")
else:
    print("Could not find sections")

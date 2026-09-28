content = open(r'frontend/src/pages/HomeServices/HomeServices.jsx', encoding='utf-8').read()

old_cats = '''const detailedCategories = [
 { id: 'cleaning', title: 'Deep Cleaning', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
 { id: 'maintenance', title: 'Maintenance', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10' },
 { id: 'painting', title: 'Painting', icon: Paintbrush, color: 'text-purple-500', bg: 'bg-purple-500/10' },
 { id: 'plumbing', title: 'Plumbing', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { id: 'electrician', title: 'Electrician', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
];'''

new_cats = '''const detailedCategories = [
 { id: 'cleaning', title: 'Home Cleaning', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
 { id: 'plumbing', title: 'Plumbing', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { id: 'salon', title: 'Salon Service', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
 { id: 'maintenance', title: 'Maintenance', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10' },
 { id: 'electrician', title: 'Electrician', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
];'''

import re
# normalize line endings
content = content.replace('\r\n', '\n')

content = re.sub(
    r'const detailedCategories = \[.*?\];', 
    new_cats, 
    content, 
    flags=re.DOTALL
)

idx_start = content.find(' {/* --- SERVICE GRID SECTION --- */}')
idx_end = content.find(' {/* --- PREMIUM MEMBERSHIP PROMO --- */}')

if idx_start != -1 and idx_end != -1:
    launching_soon = ''' {/* --- LAUNCHING SOON SECTION --- */}
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
   </motion.div>
 </main>\n\n'''
    content = content[:idx_start] + launching_soon + content[idx_end:]
    print("Replaced grid with launching soon.")
else:
    print("Could not find section markers")
    print(idx_start, idx_end)

open(r'frontend/src/pages/HomeServices/HomeServices.jsx', 'w', encoding='utf-8').write(content)

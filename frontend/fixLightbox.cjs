const fs = require('fs');

let gal = fs.readFileSync('src/components/sections/GallerySection.jsx', 'utf8');

// Replace the Lightbox section
const oldLightboxRegex = /\{\/\* Lightbox \*\/\}.*?<\/section>/s;

const newLightbox = `{/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full h-[90vh] md:h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Image Section */}
              <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-4 md:p-8 h-[40vh] md:h-full">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </div>

              {/* Text Section */}
              <div className="w-full md:w-[400px] bg-white flex flex-col h-[50vh] md:h-full border-l border-slate-100">
                
                {/* Sticky Header with Back Button */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px] bg-slate-50 px-4 py-2 rounded-full hover:bg-primary/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Gallery
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                  <span className="inline-block px-3 py-1.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-4">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{selectedImage.title}</h3>
                  
                  {selectedImage.description && (
                    <div className="text-slate-600 leading-relaxed text-sm font-medium space-y-4">
                      {selectedImage.description.split('\\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>`;

gal = gal.replace(oldLightboxRegex, newLightbox);
fs.writeFileSync('src/components/sections/GallerySection.jsx', gal);
console.log('Fixed Lightbox');

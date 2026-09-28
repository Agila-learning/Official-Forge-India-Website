import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const GallerySection = ({ previewMode = false }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const CATEGORIES = ['All', 'Industrial Visits', 'Internships', 'Company Achievements', 'Placement Achievements'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        // Only active items, sorted by displayOrder
        const activeItems = (data || []).filter(item => item.isActive !== false).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setGallery(activeItems);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  let filteredGallery = filter === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === filter);
    
  if (previewMode) {
    filteredGallery = filteredGallery.slice(0, 3);
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (gallery.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="gallery">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6"
          >
            <ImageIcon size={14} />
            Our Moments
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            FIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Gallery</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg"
          >
            A glimpse into our successful industrial visits, internship programs, and corporate achievements.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat, idx) => {
            // Hide filter if no images for this category (except 'All')
            if (cat !== 'All' && !gallery.some(g => g.category === cat)) return null;
            return (
              <button
                key={idx}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] bg-slate-100 shadow-md hover:shadow-xl transition-all"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 block">{item.category}</span>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

  {previewMode && (
    <div className="mt-12 text-center">
      <a href="/achievements" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-blue-600 transition-colors shadow-xl shadow-primary/20">
        View Full Gallery <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  )}


        {filteredGallery.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">No images found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
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
                      {selectedImage.description.split('\n').map((line, i) => (
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
    </section>
  );
};

export default GallerySection;

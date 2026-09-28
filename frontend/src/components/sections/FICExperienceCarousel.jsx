import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Building, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';

const FICExperienceCarousel = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const CATEGORIES = ['All', 'Industrial Visits', 'Internships', 'Company Achievements', 'Placement Achievements'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        // Only active items, preferably featured, sorted by order
        let activeItems = (data || []).filter(item => item.isActive !== false);
        
        // If there are featured items, put them first
        activeItems.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });

        setGallery(activeItems);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredGallery = filter === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === filter);

  // Autoplay
  useEffect(() => {
    if (isHovered || filteredGallery.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, filteredGallery.length, filter]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (gallery.length === 0) return null;

  const currentItem = filteredGallery[currentIndex];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="fic-experience">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6"
          >
            <ImageIcon size={14} />
            FIC In Action
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 uppercase"
          >
            Real Moments. Real Experiences. <br className="hidden md:block"/> <span className="text-primary">Real Connections.</span>
          </motion.h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {CATEGORIES.map((cat, idx) => {
            if (cat !== 'All' && !gallery.some(g => g.category === cat)) return null;
            return (
              <button
                key={idx}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  filter === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-white text-slate-500 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filteredGallery.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">No experiences available in this category yet.</p>
          </div>
        ) : (
          <div 
            className="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-auto lg:h-[600px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            
            {/* Image Section */}
            <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-full relative overflow-hidden bg-black gallery-img">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem._id}
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full object-contain md:object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/3 bg-white p-8 lg:p-12 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col h-full"
                >
                  <span className="inline-block px-3 py-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                    {currentItem.category}
                  </span>
                  
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                    {currentItem.title}
                  </h3>
                  
                  {currentItem.description && (
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-8 line-clamp-4">
                      {currentItem.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="mt-auto space-y-4">
                    {currentItem.organization && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Building size={14} className="text-slate-500" />
                        </div>
                        {currentItem.organization}
                      </div>
                    )}
                    {currentItem.location && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-slate-500" />
                        </div>
                        {currentItem.location}
                      </div>
                    )}
                    {currentItem.date && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Calendar size={14} className="text-slate-500" />
                        </div>
                        {new Date(currentItem.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {filteredGallery.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 lg:right-[35%] top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 lg:left-1/3 -translate-x-1/2 flex items-center gap-2 z-20">
                  {filteredGallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-white/50 hover:bg-white'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FICExperienceCarousel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import GallerySection from '../components/sections/GallerySection';
import Testimonials from '../components/sections/Testimonials';

const AchievementsPage = () => {
  const [showBlast, setShowBlast] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowBlast(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEOMeta 
        title="Achievements & Success Stories | Forge India Connect"
        description="View our gallery, industrial visits, placement achievements, and success stories."
        keywords="achievements, gallery, success stories, Forge India Connect"
        canonical="/achievements"
      />
      <main className="bg-white relative overflow-hidden">

      <AnimatePresence>
        {showBlast && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden bg-slate-900/40 backdrop-blur-sm"
          >
            {/* Massive Color Expanding Orb */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.5, 3], opacity: [1, 0.8, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[50vmin] h-[50vmin] rounded-full bg-gradient-to-tr from-primary via-blue-500 to-cyan-300 mix-blend-screen blur-[80px]"
            />
            {/* Particles Explosion */}
            {[...Array(40)].map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 50 + Math.random() * 150;
              const tx = Math.cos(angle) * velocity;
              const ty = Math.sin(angle) * velocity;
              const colors = ['bg-primary', 'bg-blue-400', 'bg-cyan-300', 'bg-amber-400', 'bg-indigo-500'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, Math.random() + 0.5, 0], 
                    opacity: [1, 1, 0],
                    x: tx + "vw",
                    y: ty + "vh"
                  }}
                  transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                  className={`absolute w-4 h-4 md:w-6 md:h-6 rounded-full ${color} shadow-lg`}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

        <div className="pt-24 pb-12 bg-slate-50 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Our <span className="text-primary">Achievements</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            Explore our full gallery of events, industrial visits, and hear from the partners, students, and clients who have transformed their careers and businesses with us.
          </p>
        </div>
        <GallerySection previewMode={false} />
        <Testimonials previewMode={false} />
      </main>
    </>
  );
};

export default AchievementsPage;

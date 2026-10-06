import React from 'react';
import { motion } from 'framer-motion';

const NetworkBanner = () => {
  return (
    <section className="py-24 bg-[#0a4275] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/landing-banner.png" 
          alt="Forge India Connect Network" 
          className="w-full h-full object-cover object-center opacity-90"
        />
        {/* Subtle overlay to ensure any overlay text would be readable, though currently it's just the image */}
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-white/20">
            Pan-India Presence
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-tight drop-shadow-lg">
            Connecting Talent & Business <br/> <span className="text-blue-200">Across the Nation</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default NetworkBanner;

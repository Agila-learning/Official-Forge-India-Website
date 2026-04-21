import React from 'react';
import { motion } from 'framer-motion';
import CTA from '../components/sections/CTA';

const clientsData = [
  { 
    category: 'Banking & Finance', 
    logos: [
      { name: 'HDFC Bank', url: '/Clientele/hdfc.webp' },
      { name: 'Axis Bank', url: '/Clientele/axis.webp' },
      { name: 'Kotak Mahindra', url: '/Clientele/kotak-mahindra.webp' },
      { name: 'Muthoot Finance', url: '/Clientele/muthoot.webp' },
      { name: 'Equitas Bank', url: '/Clientele/equitas.webp' },
      { name: 'AU Small Finance', url: '/Clientele/au.webp' },
      { name: 'City Union Bank', url: '/Clientele/cub.webp' },
    ] 
  },
  { 
    category: 'IT & Technology', 
    logos: [
      { name: 'Tech Mahindra', url: '/Clientele/techmahindra.webp' },
      { name: 'Capgemini', url: '/Clientele/capgemeni.webp' },
      { name: 'Movate', url: '/Clientele/movate.webp' },
      { name: 'KocharTech', url: '/Clientele/kochar.webp' },
      { name: 'Teleperformance', url: '/Clientele/tp.webp' },
      { name: 'UnitedHealth Group', url: '/Clientele/uhg.webp' },
    ] 
  },
  { 
    category: 'Manufacturing & Industrial', 
    logos: [
      { name: 'Hyundai Moins', url: '/Clientele/hyundai.webp' },
      { name: 'Tata Steel', url: '/Clientele/tata.webp' },
      { name: 'Foxconn', url: '/Clientele/foxconn.webp' },
      { name: 'Delta Electronics', url: '/Clientele/delta.webp' },
      { name: 'Ather Energy', url: '/Clientele/ather.webp' },
    ] 
  },
  { 
    category: 'Professional Services', 
    logos: [
      { name: 'Ma Foi', url: '/Clientele/mafoi.webp' },
      { name: 'Polaris', url: '/Clientele/polaris.webp' },
    ] 
  }
];

const Clientele = () => {
  return (
    <div className="pt-20 bg-white dark:bg-dark-bg min-h-screen flex flex-col">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter"
          >
            Our Elite <span className="animated-text-gradient">Partnership</span> Network
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium"
          >
            Driving innovation and excellence alongside India's most respected corporate leaders.
          </motion.p>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-24 flex-grow relative z-10 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {clientsData.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-16 flex items-center gap-4">
                <span className="w-12 h-1.5 bg-secondary rounded-full"></span>
                {section.category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
                {section.logos.map((logo, logoIdx) => (
                  <motion.div 
                    key={logoIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: logoIdx * 0.05 }}
                    className="group"
                  >
                    <div className="glass-card h-40 flex items-center justify-center p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-3 transition-all duration-500 bg-white dark:bg-dark-card overflow-hidden">
                      <img 
                        src={logo.url} 
                        alt={logo.name} 
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 brightness-110 dark:brightness-125" 
                      />
                    </div>
                    <p className="mt-4 text-center text-sm font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest leading-none">
                        {logo.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default Clientele;

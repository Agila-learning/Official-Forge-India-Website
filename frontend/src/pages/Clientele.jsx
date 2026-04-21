import React from 'react';
import { motion } from 'framer-motion';
import CTA from '../components/sections/CTA';
import SEOMeta from '../components/ui/SEOMeta';

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
    <>
      <SEOMeta 
        title="Our Clientele | Trusted Partners | Forge India Connect"
        description="Explore the elite partnership network of Forge India Connect. We work with India's most respected corporate leaders in Banking, IT, and Manufacturing."
        canonical="/clientele"
      />
      
      <div className="pt-20 bg-slate-50 dark:bg-dark-bg min-h-screen">
        {/* Hero Header */}
        <section className="relative py-24 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
          </div>
          <div className="container-xl text-center relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6"
            >
              Our Ecosystem
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
            >
              Elite <span className="text-primary italic">Partnerships.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium"
            >
              Driving innovation alongside India's most respected corporate leaders and industrial pioneers.
            </motion.p>
          </div>
        </section>

        {/* Logos Section */}
        <section className="py-24 bg-white dark:bg-dark-bg">
          <div className="container-xl space-y-32">
            {clientsData.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-6 mb-16">
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{section.category}</h3>
                   <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-12">
                  {section.logos.map((logo, logoIdx) => (
                    <motion.div 
                      key={logoIdx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: logoIdx * 0.05 }}
                      className="group"
                    >
                      <div className="aspect-[4/3] flex items-center justify-center p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-card hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img 
                          src={logo.url} 
                          alt={logo.name} 
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 relative z-10" 
                        />
                      </div>
                      <p className="mt-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
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
    </>
  );
};

export default Clientele;

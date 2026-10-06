import React from 'react';
import { motion } from 'framer-motion';

const clients = [
  '/Clientele/hdfc.webp', '/Clientele/axis.webp', '/Clientele/kotak-mahindra.webp',
  '/Clientele/techmahindra.webp', '/Clientele/capgemeni.webp', '/Clientele/hyundai.webp',
  '/Clientele/tata.webp', '/Clientele/mafoi.webp', '/Clientele/manipal-unext.webp'
];

const ClientMarquee = () => {
  return (
    <section className="w-full bg-slate-50 py-10 border-b border-slate-100 overflow-hidden flex flex-col items-center">
      <div className="container-xl mx-auto px-6 mb-8">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Our Trusted Partners</p>
      </div>
      <div className="flex w-full overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          className="flex gap-16 whitespace-nowrap items-center"
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {clients.concat(clients, clients).map((logo, i) => (
            <div key={i} className="flex items-center justify-center shrink-0 w-32 h-16 opacity-100 transition-all duration-300 hover:scale-110">
              <img src={logo} alt="Client Logo" className="max-w-full max-h-full object-contain" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientMarquee;

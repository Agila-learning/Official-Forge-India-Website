import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, Code, ShieldCheck, Briefcase, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EXTERNAL_APPS } from '../../config/externalApps';

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop" 
          alt="IT Employees collaborating" 
          className="w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900" />
      </div>
      
      {/* Soft Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 z-0" />

      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10 pt-12 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex flex-wrap justify-center items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 rounded-3xl md:rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest mb-8 backdrop-blur-md max-w-[90vw]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 0 }}>Technology</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>Careers</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }}>Education</motion.span> • <motion.span animate={{ color: ['#ffffff', '#3b82f6', '#ffffff'] }} transition={{ duration: 4, repeat: Infinity, delay: 3 }}>Business</motion.span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8 drop-shadow-lg"
          >
            Technology, Careers & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-cyan-300">
              Business Solutions That Move You Forward.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Forge India Connect brings technology solutions, career opportunities, student programs and business growth services together under one trusted platform. <br/><span className="text-sm mt-2 block opacity-80">Looking for our core IT services? <Link to="/it-company-in-krishnagiri" className="text-primary hover:underline font-bold">Explore our Krishnagiri IT services</Link>.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry', { detail: { source: 'Hero Section' } }))}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </button>
            
            <button 
              onClick={() => {
                document.getElementById('explore-fic').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 hover:border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              Explore FIC
            </button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;

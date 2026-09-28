import React from 'react';
import { EXTERNAL_APPS } from '../../config/externalApps';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="py-32 px-6 bg-slate-900 text-white relative z-10 overflow-hidden text-center border-t border-slate-800">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/20 blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-12">
          Where Your Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Opportunity Begins</span>
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
          <Link 
            to="/training-placement" 
            className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Explore Internships & Projects <ArrowRight size={16} />
          </Link>
          <a 
            href={EXTERNAL_APPS.JOB_PORTAL}
            target="_blank"
            rel="noopener noreferrer" 
            className="px-8 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Find Your Next Job <ArrowUpRight size={16} />
          </a>
          <Link 
            to="/it-solutions" 
            className="px-8 py-5 bg-slate-800 border border-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            Build With FIC <ArrowRight size={16} />
          </Link>
        </div>

        <a 
          href={EXTERNAL_APPS.PORTFOLIO} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group"
        >
          View Company Portfolio 
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;

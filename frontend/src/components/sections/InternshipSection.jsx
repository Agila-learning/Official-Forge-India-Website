import React from 'react';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { EXTERNAL_APPS } from '../../config/externalApps';
import { Link } from 'react-router-dom';

const InternshipSection = () => {
  return (
    <section className="py-24 px-6 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-left">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
              <GraduationCap size={40} className="text-white" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Looking for an Internship?
            </h2>
            <p className="text-xl text-blue-100 font-medium mb-12 max-w-xl">
              Get practical industry exposure through internship opportunities and real-world learning programs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={EXTERNAL_APPS.INTERNSHIP_FORM} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-6 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-blue-900/50 flex items-center justify-center gap-2"
              >
                Apply for Internship <ArrowUpRight size={20} />
              </a>
              <Link 
                to="/training-placement" 
                className="px-10 py-6 bg-blue-700/50 text-white border border-blue-400/30 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Explore Student Programs
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl shadow-blue-900/40">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop" 
                alt="Internship opportunity for students" 
                className="w-full h-[500px] object-cover object-center rounded-[3rem] transform group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternshipSection;

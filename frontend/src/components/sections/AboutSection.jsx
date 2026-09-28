import React from 'react';
import { Monitor, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  const pillars = [
    { name: 'TECHNOLOGY', desc: 'Building modern digital solutions.', icon: <Monitor size={32} /> },
    { name: 'CAREERS', desc: 'Connecting people with opportunities and career guidance.', icon: <Briefcase size={32} /> },
    { name: 'EDUCATION', desc: 'Helping students gain practical skills and industry exposure.', icon: <GraduationCap size={32} /> },
    { name: 'BUSINESS GROWTH', desc: 'Helping organizations improve their digital presence, processes and talent acquisition.', icon: <TrendingUp size={32} /> }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/3">
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">Who We Are</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
              More Than a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Service Provider</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Forge India Connect brings technology, careers, education and business solutions together to create practical opportunities for individuals, institutions and organizations.
            </p>
          </div>

          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <div key={i} className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                  <div className="w-14 h-14 bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    {pillar.icon}
                  </div>
                  <h4 className="text-lg font-black tracking-widest uppercase mb-3 text-slate-200">{pillar.name}</h4>
                  <p className="text-slate-400 font-medium">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

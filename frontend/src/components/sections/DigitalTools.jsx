import React from 'react';
import { FileText, Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react';
import { EXTERNAL_APPS } from '../../config/externalApps';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DigitalTools = () => {
  const tools = [
    { 
      title: 'AI Resume Builder', 
      desc: 'Create a professional AI-assisted resume.', 
      icon: <FileText size={32} />, 
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop",
      cta: 'Build Resume', 
      link: EXTERNAL_APPS.RESUME_AI,
      isExternal: true
    },
    { 
      title: 'Job Portal', 
      desc: 'Explore current career opportunities.', 
      icon: <Briefcase size={32} />, 
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
      cta: 'Find Jobs', 
      link: '/explore-jobs',
      isExternal: false
    },
    { 
      title: 'Internship Application', 
      desc: 'Apply for available internship opportunities.', 
      icon: <GraduationCap size={32} />, 
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
      cta: 'Apply Now', 
      link: EXTERNAL_APPS.INTERNSHIP_FORM,
      isExternal: true
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Digital Platforms</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            FIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Digital Tools</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-slate-800/50 p-8 rounded-[3rem] border border-slate-700 hover:border-blue-500/50 transition-all group flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="w-full h-40 -mt-8 -mx-8 mb-8 overflow-hidden relative rounded-t-[3rem]">
                <img src={tool.image} alt={tool.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 via-slate-800/20 to-transparent"></div>
              </div>

              <div className="w-20 h-20 bg-slate-700 text-slate-300 rounded-2xl flex items-center justify-center mb-6 -mt-16 relative z-10 border-[6px] border-slate-900 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl">
                {tool.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 z-10">{tool.title}</h3>
              <p className="text-slate-400 font-medium mb-8 z-10">{tool.desc}</p>
              
              {tool.isExternal ? (
                <a 
                  href={tool.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-auto px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 z-10"
                >
                  {tool.cta} <ArrowUpRight size={16} />
                </a>
              ) : (
                <a 
                  href={tool.link} 
                  className="mt-auto px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 z-10"
                >
                  {tool.cta} <ArrowUpRight size={16} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalTools;

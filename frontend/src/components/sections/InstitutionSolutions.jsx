import React from 'react';
import { Building, BookOpen, GraduationCap, Laptop, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstitutionSolutions = () => {
  const services = [
    { name: 'Student Internships', icon: <Briefcase size={20} /> },
    { name: 'Industry Visits', icon: <Building size={20} /> },
    { name: 'Final-Year Projects', icon: <Laptop size={20} /> },
    { name: 'Real-Time Projects', icon: <Laptop size={20} /> },
    { name: 'Technical Training', icon: <BookOpen size={20} /> },
    { name: 'Career Guidance', icon: <GraduationCap size={20} /> },
    { name: 'Placement Support', icon: <Briefcase size={20} /> },
    { name: 'Banking Career Programs', icon: <Building size={20} /> },
    { name: 'ERP Solutions for Institutions', icon: <Laptop size={20} /> },
    { name: 'Digital Solutions', icon: <Laptop size={20} /> },
    { name: 'Student Skill Development Programs', icon: <BookOpen size={20} /> },
  ];

  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative z-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <p className="text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-4">For Colleges & Institutions</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
              Industry-Connected Programs for <span className="text-amber-400">Your Students</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-8">
              Partner with Forge India Connect to provide students with practical exposure, internships, final-year projects, career guidance, training and placement support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/contact" className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-xl shadow-amber-500/20 text-center flex justify-center items-center gap-2">
                Partner With FIC <ArrowRight size={16} />
              </Link>
              <Link to="/it-solutions" className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors border border-slate-700 text-center flex justify-center items-center gap-2">
                Explore Institution Solutions <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-bold">* Placement support is assistance-based; no unsupported placement guarantees are made.</p>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-800/50 p-8 rounded-[3rem] border border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((svc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
                    <div className="text-amber-400 shrink-0">
                      {svc.icon}
                    </div>
                    <span className="font-bold text-sm text-slate-200">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default InstitutionSolutions;

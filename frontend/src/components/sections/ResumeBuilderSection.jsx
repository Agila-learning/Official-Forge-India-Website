import React from 'react';
import { FileText, CheckCircle, ArrowUpRight } from 'lucide-react';
import { EXTERNAL_APPS } from '../../config/externalApps';

const ResumeBuilderSection = () => {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Build a Resume That <span className="text-primary">Gets Noticed</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-8">
              Create a professional, ATS-friendly resume with AI-powered assistance.
            </p>
            
            <ul className="space-y-4 mb-10">
              {['AI Resume Builder', 'ATS-Friendly Resume', 'Professional Resume Templates', 'AI-Assisted Content', 'Resume Improvement', 'Skills & Experience Guidance', 'Job-Oriented Resume Creation'].map(item => (
                <li key={item} className="flex items-center gap-3 font-bold text-slate-700">
                  <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={EXTERNAL_APPS.RESUME_AI} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
              >
                Build My AI Resume <ArrowUpRight size={18} />
              </a>
              <a 
                href={EXTERNAL_APPS.RESUME_AI} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-5 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                Check ATS Compatibility <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-50 p-2 md:p-4 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <img src="/images/resume-builder-hired.jpg" alt="Resume Builder" className="w-full h-auto rounded-[2.5rem] object-cover group-hover:scale-[1.02] transition-transform duration-700 relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilderSection;

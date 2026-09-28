import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareerTrainingSection = () => {
  const navigate = useNavigate();

  const programs = [
    'Technical Training',
    'Full Stack Development',
    'Cloud & DevOps',
    'AI & Data',
    'Interview Preparation',
    'Resume & ATS Guidance',
    'Banking Career Training',
    'Professional Skill Development'
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
         <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="w-full lg:w-1/2">
               <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block">Career Training</span>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Learn. Prepare. Get Career Ready.</h2>
               <p className="text-lg text-slate-600 mb-8">
                  Bridge the gap between academic knowledge and industry expectations with our specialized training programs.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {programs.map((prog, idx) => (
                     <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-700">{prog}</span>
                     </div>
                  ))}
               </div>

               <button onClick={() => navigate('/training-placement')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Explore Training Programs
               </button>
            </div>

            <div className="w-full lg:w-1/2">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6 pt-12">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <BookOpen size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Real-World Learning</h4>
                     </div>
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
                        <h4 className="font-bold text-slate-900">Project-Based Practice</h4>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
                        <h4 className="font-bold text-slate-900">Industry-Oriented Curriculum</h4>
                     </div>
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
                        <h4 className="font-bold text-slate-900">Career Guidance</h4>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default CareerTrainingSection;

import React from 'react';
import { UserCheck, Target, FileSearch, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobConsultingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
         <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4 block">Job Consulting</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Your Career. Our Guidance.</h2>
            <p className="text-lg text-slate-600">
               Forge India Connect connects job seekers with career opportunities while providing guidance, interview preparation and professional development support.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
               { icon: <UserCheck />, title: 'Career Guidance', desc: 'One-on-one professional counseling to identify the right career path.' },
               { icon: <Target />, title: 'Interview Preparation', desc: 'Mock interviews and strategy sessions to help you clear technical and HR rounds.' },
               { icon: <FileSearch />, title: 'Resume Support', desc: 'ATS-friendly resume building to highlight your skills and get shortlisted.' },
               { icon: <Building />, title: 'Placement Assistance', desc: 'Direct connection with hiring companies and recruitment drives.' },
               { icon: <Building />, title: 'Corporate Hiring', desc: 'Helping businesses find verified, skilled talent for their specific requirements.' },
               { icon: <Target />, title: 'Job Opportunities', desc: 'Access to curated private sector jobs in IT, management, and more.' },
            ].map((item, idx) => (
               <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                     {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
               </div>
            ))}
         </div>

         <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/explore-jobs')} className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
               Find Jobs
            </button>
            <button onClick={() => navigate('/job-consulting')} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:border-slate-300 transition-all">
               Talk to Career Advisor
            </button>
         </div>
      </div>
    </section>
  );
};

export default JobConsultingSection;

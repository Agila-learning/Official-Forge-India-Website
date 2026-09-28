import React from 'react';
import { Monitor, Smartphone, Globe, Search, Users, Settings, Target, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessSolutions = () => {
  const services = [
    { name: 'Custom Software Development', icon: <Monitor size={20} /> },
    { name: 'Web Application Development', icon: <Monitor size={20} /> },
    { name: 'Mobile App Development', icon: <Smartphone size={20} /> },
    { name: 'ERP Solutions', icon: <Settings size={20} /> },
    { name: 'CRM Solutions', icon: <Target size={20} /> },
    { name: 'Business Automation', icon: <Settings size={20} /> },
    { name: 'Digital Marketing', icon: <Globe size={20} /> },
    { name: 'SEO', icon: <Search size={20} /> },
    { name: 'Recruitment', icon: <Users size={20} /> },
    { name: 'Staffing', icon: <Users size={20} /> },
    { name: 'HR Solutions', icon: <Briefcase size={20} /> },
    { name: 'IT Consulting', icon: <Monitor size={20} /> },
  ];

  return (
    <section className="py-24 px-6 bg-white relative z-10 overflow-hidden border-t border-slate-100">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((svc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-indigo-600 shrink-0">
                      {svc.icon}
                    </div>
                    <span className="font-bold text-sm text-slate-700">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-4">For Companies & Businesses</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-slate-900">
              Technology & Talent Solutions for <span className="text-indigo-600">Growing Businesses</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
              From software development and digital transformation to recruitment and marketing, Forge India Connect helps businesses build, operate and grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/it-solutions" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20 text-center flex justify-center items-center gap-2">
                Build With FIC <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center flex justify-center items-center gap-2">
                Talk to Our Team <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;

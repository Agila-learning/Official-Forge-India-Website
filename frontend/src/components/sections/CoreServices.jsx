import React from 'react';
import { Monitor, Briefcase, GraduationCap, Building2, TrendingUp, Smartphone, Cloud, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoreServices = () => {
  const services = [
    { title: 'IT Solutions', desc: 'End-to-end technology solutions for businesses', icon: <Monitor size={24} />, size: 'large', path: '/it-solutions' },
    { title: 'Job Consulting', desc: 'Connecting talent with top employers', icon: <Briefcase size={24} />, size: 'normal', path: '/job-consulting' },
    { title: 'Career Guidance', desc: 'Expert advice for professional growth', icon: <TrendingUp size={24} />, size: 'normal', path: '/training-placement' },
    { title: 'Banking Careers', desc: 'Opportunities in top private banks', icon: <Building2 size={24} />, size: 'normal', path: 'https://jobs.forgeindiaconnect.in' },
    { title: 'Student Programs', desc: 'Internships and Final-Year Projects', icon: <GraduationCap size={24} />, size: 'large', path: '/training-placement' },
    { title: 'Digital Marketing', desc: 'SEO, Social Media & Brand Growth', icon: <Globe size={24} />, size: 'normal', path: '/digital-marketing' },
    { title: 'Web Development', desc: 'Custom scalable web applications', icon: <Cloud size={24} />, size: 'normal', path: '/web-development' },
    { title: 'Mobile Apps', desc: 'Native & cross-platform solutions', icon: <Smartphone size={24} />, size: 'normal', path: '/app-development' }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            Our Core <span className="text-primary">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div key={i} className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col ${svc.size === 'large' ? 'md:col-span-2' : 'col-span-1'}`}>
              <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {svc.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-2">{svc.title}</h3>
              <p className="text-slate-500 font-medium text-sm mb-6 flex-1">{svc.desc}</p>
              {svc.path.startsWith('http') ? (
                <a href={svc.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-800 mt-auto">
                  Learn More <ArrowRight size={14} />
                </a>
              ) : (
                <Link to={svc.path} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-800 mt-auto">
                  Learn More <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreServices;

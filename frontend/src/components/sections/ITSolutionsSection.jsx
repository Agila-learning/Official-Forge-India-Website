import React from 'react';
import { Globe, Smartphone, Code2, Database, Shield, Cloud, Bot, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ITSolutionsSection = () => {
  const navigate = useNavigate();

  const services = [
    { icon: <Globe size={24} />, title: 'Web Application Development', desc: 'Scalable, responsive and modern web applications built with React and Node.js.', tags: ['React', 'Next.js', 'Node.js'] },
    { icon: <Smartphone size={24} />, title: 'Mobile App Development', desc: 'Cross-platform and native mobile applications for iOS and Android.', tags: ['Flutter', 'React Native'] },
    { icon: <Code2 size={24} />, title: 'Custom Software Development', desc: 'Bespoke software tailored perfectly to your specific business requirements.', tags: ['Python', 'TypeScript'] },
    { icon: <Database size={24} />, title: 'ERP Solutions', desc: 'Enterprise Resource Planning software to manage your core business processes.', tags: ['PostgreSQL', 'MongoDB'] },
    { icon: <Shield size={24} />, title: 'CRM Solutions', desc: 'Customer Relationship Management systems to boost sales and retention.', tags: ['Custom CRM'] },
    { icon: <Cloud size={24} />, title: 'Cloud & IT Solutions', desc: 'Secure cloud infrastructure, deployment, and IT consulting services.', tags: ['AWS', 'Docker'] },
    { icon: <Bot size={24} />, title: 'Database & API Development', desc: 'Robust REST and GraphQL APIs backed by scalable database architectures.', tags: ['API', 'Microservices'] },
    { icon: <Settings size={24} />, title: 'Business Automation', desc: 'Automate repetitive workflows and improve operational efficiency.', tags: ['Workflow', 'Automation'] }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
       <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 rounded-l-[100px] pointer-events-none -z-10"></div>
       
       <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
             <div className="max-w-2xl">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block">IT & Software Solutions</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Digital Solutions That Move Businesses Forward</h2>
                <p className="text-lg text-slate-600">From idea to deployment, we build scalable digital products tailored to your business needs in Krishnagiri, Bangalore and beyond.</p>
             </div>
             <button onClick={() => navigate('/it-solutions')} className="shrink-0 bg-white border border-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                View All Solutions <ArrowRight size={16} />
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {services.map((service, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all group">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {service.icon}
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                   <p className="text-sm text-slate-500 mb-6 line-clamp-3">{service.desc}</p>
                   <div className="flex flex-wrap gap-2 mb-6">
                      {service.tags.map(tag => (
                         <span key={tag} className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{tag}</span>
                      ))}
                   </div>
                   <button onClick={() => navigate('/contact')} className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight size={14} />
                   </button>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

export default ITSolutionsSection;

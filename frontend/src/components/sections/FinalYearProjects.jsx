import React from 'react';
import { Code, Smartphone, Database, BrainCircuit, Cloud, ShoppingCart, Activity, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalYearProjects = () => {
  const categories = [
    { name: 'Web Applications', icon: <Code size={24} /> },
    { name: 'Mobile Applications', icon: <Smartphone size={24} /> },
    { name: 'MERN Stack / React / Node.js', icon: <Database size={24} /> },
    { name: 'Python / AI / ML', icon: <BrainCircuit size={24} /> },
    { name: 'Data Analytics', icon: <Activity size={24} /> },
    { name: 'Cloud & DevOps', icon: <Cloud size={24} /> },
    { name: 'ERP / CRM / Business', icon: <LinkIcon size={24} /> },
    { name: 'E-Commerce', icon: <ShoppingCart size={24} /> },
  ];

  const supports = [
    'Project Guidance', 'Project Development', 'Documentation Support', 'Presentation Guidance'
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Build a Project That <span className="text-primary">Demonstrates Your Skills</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-8">
              Work on industry-oriented projects designed to help students understand real-world software development.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              {supports.map(support => (
                <div key={support} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="font-bold text-sm text-slate-700">{support}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/final-year-projects" 
              className="inline-flex px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-xl shadow-slate-200"
            >
              Explore Final-Year Projects
            </Link>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 transition-transform group">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    {cat.icon}
                  </div>
                  <h4 className="font-black text-sm text-slate-800">{cat.name}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalYearProjects;

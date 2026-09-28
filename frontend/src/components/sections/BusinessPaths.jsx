import React from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessPaths = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: 'business',
      label: 'FOR BUSINESSES',
      title: 'Build & Grow Your Business',
      icon: <Building2 size={32} />,
      color: 'blue',
      services: [
        'Custom Software Development',
        'Web Application Development',
        'Mobile App Development',
        'ERP Solutions',
        'CRM Solutions',
        'Digital Marketing',
        'SEO',
        'Branding & Social Media',
        'Cloud & IT Solutions'
      ],
      cta: 'Explore IT Solutions',
      link: '/it-solutions'
    },
    {
      id: 'jobs',
      label: 'FOR JOB SEEKERS',
      title: 'Build Your Career',
      icon: <UserCircle size={32} />,
      color: 'amber',
      services: [
        'Job Consulting',
        'Career Guidance',
        'Interview Preparation',
        'Resume Support',
        'Banking Jobs',
        'Private Bank Career Programs',
        'Training & Placement Support'
      ],
      cta: 'Explore Career Opportunities',
      link: '/jobs'
    },
    {
      id: 'students',
      label: 'FOR STUDENTS',
      title: 'Learn. Build. Get Industry Ready.',
      icon: <GraduationCap size={32} />,
      color: 'emerald',
      services: [
        'Internships',
        'Real-Time Projects',
        'Final-Year Projects',
        'Skill Training',
        'Technical Training',
        'Career Guidance',
        'Placement Preparation'
      ],
      cta: 'Explore Student Programs',
      link: '/training-placement'
    }
  ];

  const getColorClasses = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getButtonClasses = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
      default: return 'bg-slate-800 hover:bg-slate-900';
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Empowering Every Journey</h2>
           <p className="text-slate-600 max-w-2xl mx-auto text-lg">Whether you are a business looking to scale, a professional seeking your next role, or a student preparing for the industry, we have the right solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paths.map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col bg-white rounded-3xl p-8 border ${getColorClasses(path.color).split(' ').pop()} shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-2`}
            >
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
                  {path.label}
                </span>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${getColorClasses(path.color)} border`}>
                   {path.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight h-16">{path.title}</h3>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {path.services.map((service, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${path.color === 'blue' ? 'bg-blue-400' : path.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                    <span className="text-slate-600 text-sm font-medium">{service}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(path.link)}
                className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${getButtonClasses(path.color)}`}
              >
                {path.cta} <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessPaths;

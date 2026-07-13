import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, Server, Code, Smartphone, Terminal, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const ITSolutions = () => {
  return (
    <div className="bg-[#0c0f1a] min-h-screen pb-32 pt-20">
      <SEOMeta title="IT Solutions & Architecture | Forge India Connect" description="End-to-end IT solutions, software development, and infrastructure support for modern enterprises." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20" 
            alt="IT Solutions Hub" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f1a] via-[#0c0f1a]/80 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.5)", "0 0 0px rgba(59,130,246,0)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-blue-500/30"
              >
                <Cpu size={24} className="text-blue-400" />
              </motion.div>
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">Enterprise IT Architecture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Digital</span> Excellence
            </h1>
            
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl">
              From bespoke software development to robust infrastructure support, we architect scalable technology solutions that drive business transformation.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <a 
                href="#inquiry"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-900/50 transition-all flex items-center gap-3 hover:gap-5"
              >
                Request IT Consultation <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-xl px-6 relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Server,
              title: "Infrastructure Support",
              desc: "24/7 monitoring, network architecture, and server management to ensure zero downtime.",
              color: "from-blue-500 to-cyan-500",
              slug: "infrastructure-support"
            },
            {
              icon: Code,
              title: "Custom Software Dev",
              desc: "Full-stack development of enterprise applications tailored to your business logic.",
              color: "from-indigo-500 to-purple-500",
              slug: "custom-software-dev"
            },
            {
              icon: Smartphone,
              title: "Web & Mobile Solutions",
              desc: "High-performance React Native and Next.js applications for seamless user experiences.",
              color: "from-sky-400 to-blue-600",
              slug: "web-mobile-solutions"
            }
          ].map((service, idx) => (
            <Link to={`/services/sub/${service.slug}`} key={idx} className="h-full block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group h-full flex flex-col justify-start"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-blue-400 transition-colors">{service.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack Marquee (Static representation) */}
      <section className="container-xl px-6 mt-32">
        <div className="text-center mb-12">
          <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Our Arsenal</p>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Technology Stack</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'GraphQL', 'TypeScript', 'Next.js', 'Redis'].map((tech, i) => (
            <div key={i} className="bg-white/5 border border-white/10 py-4 px-6 rounded-xl flex items-center justify-center">
              <span className="text-sm font-black text-gray-300 uppercase tracking-wider">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Process Timeline */}
      <section className="container-xl px-6 mt-32 relative">
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-[3rem] p-12 md:p-20 overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-16 relative z-10">
            Deployment <span className="text-blue-500">Protocol</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="absolute top-8 left-0 w-full h-1 bg-white/5 hidden md:block" />
            {[
              { step: '01', title: 'Discovery', desc: 'Requirements gathering and architecture blueprinting.' },
              { step: '02', title: 'Prototyping', desc: 'UI/UX wireframing and technical feasibility tests.' },
              { step: '03', title: 'Development', desc: 'Agile sprints with continuous integration.' },
              { step: '04', title: 'Deployment', desc: 'Rigorous QA and seamless production launch.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="w-16 h-16 bg-[#0c0f1a] border-4 border-blue-500 rounded-full flex items-center justify-center text-xl font-black text-white mb-6 relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {item.step}
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
              Ready to scale your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">infrastructure?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-xl">
              Partner with Forge India Connect to build secure, high-performance IT systems that accelerate your growth.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Custom Architecture', desc: 'Designed specifically for your business logic.' },
                { title: '24/7 Monitoring', desc: 'Zero downtime and instant incident response.' },
                { title: 'Agile Delivery', desc: 'Continuous integration and rapid deployment.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0 border border-blue-800/50">
                    <ShieldCheck size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ServiceInquiryForm 
              serviceType="IT Solutions" 
              themeColor="blue" 
              title="Request IT Consultation"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ITSolutions;

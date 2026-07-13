import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Monitor, Globe, Layout, ArrowRight, CheckCircle2, Server, Database } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const WebAppDevelopment = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen pb-32 pt-20">
      <SEOMeta title="Web App Development | Forge India Connect" description="Custom web application development, responsive websites, and enterprise web solutions." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20" 
            alt="Web Development" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.5)", "0 0 0px rgba(99,102,241,0)"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-indigo-500/30"
                >
                  <Monitor size={24} className="text-indigo-400" />
                </motion.div>
                <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">Web Engineering</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
                Next-Gen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Web Applications</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
                We build fast, secure, and scalable web applications that deliver exceptional user experiences and drive business growth. From landing pages to complex SaaS platforms.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#inquiry"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-indigo-900/50 transition-all flex items-center gap-3 hover:gap-5"
                >
                  Start Your Project <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl" />
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" alt="Code Editor" className="relative z-10 rounded-3xl shadow-2xl border border-slate-800" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-xl px-6 relative z-20 mt-12 md:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Corporate Websites",
              desc: "Professional, SEO-optimized websites that establish your digital presence and capture leads.",
              color: "from-blue-500 to-indigo-500",
              slug: "corporate-websites"
            },
            {
              icon: Layout,
              title: "Web Applications",
              desc: "Complex, data-driven web apps built with modern frameworks like React and Next.js.",
              color: "from-indigo-500 to-purple-500",
              slug: "custom-web-apps"
            },
            {
              icon: Code,
              title: "E-Commerce Solutions",
              desc: "Scalable online stores with seamless payment integrations and inventory management.",
              color: "from-purple-500 to-pink-500",
              slug: "ecommerce-solutions"
            }
          ].map((service, idx) => (
            <Link to={`/services/sub/${service.slug}`} key={idx} className="h-full block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-[2rem] hover:bg-slate-800 hover:border-indigo-500/50 transition-all group h-full flex flex-col justify-start"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              Let's Build Your <span className="text-indigo-400">Digital Identity</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Whether you need a simple corporate website or a complex web application, our team of expert developers is ready to turn your vision into reality. 
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Layout, title: "Responsive Design", desc: "Perfect experience across all devices." },
                { icon: Server, title: "Scalable Backend", desc: "Robust architecture that grows with you." },
                { icon: Database, title: "Secure Data", desc: "Enterprise-grade security protocols." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0 border border-indigo-800/50">
                    <item.icon size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tighter">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
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
              serviceType="Web App Development" 
              themeColor="indigo" 
              title="Request a Quote"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebAppDevelopment;

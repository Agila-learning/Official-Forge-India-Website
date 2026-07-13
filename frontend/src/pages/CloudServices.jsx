import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cloud, Server, ShieldCheck, Zap, ArrowRight, Network, Terminal, Settings } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const CloudServices = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen pb-32 pt-20">
      <SEOMeta title="Cloud Services & DevOps | Forge India Connect" description="Enterprise cloud migration, hosting, and managed DevOps services across AWS, Azure, and GCP." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30" 
            alt="Cloud Infrastructure" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.span 
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.5)", "0 0 0px rgba(6,182,212,0)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block"
            >
              Multi-Cloud Architecture
            </motion.span>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Scale <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Infinitely.</span><br />
              Deploy Securely.
            </h1>
            
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl">
              Future-proof your operations with our enterprise cloud solutions. We manage migration, optimization, and security across AWS, Azure, and Google Cloud.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <a 
                href="#inquiry"
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-cyan-900/50 transition-all flex items-center gap-3 hover:gap-5"
              >
                Get Cloud Assessment <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="container-xl px-6 relative z-20 mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Cloud <span className="text-cyan-500">Pillars</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Cloud,
              title: "Cloud Migration",
              desc: "Seamless transition of legacy systems to the cloud with zero data loss and minimal downtime.",
              points: ["AWS / Azure / GCP", "Lift & Shift", "Database Migration"],
              slug: "cloud-migration"
            },
            {
              icon: Server,
              title: "Managed Hosting",
              desc: "24/7 monitoring and resource optimization to ensure your applications run at peak performance.",
              points: ["Load Balancing", "Auto-scaling", "Disaster Recovery"],
              slug: "managed-hosting"
            },
            {
              icon: Terminal,
              title: "DevOps & CI/CD",
              desc: "Automated deployment pipelines to accelerate your software delivery lifecycle securely.",
              points: ["Jenkins / GitLab CI", "Infrastructure as Code", "Docker / K8s"],
              slug: "devops-ci-cd"
            },
            {
              icon: ShieldCheck,
              title: "Cloud Security",
              desc: "Enterprise-grade compliance, identity management, and threat detection systems.",
              points: ["ISO/SOC Compliance", "IAM Configuration", "Vulnerability Scanning"],
              slug: "cloud-security"
            }
          ].map((pillar, idx) => (
            <Link to={`/services/sub/${pillar.slug}`} key={idx} className="h-full block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 p-10 rounded-[2.5rem] hover:border-cyan-500/30 transition-all group h-full flex flex-col justify-start"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                    <pillar.icon size={28} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-cyan-400 transition-colors">{pillar.title}</h3>
                    <p className="text-slate-400 font-medium mb-6 leading-relaxed">{pillar.desc}</p>
                    <ul className="space-y-2">
                      {pillar.points.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300">
                          <Zap size={14} className="text-cyan-500" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="container-xl px-6 mt-32">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-[3rem] p-12 md:p-20 border border-cyan-500/20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
            <div className="p-4">
              <p className="text-5xl md:text-7xl font-black text-cyan-400 tracking-tighter mb-2">99.99%</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guaranteed Uptime</p>
            </div>
            <div className="p-4">
              <p className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">-40%</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg. Infrastructure Cost Reduction</p>
            </div>
            <div className="p-4">
              <p className="text-5xl md:text-7xl font-black text-cyan-400 tracking-tighter mb-2">10x</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Faster Deployment Cycles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              Ready to <span className="text-cyan-500">Migrate?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl">
              Talk to our cloud architects today for a free infrastructure audit and migration roadmap.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Cost Optimization', desc: 'Reduce your AWS/Azure bills significantly.' },
                { title: 'Zero-Downtime Migration', desc: 'Seamless transition for your users.' },
                { title: 'Enhanced Security', desc: 'Enterprise-grade protection.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-cyan-900/30 rounded-xl flex items-center justify-center shrink-0 border border-cyan-800/50">
                    <Cloud size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
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
              serviceType="Cloud Services" 
              themeColor="sky" 
              title="Request Cloud Assessment"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CloudServices;

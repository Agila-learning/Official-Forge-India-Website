import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Factory, Rocket, Building2, Headphones, ArrowRight, Network, Globe2, Cpu, BarChart3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { 
    icon: Monitor, 
    name: 'Information Technology', 
    subtitle: 'Cloud & Digital Flow',
    desc: 'Empowering enterprises with cutting-edge IT infrastructure and custom software engineering.',
    color: 'from-blue-600/30 to-cyan-500/30',
    iconColor: 'text-blue-500', 
    path: '/services/it-solutions'
  },
  { 
    icon: Factory, 
    name: 'Global Industrial', 
    subtitle: 'Automation Sovereignty',
    desc: 'Optimizing production lifecycles through standardized logistics and workforce management.',
    color: 'from-orange-600/30 to-amber-500/30',
    iconColor: 'text-orange-500', 
    path: '/services/manufacturing'
  },
  { 
    icon: Rocket, 
    name: 'Scale Engineering', 
    subtitle: 'Venture Acceleration',
    desc: 'Connecting early-stage innovations with the talent and resources needed to disrupt markets.',
    color: 'from-purple-600/30 to-indigo-500/30',
    iconColor: 'text-purple-500', 
    path: '/services/startup-support'
  },
  { 
    icon: Building2, 
    name: 'Capital & Corporate', 
    subtitle: 'Strategic Governance',
    desc: 'Driving corporate excellence with vetted executive placements and operational strategies.',
    color: 'from-emerald-600/30 to-teal-500/30',
    iconColor: 'text-emerald-500', 
    path: '/services/job-consulting'
  },
  { 
    icon: Headphones, 
    name: 'BPO Nexus', 
    subtitle: 'Service Intelligence',
    desc: 'Elevating customer touchpoints through high-performance outsourced professional services.',
    color: 'from-rose-600/30 to-pink-500/30',
    iconColor: 'text-rose-500', 
    path: '/services/bpo'
  },
];

const Industries = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-32 bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Network */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-1 h-1 bg-primary rounded-full blur-[2px] animate-pulse"></div>
        <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-secondary rounded-full blur-[2px] animate-pulse delay-700"></div>
        <div className="absolute top-[70%] left-[20%] w-1 h-1 bg-blue-500 rounded-full blur-[2px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-8"
          >
            <Network size={14} className="animate-spin-slow" /> Structural Network Integrations
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase"
          >
            Engine of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 italic">Global Industry</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 font-bold text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Forge India Connect serves as the multi-sector catalyst, integrating high-performance recruitment, standardized logistics, and advanced trade infrastructure into a single, unified business ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-24">
          {industries.map((ind, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                boxShadow: "0 40px 80px -15px rgba(10, 102, 194, 0.3)"
              }}
              onClick={() => navigate(ind.path)}
              className="group relative p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center text-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ind.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 group-hover:bg-white/10 transition-all shadow-inner relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ind.icon className={`w-12 h-12 ${ind.iconColor} filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] relative z-10`} />
                </motion.div>
                
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">
                  {ind.name}
                </h3>
                <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] mb-6 block">
                    {ind.subtitle}
                </p>
                
                <div className="h-0.5 w-8 bg-primary/30 mb-8 group-hover:w-16 transition-all duration-500"></div>

                <p className="text-zinc-400 text-sm font-bold leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                  {ind.desc}
                </p>
              </div>

              <div className="mt-12 relative z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    Sovereign Core <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-16">
             {[
                { icon: ShieldCheck, label: 'Standardized Excellence' },
                { icon: Network, label: 'Dynamic Connectivity' },
                { icon: BarChart3, label: 'Capital Conversion' }
             ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-primary/20 transition-all">
                    <feature.icon size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{feature.label}</span>
                </div>
              ))}
          </div>

          <button 
            onClick={() => navigate('/services/all')}
            className="group px-16 py-7 bg-primary text-white font-black rounded-[2.5rem] text-sm uppercase tracking-[0.5em] shadow-[0_20px_100px_rgba(10,102,194,0.4)] hover:shadow-primary/60 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-6"
          >
            Access the Industrial Hub <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;

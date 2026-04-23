import React from 'react';
import { motion } from 'framer-motion';
import { FileEdit, CalendarCheck, Briefcase, Zap, Star, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: FileEdit,
    title: 'Consult',
    desc: 'Deep dive into your business challenges to architect the perfect technology strategy.',
    color: 'from-blue-600 to-blue-400',
    number: '01'
  },
  {
    icon: Zap,
    title: 'Architect',
    desc: 'Engineering scalable, secure, and future-ready solutions using cutting-edge tech stacks.',
    color: 'from-primary to-yellow-400',
    number: '02'
  },
  {
    icon: ShieldCheck,
    title: 'Deliver',
    desc: 'Seamless deployment and continuous support to ensure your business thrives in the digital era.',
    color: 'from-green-600 to-emerald-400',
    number: '03'
  }
];

const PipelineProcess = () => {
  return (
    <section className="py-16 bg-[#050B15] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
          >
            The Forge <span className="animated-text-gradient">Pulse</span> Pipeline
          </motion.h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium opacity-80">
            A frictionless journey from ambition to achievement, engineered for the elite.
          </p>
        </div>

        <div className="relative">
          {/* Central Curved Path SVG */}
          <div className="absolute top-1/2 left-0 w-full h-2 hidden lg:block -translate-y-1/2 z-0">
              <svg width="100%" height="100" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none" className="opacity-20">
                  <path d="M0,50 Q250,100 500,50 T1000,50" stroke="url(#gradient-path)" strokeWidth="4" strokeDasharray="10 10" fill="none" />
                  <defs>
                      <linearGradient id="gradient-path" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0A66C2" />
                          <stop offset="0.5" stopColor="#FFC107" />
                          <stop offset="1" stopColor="#10B981" />
                      </linearGradient>
                  </defs>
              </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="relative group"
              >
                {/* Mobile Connector */}
                {idx < steps.length - 1 && (
                    <div className="absolute left-[calc(40px+3rem)] top-[calc(100%-1rem)] w-1 h-24 bg-gradient-to-b from-secondary/50 to-transparent lg:hidden z-0">
                        <motion.div 
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="w-full h-10 bg-gradient-to-b from-transparent via-white to-transparent"
                        />
                    </div>
                )}

                {/* Desktop Connector */}
                {idx < steps.length - 1 && (
                    <div className="absolute top-16 left-[calc(100%-2rem)] w-[calc(100%+2rem)] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block z-0">
                        <motion.div 
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="w-20 h-full bg-gradient-to-r from-transparent via-secondary to-transparent"
                        />
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-3xl p-10 md:p-12 rounded-[3.5rem] border border-white/10 hover:border-secondary/50 transition-all duration-500 hover:shadow-3xl hover:shadow-secondary/5 relative overflow-hidden h-full">
                    {/* Glowing Accent */}
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color} opacity-30 group-hover:opacity-100 transition-opacity`}></div>
                    
                    <div className="flex justify-between items-start mb-10">
                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                            <step.icon size={36} className="text-white" />
                        </div>
                        <span className="text-5xl font-black opacity-5 group-hover:opacity-20 transition-opacity font-serif italic">{step.number}</span>
                    </div>
                    
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                        {step.title}
                        <Zap size={20} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-lg text-gray-400 leading-relaxed font-medium">
                        {step.desc}
                    </p>

                    {/* Removed Star icons as per request */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineProcess;

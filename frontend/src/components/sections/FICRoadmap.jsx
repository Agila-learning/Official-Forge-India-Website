import React from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, ShieldCheck, Briefcase, Code, 
    ArrowRight, Sparkles, TrendingUp,
    Shield, Cpu, Globe, Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FICRoadmap = () => {
    const navigate = useNavigate();

    const services = [
        { 
            id: 'insurance', 
            name: 'Insurance Services', 
            desc: 'Secure your life, health, and future.', 
            icon: Shield, 
            color: 'bg-emerald-500', 
            path: '/services/insurance-services' 
        },
        { 
            id: 'consulting', 
            name: 'Job Consulting', 
            desc: 'Get career guidance, training & placement.', 
            icon: Briefcase, 
            color: 'bg-blue-600', 
            path: '/services/job-consulting' 
        },
        { 
            id: 'it', 
            name: 'IT Solutions', 
            desc: 'Powerful IT solutions for modern businesses.', 
            icon: Cpu, 
            color: 'bg-indigo-600', 
            path: '/services/it-solutions' 
        },
        { 
            id: 'marketing', 
            name: 'Digital Marketing', 
            desc: 'Grow your brand with smart digital strategies.', 
            icon: Globe, 
            color: 'bg-rose-500', 
            path: '/services/digital-marketing' 
        },
        { 
            id: 'web', 
            name: 'Web & App Development', 
            desc: 'Build modern, scalable web & mobile apps.', 
            icon: Code, 
            color: 'bg-violet-600', 
            path: '/services/website-development' 
        }
    ];

    const timeline = [
        { year: '2023', title: 'Foundation', desc: 'Launched partner network for jobs & service connections.', status: 'completed' },
        { year: '2024', title: 'Expansion', desc: 'Unified platform marketplace & membership.', status: 'completed' },
        { year: '2025', title: 'Growth', desc: 'Scaling to more cities with advanced tech solutions.', status: 'active' },
        { year: '2026+', title: 'Vision', desc: 'AI-powered ecosystem with global aspirations.', status: 'future' }
    ];

    return (
        <section className="py-24 bg-white dark:bg-dark-bg overflow-hidden">
            <div className="container-xl px-6">
                
                {/* Section Header */}
                <div className="max-w-4xl mb-20">
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 block"
                    >
                        Our Core Expertise
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95] mb-8"
                    >
                        Solutions for Your <br/>
                        <span className="gradient-heading-dark dark:gradient-heading">Career, Business &amp; Future</span>
                    </motion.h2>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl">
                        Explore our official company services designed to help you grow personally and professionally. 
                    </p>
                </div>

                {/* FIC Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-32">
                    {services.map((s, idx) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(s.path)}
                            className="group cursor-pointer bg-slate-50 dark:bg-dark-card/40 rounded-[2.5rem] p-8 border border-slate-100 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 ${s.color} rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <s.icon size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-3">{s.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-8 flex-grow">{s.desc}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                                Know More <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Animated Roadmap */}
                <div className="bg-slate-900 dark:bg-dark-card rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] -ml-48 -mb-48" />
                    
                    <div className="relative z-10">
                        <div className="mb-16">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 block">Our Roadmap</span>
                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Building the Future, <br/> Step by Step</h3>
                        </div>

                        <div className="relative">
                        {/* Animated glowing roadmap line */}
                        <div className="absolute top-6 left-0 w-full h-[2px] hidden lg:block overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <motion.div
                                initial={{ width: '0%' }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #0d9488)', boxShadow: '0 0 12px rgba(79,70,229,0.6)' }}
                            />
                        </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                                {timeline.map((item, idx) => (
                                    <motion.div
                                        key={item.year}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-6 lg:flex-col lg:items-start mb-8 relative">
                                            {/* Vertical line for mobile */}
                                            {idx < timeline.length - 1 && (
                                                <div className="absolute left-6 top-12 w-[2px] h-12 bg-white/10 lg:hidden" />
                                            )}
                                            
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 z-10 ${item.status === 'completed' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]' : item.status === 'active' ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse' : 'bg-white/10 text-white/40 border border-white/10'}`}>
                                                {item.year.slice(2)}
                                            </div>
                                            
                                            <div className="lg:mt-4">
                                                <h4 className={`text-xl font-black uppercase tracking-tighter ${item.status === 'future' ? 'text-white/40' : 'text-white'}`}>{item.title}</h4>
                                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">{item.year}</p>
                                            </div>
                                        </div>
                                        
                                        <p className={`text-sm font-medium leading-relaxed ${item.status === 'future' ? 'text-white/20' : 'text-white/60'}`}>
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-20 flex justify-center">
                            <button 
                                onClick={() => navigate('/services')}
                                className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 active:scale-95 shadow-2xl"
                            >
                                Explore FIC Services <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FICRoadmap;

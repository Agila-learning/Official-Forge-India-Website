import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Target, Users, Award, Handshake, 
    Briefcase, Zap, Rocket, 
    Globe, Sparkles, ArrowRight, Star, 
    ShieldCheck, Cpu, Code, Database
} from 'lucide-react';
import CTA from '../components/sections/CTA';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MagneticButton = ({ children, className }) => {
    const btnRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const mouseMove = (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = btnRef.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x, y });
    };

    const mouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            ref={btnRef}
            onMouseMove={mouseMove}
            onMouseLeave={mouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const AboutUs = () => {
    const journey = [
        { year: '2020', title: 'Conceptual Genesis', desc: 'Forge India Connect (FIC) was initialized as a specialized job consultancy targeting niche industrial segments.' },
        { year: '2022', title: 'IT Infrastructure', desc: 'Integrated full-scale IT solutions and enterprise recruitment software for regional partners.' },
        { year: '2024', title: 'Marketplace Deployment', desc: 'Rolled out the FIC Service Arena, connecting home service professionals with millions of users.' },
        { year: '2025', title: 'Unified Ecosystem', desc: 'Building India\'s first fully automated industrial-domestic connectivity platform.' }
    ];

    useEffect(() => {
        const stats = document.querySelectorAll(".stat-val");
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"));
            gsap.to(stat, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: "top 85%",
                }
            });
        });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg overflow-x-hidden pt-20">
            {/* Standardized Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 inline-flex items-center gap-2 px-6 py-2 bg-primary/5 border border-primary/10 rounded-full"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Industrial Connectivity Architecture</span>
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter uppercase mb-8">
                        The Standard of <br/>
                        <span className="text-primary">Trust & Efficiency.</span>
                    </h1>

                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                        Forge India Connect is an enterprise ecosystem standardizing industrial recruitment and high-trust domestic service fulfillment across India.
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center items-center">
                        <MagneticButton className="w-full sm:w-auto">
                            <Link to="/explore-jobs" className="px-10 py-4 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 group">
                                Explore Jobs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </MagneticButton>
                        <button 
                            onClick={() => document.getElementById('mission').scrollIntoView({behavior: 'smooth'})} 
                            className="px-10 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-3 group"
                        >
                            Our Mission <Star size={18} className="text-secondary" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Standardized Journey Section */}
            <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block">Evolutionary Roadmap</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Our <span className="text-primary">Blueprint</span> Timeline.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {journey.map((item, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:-translate-y-2 transition-all group"
                            >
                                <span className="text-3xl font-black text-primary/20 group-hover:text-primary transition-colors block mb-6">{item.year}</span>
                                <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white mb-4 leading-tight">{item.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Standardized Mission Section */}
            <section id="mission" className="py-24 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="p-12 bg-gray-50 dark:bg-dark-bg rounded-[3rem] border border-gray-200 dark:border-gray-800 relative group overflow-hidden shadow-xl"
                        >
                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white uppercase tracking-tighter">Scientific <span className="text-primary">Mission.</span></h2>
                            <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                To engineer a high-frequency industrial infrastructure that stabilizes India's workforce access through verified professional nodes and ethical automation.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="p-12 bg-gray-50 dark:bg-dark-bg rounded-[3rem] border border-gray-200 dark:border-gray-800 relative group overflow-hidden shadow-xl"
                        >
                            <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-8">
                                <Globe size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white uppercase tracking-tighter">Global <span className="text-secondary">Vision.</span></h2>
                            <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                To project the FIC standard as the gold-metric for industrial outsourcing connectivity, recognized for economic empowerment and digital integrity.
                            </p>
                        </motion.div>
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: Rocket, label: 'Speed Ops' },
                            { icon: Globe, label: 'Omni Connect' },
                            { icon: ShieldCheck, label: 'Safe Protocol' },
                            { icon: Sparkles, label: 'Innovation' }
                        ].map((v, i) => (
                            <motion.div key={i} className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-dark-bg rounded-2xl flex items-center justify-center text-gray-400 mb-4 border border-gray-100 dark:border-gray-800">
                                    <v.icon size={30} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{v.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subsidiary Section */}
            <section className="py-24 bg-gray-50 dark:bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="p-10 md:p-16 bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <span className="px-5 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">Our Subsidiary Ecosystem</span>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">
                                    Antigraviity <br/>
                                    <span className="text-primary italic">Technologies.</span>
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10">
                                    As a strategic subsidiary of the Forge India Connect Group, Antigraviity Technologies serves as our specialized technical powerhouse. Specialized in next-gen software engineering, cybersecurity, and cloud architecture, Antigraviity provides the technological backbone for FIC's expansive industrial and domestic connectivity platform.
                                </p>
                                <Link to="/antigraviity" className="inline-flex items-center gap-4 text-primary font-bold uppercase tracking-widest text-xs hover:gap-6 transition-all">
                                    Learn More <ArrowRight size={18} />
                                </Link>
                            </div>
                            <div className="w-full md:w-1/3 aspect-square rounded-[2.5rem] bg-[#0A0F1A] p-10 flex items-center justify-center border border-white/5 shadow-2xl group-hover:rotate-3 transition-transform">
                                <Zap size={80} className="text-secondary animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-20 tracking-tighter uppercase text-white">
                        The <span className="text-primary">Connect</span> Advantage.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <Users size={36} />, title: "20,000+", desc: "Candidates Placed", target: 20000 },
                            { icon: <Award size={36} />, title: "150+", desc: "Corporate Partners", target: 150 },
                            { icon: <Handshake size={36} />, title: "100%", desc: "Commitment to Trust", target: 100 }
                        ].map((stat, idx) => (
                            <div key={idx} className="relative p-10 rounded-[3rem] bg-white/5 border border-white/10 shadow-xl group">
                                <div className="text-primary mb-6 flex justify-center">{stat.icon}</div>
                                <h3 className="text-4xl font-black mb-3 tracking-tighter text-white">
                                    <span className="stat-val" data-target={stat.target}>0</span>
                                    {stat.title.includes('+') ? '+' : (stat.title.includes('%') ? '%' : '')}
                                </h3>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
};

export default AboutUs;

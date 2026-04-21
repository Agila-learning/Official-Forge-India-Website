import React from 'react';
import { motion } from 'framer-motion';
import { 
    Target, Users, Award, Handshake, 
    Briefcase, Zap, Rocket, 
    Globe, Sparkles, ArrowRight, Star, 
    ShieldCheck, Building2, Heart, CheckCircle2
} from 'lucide-react';
import CTA from '../components/sections/CTA';
import { Link } from 'react-router-dom';
import SEOMeta from '../components/ui/SEOMeta';

const StatCard = ({ icon: Icon, value, label, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="p-8 rounded-[2rem] bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group text-center"
    >
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon size={28} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{value}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </motion.div>
);

const AboutUs = () => {
    const journey = [
        { year: '2020', title: 'The Genesis', desc: 'Forge India Connect (FIC) was born in Krishnagiri with a vision to bridge the gap between local talent and global industrial opportunities.' },
        { year: '2022', title: 'Digital Expansion', desc: 'Integrated full-scale IT solutions and enterprise recruitment software, expanding our footprint to Chennai and Bangalore.' },
        { year: '2024', title: 'Marketplace Launch', desc: 'Rolled out the FIC Service Arena, a unified platform connecting 180+ corporate partners and thousands of service professionals.' },
        { year: '2026', title: 'The Future', desc: 'Aiming to become India\'s most trusted ecosystem for job consulting, digital transformation, and industrial excellence.' }
    ];

    const values = [
        { icon: ShieldCheck, title: 'Integrity', desc: 'We maintain the highest ethical standards in recruitment and business services.' },
        { icon: Zap, title: 'Efficiency', desc: 'Our automated workflows ensure lightning-fast placement and service delivery.' },
        { icon: Heart, title: 'Empathy', desc: 'We understand career journeys and business challenges at a human level.' },
        { icon: Globe, title: 'Impact', desc: 'Creating measurable economic growth for individuals and enterprises alike.' }
    ];

    return (
        <>
            <SEOMeta 
                title="About Us | Our Story & Vision | Forge India Connect"
                description="Learn about Forge India Connect's journey from a local consultancy to South India's premier business and career gateway. Discover our mission, values, and the impact we create."
                canonical="/about"
            />
            
            <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 overflow-hidden">
                
                {/* Hero Section */}
                <section className="relative py-24 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.span 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6"
                            >
                                Our Identity
                            </motion.span>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-8 tracking-tighter"
                            >
                                Bridging Aspirations with <span className="animated-text-gradient">Real-World Success.</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed"
                            >
                                Forge India Connect (FIC) is more than just a consultancy. We are a high-trust ecosystem standardizing professional recruitment and enterprise services across South India.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap justify-center gap-4"
                            >
                                <Link to="/contact" className="btn-primary btn-lg shadow-xl shadow-primary/20">
                                    Partner With Us <ArrowRight size={18} />
                                </Link>
                                <a href="#story" className="btn-ghost btn-lg border-slate-200 dark:border-slate-800">
                                    Read Our Story
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="pb-24 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Users} value="20,000+" label="Candidates Placed" delay={0.1} />
                        <StatCard icon={Building2} value="180+" label="Corporate Partners" delay={0.2} />
                        <StatCard icon={Globe} value="3+" label="Regional Hubs" delay={0.3} />
                        <StatCard icon={Award} value="95%" label="Success Rate" delay={0.4} />
                    </div>
                </section>

                {/* Our Story / Timeline */}
                <section id="story" className="py-24 bg-white dark:bg-dark-card relative overflow-hidden border-y border-slate-100 dark:border-slate-800">
                    <div className="container-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <span className="section-eyebrow">The Evolution</span>
                                <h2 className="section-title !mx-0">From a Vision to a <span className="text-primary">Regional Powerhouse.</span></h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    Starting in the industrial hub of Krishnagiri, FIC recognized early on that South India's booming economy needed a more standardized, tech-driven way to connect talent with industry. 
                                    Over the last 6 years, we have evolved from a specialized job consultancy into a multi-vertical platform serving millions.
                                </p>
                                <div className="space-y-4 pt-4">
                                    {['ISO 9001:2015 Certified Operations', 'Government Recognized HR Partner', 'Official Skill India Training Node'].map(check => (
                                        <div key={check} className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-bold">
                                            <CheckCircle2 size={20} className="text-secondary" />
                                            {check}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-2" />
                                <div className="relative space-y-6">
                                    {journey.map((item, i) => (
                                        <motion.div 
                                            key={item.year}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-6 p-6 bg-slate-50 dark:bg-dark-bg rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
                                        >
                                            <div className="text-2xl font-black text-primary/20 group-hover:text-primary transition-colors shrink-0 pt-1">{item.year}</div>
                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-slate-50 dark:bg-dark-bg">
                    <div className="container-xl">
                        <div className="section-header">
                            <span className="section-eyebrow">Our Core Values</span>
                            <h2 className="section-title">The principles that drive us</h2>
                            <p className="section-subtitle">We don't just provide services; we build relationships founded on trust, performance, and transparency.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((v, i) => (
                                <motion.div 
                                    key={v.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="feature-card text-center !p-10"
                                >
                                    <div className="w-16 h-16 bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-xl">
                                        <v.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{v.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Subsidiary Showcase */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative p-10 md:p-20 bg-slate-900 rounded-[4rem] overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-full h-full">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                                <div className="flex-1 space-y-8">
                                    <span className="inline-block px-5 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full">The Tech Powerhouse</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
                                        Antigraviity <span className="text-secondary italic">Technologies.</span>
                                    </h2>
                                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                                        As the specialized technology wing of the FIC Group, Antigraviity Technologies engineers the platform infrastructure that powers our regional connectivity. From cybersecurity to next-gen AI recruitment tools, Antigraviity ensures FIC remains at the forefront of digital excellence.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link to="/antigraviity" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3">
                                            Visit Antigraviity <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/3 aspect-square bg-slate-800/50 backdrop-blur-xl rounded-[3.5rem] border border-white/10 p-12 flex items-center justify-center relative group-hover:rotate-3 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem]" />
                                    <Zap size={100} className="text-secondary relative z-10 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <CTA />
            </div>
        </>
    );
};

export default AboutUs;

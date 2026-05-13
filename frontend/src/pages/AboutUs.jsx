import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
 Target, Users, Award, Briefcase, Zap, Rocket, Globe,
 ArrowRight, ShieldCheck, Building2, Heart, CheckCircle2,
 Code2, Cpu, Layers, TrendingUp, MapPin, Phone, Star,
 ChevronRight, Play, Pause
} from 'lucide-react';
import CTA from '../components/sections/CTA';
import { Link } from 'react-router-dom';
import SEOMeta from '../components/ui/SEOMeta';

/* ─── Animated Counter ─── */
const Counter = ({ target, suffix = '', prefix = '' }) => {
 const [count, setCount] = useState(0);
 const ref = useRef(null);
 const inView = useInView(ref, { once: true });
 useEffect(() => {
 if (!inView) return;
 let start = 0;
 const num = parseFloat(target.replace(/[^0-9.]/g, ''));
 const duration = 1800;
 const step = (num / duration) * 16;
 const timer = setInterval(() => {
 start += step;
 if (start >= num) { setCount(num); clearInterval(timer); }
 else setCount(Math.floor(start));
 }, 16);
 return () => clearInterval(timer);
 }, [inView, target]);
 return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, value, suffix, label, color, delay }) => (
 <motion.div
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay, duration: 0.5 }}
 className="relative p-8 rounded-[2rem] overflow-hidden group cursor-default"
 style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
 >
 <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-20 ${color}`} />
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 ${color}`}>
 <Icon size={22} />
 </div>
 <div className="text-4xl font-black text-white tracking-tighter mb-1">
 <Counter target={value} suffix={suffix} />
 </div>
 <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</p>
 </motion.div>
);

/* ─── Division Card ─── */
const DivisionCard = ({ division, isActive, onClick }) => (
 <motion.div
 layout
 onClick={onClick}
 whileHover={{ scale: isActive ? 1 : 1.02 }}
 className={`cursor-pointer rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
 isActive
 ? 'border-primary/40 shadow-2xl shadow-primary/10'
 : 'border-slate-100 dark:border-slate-800 hover:border-primary/20'
 }`}
 >
 <div className={`p-8 transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-primary to-indigo-600' : 'bg-white dark:bg-dark-card'}`}>
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isActive ? 'bg-white/20' : 'bg-primary/10'}`}>
 <division.icon size={22} className={isActive ? 'text-white' : 'text-primary'} />
 </div>
 <h3 className={`text-xl font-black tracking-tight mb-2 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
 {division.name}
 </h3>
 <p className={`text-sm leading-relaxed ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
 {division.tagline}
 </p>
 </div>
 <AnimatePresence>
 {isActive && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.35 }}
 className="bg-slate-50 dark:bg-dark-bg px-8 py-6 border-t border-slate-100 dark:border-slate-800"
 >
 <ul className="space-y-3">
 {division.services.map(s => (
 <li key={s} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
 <CheckCircle2 size={15} className="text-primary shrink-0" />
 {s}
 </li>
 ))}
 </ul>
 {division.link && (
 <Link to={division.link} className="inline-flex items-center gap-2 mt-5 text-xs font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
 Explore Division <ChevronRight size={14} />
 </Link>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
);

/* ─── Data ─── */
const DIVISIONS = [
 {
 icon: Briefcase,
 name: 'FIC Recruitment',
 tagline: 'South India\'s premier talent acquisition engine.',
 services: ['Executive Search & Headhunting', 'Mass Recruitment Drives', 'Campus Hiring Programs', 'Contract Staffing Solutions', 'Background Verification'],
 link: '/explore-jobs',
 },
 {
 icon: Code2,
 name: 'Antigraviity Technologies',
 tagline: 'Full-stack digital engineering & cybersecurity.',
 services: ['Enterprise Web & Mobile Apps', 'AI-Powered Recruitment Tools', 'Cybersecurity & Penetration Testing', 'Cloud Infrastructure & DevOps', 'UI/UX Design Systems'],
 link: '/antigraviity',
 },
 {
 icon: Layers,
 name: 'FIC Service Arena',
 tagline: 'Unified B2B & B2C service marketplace.',
 services: ['On-Demand Home Services', 'Vendor & Partner Onboarding', 'Logistics & Delivery Network', 'E-Commerce for Local Businesses', 'SLA-Backed Service Contracts'],
 link: '/services',
 },
 {
 icon: TrendingUp,
 name: 'FIC Training & Placement',
 tagline: 'Industry-aligned upskilling for career acceleration.',
 services: ['Skill India Certified Programs', 'Corporate Training Modules', 'Interview Coaching & Mock Sessions', 'Resume Engineering & LinkedIn Branding', 'Domain Switch Career Counselling'],
 link: '/training-placement',
 },
];

const JOURNEY = [
 { year: '2020', title: 'The Genesis', desc: 'Founded in Krishnagiri with a mission to bridge local talent and industrial opportunity across South India.' },
 { year: '2022', title: 'Digital Leap', desc: 'Integrated Antigraviity Technologies as the tech wing; expanded to Chennai and Bangalore with enterprise HR software.' },
 { year: '2024', title: 'Marketplace Launch', desc: 'Rolled out the FIC Service Arena — a unified platform connecting 180+ corporate partners and thousands of professionals.' },
 { year: '2026', title: 'Ecosystem Vision', desc: 'Targeting 50,000+ placements and becoming India\'s most trusted multi-vertical business ecosystem.' },
];

const VALUES = [
 { icon: ShieldCheck, title: 'Integrity', desc: 'Highest ethical standards in every service we deliver.' },
 { icon: Zap, title: 'Efficiency', desc: 'Automated workflows ensuring lightning-fast delivery.' },
 { icon: Heart, title: 'Empathy', desc: 'We understand career journeys at a deeply human level.' },
 { icon: Globe, title: 'Impact', desc: 'Measurable economic growth for individuals and enterprises.' },
];

/* ─── Main Component ─── */
const AboutUs = () => {
 const [activeDiv, setActiveDiv] = useState(0);

 return (
 <>
 <SEOMeta
 title="About Us | Our Story & Vision | Forge India Connect"
 description="Learn about Forge India Connect's journey from a local consultancy to South India's premier business and career ecosystem. Discover our mission, divisions, and values."
 canonical="/about"
 />

 <div className="min-h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">

 {/* ── Hero ── */}
 <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
 {/* Grid pattern */}
 <div className="absolute inset-0 opacity-[0.07]"
 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
 {/* Glow orbs */}
 <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
 <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

 <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
 <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
 <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-8"
 >
 <Star size={10} className="text-yellow-400" /> Forge India Connect · Est. 2020
 </motion.span>
 <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-8">
 India's Premier<br />
 <span className="inline-block bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">
 Business Ecosystem.
 </span>
 </h1>
 <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-xl">
 From Krishnagiri to pan-India — FIC is a multi-vertical platform standardizing recruitment, technology, services, and training for millions of professionals and businesses.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all text-sm uppercase tracking-widest">
 Partner With Us <ArrowRight size={16} />
 </Link>
 <a href="#story" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-sm uppercase tracking-widest">
 Our Story
 </a>
 </div>
 </motion.div>

 {/* Stats grid on hero */}
 <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
 className="grid grid-cols-2 gap-4"
 >
 <StatCard icon={Users} value="20000" suffix="+" label="Candidates Placed" color="bg-primary" delay={0.1} />
 <StatCard icon={Building2} value="180" suffix="+" label="Corporate Partners" color="bg-indigo-500" delay={0.2} />
 <StatCard icon={Globe} value="3" suffix="+" label="Regional Hubs" color="bg-violet-500" delay={0.3} />
 <StatCard icon={Award} value="95" suffix="%" label="Placement Success" color="bg-emerald-500" delay={0.4} />
 </motion.div>
 </div>
 </div>
 </section>

 {/* ── Our Divisions ── */}
 <section className="py-28 px-6">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
 className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-5"
 >
 Our Divisions
 </motion.span>
 <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-5"
 >
 One Group. Four Powerhouses.
 </motion.h2>
 <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
 className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg"
 >
 Click on any division to explore the services it delivers.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {DIVISIONS.map((div, i) => (
 <DivisionCard
 key={div.name}
 division={div}
 isActive={activeDiv === i}
 onClick={() => setActiveDiv(activeDiv === i ? -1 : i)}
 />
 ))}
 </div>
 </div>
 </section>

 {/* ── Journey / Timeline ── */}
 <section id="story" className="py-28 bg-slate-900 relative overflow-hidden">
 <div className="absolute inset-0 opacity-[0.06]"
 style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

 <div className="max-w-7xl mx-auto px-6 relative z-10">
 <div className="text-center mb-16">
 <span className="inline-block px-4 py-1.5 bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-5">
 The Evolution
 </span>
 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
 From a Vision to a <span className="text-primary">Regional Powerhouse.</span>
 </h2>
 </div>

 <div className="relative max-w-4xl mx-auto">
 {/* Line */}
 <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent hidden md:block" />

 <div className="space-y-8">
 {JOURNEY.map((item, i) => (
 <motion.div
 key={item.year}
 initial={{ opacity: 0, x: -24 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.12 }}
 className="flex gap-8 items-start"
 >
 <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center relative z-10">
 <span className="text-sm font-black text-primary">{item.year}</span>
 </div>
 <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors">
 <h4 className="text-lg font-black text-white mb-2">{item.title}</h4>
 <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* ── Core Values ── */}
 <section className="py-28 px-6 bg-white dark:bg-dark-card">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-5">
 Core Values
 </span>
 <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
 The Principles That Drive Us
 </h2>
 <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
 We don't just provide services — we build relationships founded on trust, performance, and transparency.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {VALUES.map((v, i) => (
 <motion.div
 key={v.title}
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 whileHover={{ y: -6 }}
 className="p-8 rounded-[2rem] bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all text-center group"
 >
 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
 <v.icon size={28} />
 </div>
 <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{v.title}</h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Credentials Strip ── */}
 <section className="py-16 px-6 bg-slate-50 dark:bg-dark-bg border-y border-slate-100 dark:border-slate-800">
 <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { icon: ShieldCheck, label: 'ISO 9001:2015 Certified Operations' },
 { icon: Award, label: 'Government Recognized HR Partner' },
 { icon: Rocket, label: 'Official Skill India Training Node' },
 ].map((item, i) => (
 <motion.div
 key={item.label}
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 className="flex items-center gap-4 p-6 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
 >
 <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center shrink-0">
 <item.icon size={18} className="text-emerald-600" />
 </div>
 <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.label}</p>
 </motion.div>
 ))}
 </div>
 </section>

 {/* ── Antigraviity Showcase ── */}
 <section className="py-28 px-6">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="relative p-10 md:p-20 bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl"
 >
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

 <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
 <div className="flex-1 space-y-8">
 <span className="inline-block px-5 py-2 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
 The Tech Powerhouse
 </span>
 <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
 Antigraviity<br />
 <span className="text-primary">Technologies.</span>
 </h2>
 <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
 As the technology wing of the FIC Group, Antigraviity engineers the platform infrastructure that powers our regional connectivity — from cybersecurity to next-gen AI recruitment tools.
 </p>
 <div className="flex flex-wrap gap-3">
 {['AI & ML', 'Cybersecurity', 'Cloud', 'Web Apps', 'Mobile'].map(tag => (
 <span key={tag} className="px-4 py-2 bg-white/10 text-white/70 text-xs font-bold rounded-xl border border-white/10">{tag}</span>
 ))}
 </div>
 <Link to="/antigraviity" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
 Visit Antigraviity <ArrowRight size={16} />
 </Link>
 </div>

 <div className="w-full lg:w-72 aspect-square bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 flex items-center justify-center relative group-hover:rotate-6 transition-transform duration-700 shrink-0">
 <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 <Cpu size={100} className="text-primary/60 relative z-10 group-hover:text-primary transition-colors duration-500" />
 </div>
 </div>
 </motion.div>
 </div>
 </section>

 {/* ── Leadership Contact Strip ── */}
 <section className="py-16 px-6 bg-white dark:bg-dark-card border-y border-slate-100 dark:border-slate-800">
 <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
 <div>
 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Ready to work with us?</h3>
 <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium">
 <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Krishnagiri, Tamil Nadu</span>
 <span className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +91 63694 06416</span>
 </div>
 </div>
 <div className="flex flex-wrap gap-4">
 <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
 Contact Us <ArrowRight size={15} />
 </Link>
 <Link to="/explore-jobs" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
 View Jobs
 </Link>
 </div>
 </div>
 </section>

 <CTA />
 </div>
 </>
 );
};

export default AboutUs;

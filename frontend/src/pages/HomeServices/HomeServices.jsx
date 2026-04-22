import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wrench, ShieldCheck, Clock, ArrowRight, Zap, Droplets, Paintbrush, 
    LayoutDashboard, Sparkles, Search, MapPin, ChevronRight, XCircle, 
    Shield, Target, Star, Filter, ArrowUpRight, Play, CheckCircle2, Users,
    Home, Info, Briefcase, Camera, Microscope, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BeforeAfterSlider from '../../components/ui/BeforeAfterSlider';
import LiveActivityToast from '../../components/ui/LiveActivityToast';
import ReviewCard from '../../components/ui/ReviewCard';
import LottieAnimation from '../../components/ui/LottieAnimation';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const HomeServices = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState({ name: 'All', id: 'all' });
    const [searchQuery, setSearchQuery] = useState('');
    const [uiConfig, setUiConfig] = useState(null);
    const [workflowSteps, setWorkflowSteps] = useState([]);
    const [trustCards, setTrustCards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    // Detailed Category Data
    const detailedCategories = [
        {
            id: 'cleaning',
            title: 'Sanitization & Deep Cleaning',
            desc: 'Industrial-grade sterilization protocols for residential and commercial environments.',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop',
            icon: Sparkles,
            color: 'from-cyan-500 to-blue-600',
            features: ['Bio-Hazard Control', 'Structural Sanitization', 'Air Quality Audit']
        },
        {
            id: 'maintenance',
            title: 'Strategic Maintenance',
            desc: 'Preventative and reactive engineering for critical home systems (Electrical/Plumbing).',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
            icon: Wrench,
            color: 'from-orange-500 to-red-600',
            features: ['Fault Diagnostics', 'System Optimization', '24/7 Rapid Response']
        },
        {
            id: 'painting',
            title: 'Surface Engineering',
            desc: 'Precision aesthetic restoration and high-durability coating applications.',
            image: 'https://images.unsplash.com/photo-1562033247-3c4c4ca25f05?q=80&w=2070&auto=format&fit=crop',
            icon: Paintbrush,
            color: 'from-purple-500 to-indigo-600',
            features: ['Color Synthesis', 'Structural Finishing', 'Moisture Proofing']
        }
    ];

    const executionProcess = [
        {
            step: '01',
            title: 'Strategic Audit',
            desc: 'Initial multi-point inspection and mission parameter mapping.',
            icon: Search,
            lottie: 'https://lottie.host/808605c4-0690-482a-a924-4e410b0e5138/9WzK6fV4pX.json'
        },
        {
            step: '02',
            title: 'Resource Deployment',
            desc: 'Dispatching certified pros and industrial-grade equipment.',
            icon: Briefcase,
            lottie: 'https://lottie.host/f8b4c09d-0c5a-4e2a-89a1-d5b7a1f5f3e4/9jWzK6fV4pX.json'
        },
        {
            step: '03',
            title: 'Precision Execution',
            desc: 'Standardized delivery following FIC operational protocols.',
            icon: Settings,
            lottie: 'https://lottie.host/d6b4c09d-0c5a-4e2a-89a1-d5b7a1f5f3e4/9jWzK6fV4pX.json'
        },
        {
            step: '04',
            title: 'Quality Verification',
            desc: 'Final multi-stage audit and client strategic sign-off.',
            icon: ShieldCheck,
            lottie: 'https://lottie.host/e6b4c09d-0c5a-4e2a-89a1-d5b7a1f5f3e4/9jWzK6fV4pX.json'
        }
    ];

    useEffect(() => {
        const fetchCMSData = async () => {
            try {
                const [productsRes, configRes, catRes, workflowRes, trustRes, testRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/home-ui-config'),
                    api.get('/home-categories'),
                    api.get('/workflow-steps'),
                    api.get('/trust-cards'),
                    api.get('/testimonials')
                ]);
                
                const list = productsRes.data.filter(p => p.isService && p.isActive);
                setServices(list);
                setFilteredServices(list);
                setUiConfig(configRes.data);
                setCategories([{ name: 'All', id: 'all' }, ...catRes.data]);
                setWorkflowSteps(workflowRes.data.length > 0 ? workflowRes.data : executionProcess);
                setTrustCards(trustRes.data);
                setTestimonials(testRes.data.filter(t => t.isApproved));
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch CMS data');
                setLoading(false);
            }
        };
        fetchCMSData();
    }, []);

    useEffect(() => {
        if (!services || !Array.isArray(services)) return;
        const filtered = services.filter(s => {
            if (!s || !s.name) return false;
            const matchesCategory = filterCategory.id === 'all' || s.categoryRef === filterCategory.id || s.serviceType === filterCategory.name;
            const matchesSearch = s.name.toLowerCase().includes((searchQuery || '').toLowerCase());
            return matchesCategory && matchesSearch;
        });
        setFilteredServices(filtered);
    }, [filterCategory, searchQuery, services]);

    // GSAP Animations
    useEffect(() => {
        if (!loading) {
            gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power4.out" });
            gsap.from(".hero-sub", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "power4.out" });
            
            // Category Cards Animation
            gsap.from(".category-card", {
                opacity: 0,
                y: 100,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".category-section",
                    start: "top 80%",
                }
            });

            // Stats Counter Animation
            const stats = document.querySelectorAll(".stat-val");
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target"));
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 80%",
                    }
                });
            });
        }
    }, [loading]);

    const getColor = (type) => {
        switch(type) {
            case 'Cleaning': return 'bg-cyan-500';
            case 'Painting': return 'bg-purple-600';
            case 'Plumbing': return 'bg-orange-500';
            case 'Electrical': return 'bg-yellow-400';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg font-outfit pb-20 pt-20 overflow-x-hidden antialiased selection:bg-primary/30">
            <LiveActivityToast />

            {/* Hero Section */}
            <header className="relative py-32 px-6 overflow-hidden bg-[#050505]">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-24">
                    <div className="max-w-3xl text-left">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="px-6 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-primary/20">Authorized Operational Hub</span>
                            <h1 className="hero-title text-5xl md:text-7xl font-black mt-12 mb-12 uppercase tracking-tighter leading-[0.8] text-white">
                                {uiConfig?.hero?.title || 'Advanced'} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{uiConfig?.hero?.highlightedText || 'Service'}</span> Engine.
                            </h1>
                            <p className="hero-sub text-lg text-gray-400 font-medium leading-relaxed max-w-xl mb-16">
                                {uiConfig?.hero?.subtitle || 'Deploying industrial-grade domestic operational standards across elite residential sectors.'}
                            </p>
                            
                            <div className="flex flex-wrap gap-8 items-center">
                                <button 
                                    onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-12 py-8 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_rgba(49,46,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6 group"
                                >
                                    {uiConfig?.hero?.ctaText || 'Initialize Service Booking'} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                                
                                <div className="flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map((idx) => (
                                            <img key={idx} src={`https://i.pravatar.cc/150?u=${idx}`} className="w-12 h-12 rounded-full border-2 border-[#050505] shadow-xl" alt="User" />
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Star size={14} className="fill-secondary text-secondary" />
                                            <span className="text-white font-black text-lg">4.9/5.0</span>
                                        </div>
                                        <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">Certified Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 w-full max-w-lg hidden lg:block relative">
                         <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
                         <LottieAnimation 
                            animationData="https://lottie.host/677f523c-7c05-4e78-9e63-718602522c71/fM1Jq6sYp2.json" 
                            className="relative z-10 w-full h-full"
                         />
                    </div>
                </div>
            </header>

            {/* Detailed Categories Section */}
            <section className="category-section py-24 bg-white dark:bg-dark-bg overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Strategic Portfolio</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mt-6">
                            Authorized <span className="text-primary">Sectors</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {detailedCategories.map((cat, idx) => (
                            <motion.div 
                                key={cat.id}
                                className="category-card group relative h-[50rem] rounded-[4rem] overflow-hidden shadow-4xl cursor-pointer"
                                whileHover={{ y: -20 }}
                            >
                                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/60 transition-all"></div>
                                
                                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${cat.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl`}>
                                        <cat.icon size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">{cat.title}</h3>
                                    <p className="text-gray-300 font-medium mb-10 leading-relaxed">{cat.desc}</p>
                                    
                                    <div className="space-y-4 mb-12">
                                        {cat.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-4 text-[10px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                                                <CheckCircle2 size={14} className="text-primary" /> {f}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-6 bg-white text-dark-bg rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all">
                                        Explore Scope <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Filter Bar */}
            <div className="sticky top-20 z-[100] px-6 mt-[-40px]">
                <div className="max-w-7xl mx-auto bg-white/80 dark:bg-dark-card/90 backdrop-blur-3xl p-6 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-5xl flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory.id === cat.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-50 dark:bg-dark-bg text-gray-400 hover:text-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex-grow max-w-md relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find specialized protocol..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary/30 rounded-full pl-16 pr-8 py-5 outline-none font-bold text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Service Grid Section */}
            <main id="services-grid" className="max-w-7xl mx-auto py-24 px-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[34rem] bg-gray-100 dark:bg-dark-card rounded-[5rem]"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {filteredServices.map((s, i) => (
                            <motion.div 
                                key={s._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative h-[38rem] rounded-[4.5rem] overflow-hidden cursor-pointer shadow-3xl hover:shadow-5xl hover:-translate-y-4 transition-all duration-500"
                            >
                                <div className="absolute inset-0">
                                    <img src={s.image} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                </div>
                                
                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end border border-white/10 rounded-[4.5rem] group-hover:border-primary/50 transition-colors">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-16 h-16 ${getColor(s.serviceType)} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform`}>
                                            <Sparkles size={32} />
                                        </div>
                                        <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black text-white uppercase tracking-[0.3em] italic">FIC Optimized</div>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">{s.name}</h3>
                                    <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-10 group-hover:line-clamp-none group-hover:mb-12 transition-all">{s.description}</p>
                                    
                                    <div className="flex justify-between items-center pt-8 border-t border-white/10">
                                        <div>
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Project Initiation</span>
                                            <span className="text-2xl font-black text-white italic">₹{s.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/home-services/booking/${s._id}`)}
                                            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-primary/20 flex items-center gap-3 hover:bg-blue-600 transition-all"
                                        >
                                            Book Now <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Execution Process (GSAP & Lottie) */}
            <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 -skew-x-12 translate-x-20"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-32">
                        <span className="text-primary font-black uppercase tracking-[0.8em] text-[10px]">Operational Protocol</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mt-8">
                            Execution <span className="text-primary">Process</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {executionProcess.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                className="p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] group hover:border-primary transition-all relative overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 text-[10rem] font-black text-white/5 italic">{step.step}</div>
                                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-10 shadow-2xl shadow-primary/10">
                                    <step.icon size={36} />
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-4">{step.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-12">{step.desc}</p>
                                
                                <div className="h-32 w-32 mx-auto">
                                     <LottieAnimation animationData={step.lottie} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before / After Showcase Section */}
            <section className="py-24 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-32">
                        <div className="lg:w-1/2">
                            <span className="px-6 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-secondary/20">Industrial Standards</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-12 mb-12 text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.8]">
                                Impact <br/><span className="text-secondary">Differential</span>.
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-16">
                                Observe the absolute variance in operational output. We don't just maintain; we restore assets to their peak strategic configuration.
                            </p>
                            <div className="space-y-8">
                                {['100% Sanitization Protocol', 'Industrial-Grade Reagents', 'Certified Mission Specialists'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-8 group">
                                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="text-base font-black uppercase tracking-tighter text-gray-900 dark:text-white">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-4xl">
                                <BeforeAfterSlider 
                                    before="https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop" 
                                    after="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=2070&auto=format&fit=crop" 
                                    labelBefore="Initial State"
                                    labelAfter="FIC Optimized"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50 dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-10 text-gray-900 dark:text-white">
                            Client <span className="text-secondary">Briefings</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {testimonials.map((t, idx) => (
                            <ReviewCard key={idx} {...t} delay={idx * 0.2} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-dark-bg/90 backdrop-blur-3xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="w-full max-w-6xl bg-white dark:bg-dark-card rounded-[5rem] border border-white/10 shadow-6xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <div className="md:w-1/2 relative h-[40vh] md:h-auto">
                                <img src={selectedService.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                <div className="absolute bottom-12 left-12">
                                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">{selectedService.name}</h2>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-16">
                                    <div className="flex gap-12">
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Protocol ID</span>
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">FIC-{selectedService?._id?.toString().slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Initiation Price</span>
                                            <span className="text-sm font-black text-primary uppercase tracking-tighter">₹{selectedService.price}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedService(null)} className="w-16 h-16 bg-gray-100 dark:bg-dark-bg rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                                        <XCircle size={32} />
                                    </button>
                                </div>

                                <div className="space-y-12 mb-20">
                                    <div>
                                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.5em] mb-8 italic">Mission Description</h4>
                                        <p className="text-xl text-gray-500 font-medium leading-relaxed italic">{selectedService.description}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-12">
                                        <div>
                                            <h4 className="flex items-center gap-4 text-xs font-black text-green-500 uppercase tracking-[0.3em] mb-8 italic">
                                                <CheckCircle2 size={18} /> Optimized Scope
                                            </h4>
                                            <ul className="space-y-4">
                                                {(selectedService.whatsIncluded || ['Deep Sanitization', 'Industrial Grade Reagents', 'Certified Pros']).map((incl, idx) => (
                                                    <li key={idx} className="text-sm font-bold text-gray-600 dark:text-gray-300 italic flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {incl}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate(`/home-services/booking/${selectedService._id}`)}
                                    className="w-full py-8 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Initialize Configuration Protocol
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <LiveActivityToast />
        </div>
    );
};

export default HomeServices;

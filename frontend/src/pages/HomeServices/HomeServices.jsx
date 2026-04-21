import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wrench, ShieldCheck, Clock, ArrowRight, Zap, Droplets, Paintbrush, 
    LayoutDashboard, Sparkles, Search, MapPin, ChevronRight, XCircle, 
    Shield, Target, Star, Filter, ArrowUpRight, Play, CheckCircle2, Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BeforeAfterSlider from '../../components/ui/BeforeAfterSlider';
import LiveActivityToast from '../../components/ui/LiveActivityToast';
import ReviewCard from '../../components/ui/ReviewCard';

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
                setWorkflowSteps(workflowRes.data);
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

            // Workflow Step Lines
            gsap.from(".workflow-line", {
                scaleX: 0,
                duration: 1.5,
                stagger: 0.5,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: ".workflow-section",
                    start: "top 70%",
                }
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
        <div className="min-h-screen bg-white dark:bg-dark-bg font-inter pb-20 pt-20 overflow-x-hidden antialiased selection:bg-primary/30">
            <LiveActivityToast />

            {/* Hero Section */}
            <header className="relative py-32 px-6 overflow-hidden bg-[#0a0a0a]">
                {/* Dynamic Media Background */}
                <div className="absolute inset-0 z-0">
                    {uiConfig?.hero?.backgroundMedia ? (
                        uiConfig.hero.backgroundMedia.includes('youtube.com') || uiConfig.hero.backgroundMedia.includes('youtu.be') ? (
                            <iframe 
                                className="absolute inset-0 w-full h-full object-cover scale-150 pointer-events-none opacity-40"
                                src={`https://www.youtube.com/embed/${uiConfig.hero.backgroundMedia.split('v=')[1]?.split('&')[0] || uiConfig.hero.backgroundMedia.split('/').pop()}?autoplay=1&mute=1&loop=1&playlist=${uiConfig.hero.backgroundMedia.split('v=')[1]?.split('&')[0] || uiConfig.hero.backgroundMedia.split('/').pop()}&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                            ></iframe>
                        ) : (
                            <video 
                                autoPlay muted loop playsInline 
                                className="absolute inset-0 w-full h-full object-cover opacity-40"
                                src={uiConfig.hero.backgroundMedia}
                            ></video>
                        )
                    ) : (
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[150px]"
                        ></motion.div>
                    )}
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-20">
                    <div className="max-w-3xl text-left">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="px-6 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-primary/20 font-inter">Authorized Service Hub</span>
                            <h1 className="hero-title text-7xl md:text-9xl font-black mt-8 mb-10 uppercase tracking-tighter italic leading-[0.9] text-white font-poppins">
                                {uiConfig?.hero?.title || 'Precision'} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">{uiConfig?.hero?.highlightedText || 'Home'}</span> Execution.
                            </h1>
                            <p className="hero-sub text-xl text-gray-400 font-medium leading-relaxed max-w-xl mb-12">
                                {uiConfig?.hero?.subtitle}
                            </p>
                            
                            <div className="flex flex-wrap gap-8 items-center">
                                <button 
                                    onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-12 py-7 bg-primary text-white rounded-[3rem] font-black uppercase tracking-widest text-xs shadow-3xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
                                >
                                    {uiConfig?.hero?.ctaText || 'Book Service in 30 Seconds'} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                                
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-4">
                                        {testimonials.slice(0, 3).map((t, idx) => (
                                            <img key={idx} src={t.avatar || `https://i.pravatar.cc/150?u=${t.name}`} className="w-14 h-14 rounded-full border-4 border-[#0a0a0a] shadow-xl" alt="User" />
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Star size={16} className="fill-secondary text-secondary" />
                                            <span className="text-white font-black text-lg">{uiConfig?.hero?.rating || '4.8'}/5</span>
                                        </div>
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Authorized Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 w-full max-w-lg hidden lg:block">
                        <div className="relative p-2 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[5rem] shadow-4xl">
                            <div className="p-12 bg-dark-card rounded-[4.5rem] border border-white/10 relative overflow-hidden group font-inter">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[5rem]"></div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-10 italic font-poppins">Standard <span className="text-primary italic">Status</span></h3>
                                <div className="space-y-10">
                                    {[
                                        { label: 'Active Missions', val: '120+', color: 'text-green-500' },
                                        { label: 'Certified Pros', val: '1,200', dataTarget: 1200 },
                                        { label: 'Uptime Protocol', val: '99.9%', color: 'text-blue-500' }
                                    ].map((s, i) => (
                                        <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.label}</span>
                                            <span className={`text-3xl font-black ${s.color || 'text-white'} italic tracking-tighter`}>
                                                {s.dataTarget ? <span className="stat-val" data-target={s.dataTarget}>0</span> : s.val}
                                                {s.dataTarget && '+'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Smart Filter Bar */}
            <div className="sticky top-20 z-[100] px-6 mt-[-40px]">
                <div className="max-w-7xl mx-auto bg-white/80 dark:bg-dark-card/90 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/20 shadow-4xl flex flex-wrap items-center justify-between gap-6">
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

                    <button className="p-5 bg-gray-50 dark:bg-dark-bg rounded-full text-gray-400 hover:text-primary transition-colors flex items-center gap-3">
                        <Filter size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Advanced Config</span>
                    </button>
                </div>
            </div>

            {/* Service Grid Section */}
            <main id="services-grid" className="max-w-7xl mx-auto py-32 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white font-poppins leading-[0.9]">Authorized <span className="text-primary italic">Capabilities</span></h2>
                        <p className="text-[10px] md:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] mt-6 leading-relaxed font-inter">Scientific Domestic Operation Infrastructure</p>
                    </div>
                </div>

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
                                className="group relative h-[36rem] rounded-[5rem] overflow-hidden cursor-pointer shadow-3xl hover:shadow-4xl transition-all"
                            >
                                {/* Service Image with Scale Effect */}
                                <div className="absolute inset-0">
                                    {s.hoverVideo ? (
                                        <div className="w-full h-full relative">
                                            <img 
                                                src={s.image} 
                                                className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-700" 
                                                alt={s.name} 
                                            />
                                            {s.hoverVideo.includes('youtube.com') || s.hoverVideo.includes('youtu.be') ? (
                                                <iframe 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                    src={`https://www.youtube.com/embed/${s.hoverVideo.split('v=')[1]?.split('&')[0] || s.hoverVideo.split('/').pop()}?autoplay=1&mute=1&loop=1&playlist=${s.hoverVideo.split('v=')[1]?.split('&')[0] || s.hoverVideo.split('/').pop()}&controls=0&showinfo=0&rel=0`}
                                                ></iframe>
                                            ) : (
                                                <video 
                                                    muted loop playsInline
                                                    onMouseOver={e => e.target.play()}
                                                    onMouseOut={e => e.target.pause()}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                                                    src={s.hoverVideo}
                                                ></video>
                                            )}
                                        </div>
                                    ) : (
                                        <img 
                                            src={s.image} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out" 
                                            alt={s.name} 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent group-hover:opacity-90 transition-opacity"></div>
                                </div>
                                
                                {/* Overlay Details on Hover */}
                                <div className="absolute top-10 right-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star size={12} className="fill-secondary text-secondary" />
                                            <span className="text-xs font-black">{s.rating || '4.8'}</span>
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none">Rating</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl text-white">
                                        <div className="flex items-center gap-2 mb-1 text-xs font-black">
                                            <Users size={12} className="text-primary" />
                                            <span>{s.proCount || '45'}+</span>
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none">Pros</span>
                                    </div>
                                </div>

                                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-20 h-20 ${getColor(s.serviceType)} rounded-[2.5rem] flex items-center justify-center text-white shadow-3xl shadow-black/50 group-hover:scale-110 transition-transform`}>
                                            <Sparkles size={40} />
                                        </div>
                                        {s.badgeLabel && (
                                            <div className="px-6 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-full text-[9px] font-black uppercase tracking-widest italic">{s.badgeLabel}</div>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-6 leading-none">
                                        {s.name}
                                    </h3>
                                    
                                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10 line-clamp-2 group-hover:line-clamp-none group-hover:mb-12 transition-all">
                                        {s.description}
                                    </p>
                                    
                                    <div className="flex justify-between items-center pt-10 border-t border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Budget Initial</span>
                                            <span className="text-2xl font-black text-white italic">₹{s.price}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedService(s); }}
                                                className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
                                            >
                                                <ChevronRight size={28} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/home-services/booking/${s._id}`); }}
                                                className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Before / After Showcase Section */}
            <section className="py-48 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2">
                            <span className="px-6 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-secondary/20">{uiConfig?.standards?.subtitle || 'Operational Efficacy'}</span>
                            <h2 className="text-6xl md:text-8xl font-black mt-10 mb-10 text-gray-900 dark:text-white uppercase tracking-tighter italic leading-[0.9]">
                                {uiConfig?.standards?.sectionTitle?.split(' ')[0]} <br/><span className="text-secondary italic">{uiConfig?.standards?.sectionTitle?.split(' ').slice(1).join(' ')}</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                                {uiConfig?.standards?.description}
                            </p>
                            <div className="space-y-6">
                                {uiConfig?.standards?.bulletPoints?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group">
                                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="text-lg font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <BeforeAfterSlider 
                                before={uiConfig?.standards?.comparisonBefore || "https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop"} 
                                after={uiConfig?.standards?.comparisonAfter || "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=2070&auto=format&fit=crop"} 
                                labelBefore={uiConfig?.standards?.labelBefore || "Initial State"}
                                labelAfter={uiConfig?.standards?.labelAfter || "FIC Sanitized Profile"}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Precision Workflow Section */}
            <section className="workflow-section py-48 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-32">
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-10">
                            The <span className="text-primary italic">Precision</span> Workflow.
                        </h2>
                        <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.8em]">End-to-End Operational Traceability</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (GSAP Animated) */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 hidden lg:block z-0"></div>
                        <div className="workflow-line absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-secondary -translate-y-1/2 hidden lg:block z-10 origin-left"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 relative z-20">
                            {workflowSteps.map((w, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="p-8 lg:p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] lg:rounded-[3.5rem] border border-white/10 group hover:border-primary/50 transition-all text-center md:text-left"
                                >
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-2xl lg:rounded-[2rem] flex items-center justify-center text-primary mb-6 lg:mb-8 mx-auto md:mx-0 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                                        <span className="text-2xl lg:text-3xl font-black italic">{w.stepNumber}</span>
                                    </div>
                                    <h4 className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter italic mb-4 font-poppins">{w.title}</h4>
                                    <p className="text-[10px] lg:text-xs text-gray-500 font-bold leading-relaxed font-inter">{w.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Transformation Showcase Gallery (Added for Success Stories) */}
            <section className="py-48 bg-gray-50 dark:bg-dark-bg/40 font-inter">
                <div className="max-w-7xl mx-auto px-6 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-32">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none font-poppins">
                                Transformation <span className="text-secondary italic">Gallery</span>.
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] mt-8">Exceptional Mission Result Proofing</p>
                        </div>
                        <p className="lg:w-1/3 text-lg text-gray-500 font-medium leading-relaxed italic">
                            Observe the absolute differential in domestic operational standards. We don't just maintain; we restore to original protocol.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {[
                            {
                                before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
                                after: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=2070&auto=format&fit=crop",
                                title: "Sanitization Protocol",
                                desc: "Deep structural sterilization of high-traffic commercial zones.",
                                labelB: "Initial Bio-State",
                                labelA: "FIC Certified Sterile"
                            },
                            {
                                before: "https://images.unsplash.com/photo-1562033247-3c4c4ca25f05?q=80&w=2070&auto=format&fit=crop",
                                after: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop",
                                title: "Structural Restoration",
                                desc: "Full-spectrum surface engineering and aesthetic recovery.",
                                labelB: "Worn Configuration",
                                labelA: "Peak Operational Aesthetic"
                            }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="space-y-10"
                            >
                                <BeforeAfterSlider 
                                    before={item.before} 
                                    after={item.after} 
                                    labelBefore={item.labelB}
                                    labelAfter={item.labelA}
                                />
                                <div className="px-10">
                                    <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-4 font-poppins">{item.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed font-inter">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-48 bg-gray-50 dark:bg-dark-bg overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none mb-10 text-gray-900 dark:text-white">
                            Mission <span className="text-secondary italic">Success</span> Stories.
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Transparent Feedback Ecosystem</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {testimonials.map((t, idx) => (
                            <ReviewCard key={idx} {...t} delay={idx * 0.2} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust / FAQ Context */}
            <section className="py-48 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="grid grid-cols-2 gap-8">
                            {trustCards.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="p-10 bg-gray-50 dark:bg-dark-bg rounded-[4rem] border border-gray-100 dark:border-gray-800 text-center shadow-xl"
                                >
                                    <ShieldCheck size={48} className="text-primary mx-auto mb-6" />
                                    <h4 className="text-lg font-black uppercase tracking-tighter italic text-gray-900 dark:text-white mb-2">{item.title}</h4>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.val}</span>
                                </motion.div>
                            ))}
                            {trustCards.length === 0 && (
                                <>
                                    <div className="p-10 bg-gray-50 dark:bg-dark-bg rounded-[4rem] border border-gray-100 dark:border-gray-800 text-center shadow-xl opacity-50">
                                        <ShieldCheck size={48} className="text-primary mx-auto mb-6" />
                                        <h4 className="text-lg font-black uppercase tracking-tighter italic mb-2">Verified Pros</h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">100% Checked</span>
                                    </div>
                                    <div className="p-10 bg-gray-50 dark:bg-dark-bg rounded-[4rem] border border-gray-100 dark:border-gray-800 text-center shadow-xl opacity-50">
                                        <Zap size={48} className="text-primary mx-auto mb-6" />
                                        <h4 className="text-lg font-black uppercase tracking-tighter italic mb-2">Speed Ops</h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">60 Min Response</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="lg:pr-20">
                            <h2 className="text-6xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white mb-10 leading-none">
                                Why Trust the <span className="text-primary italic">Connect</span> Network?
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12 italic">
                                We operate on a standardized framework of "Industrial Verification". Only the top 5% of service providers pass our multi-stage background and quality audit.
                            </p>
                            <button className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-xs hover:gap-8 transition-all group">
                                Read our Safety Protocol <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Detail Modal (Updated) */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-dark-bg/85 backdrop-blur-2xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-5xl bg-white dark:bg-dark-card rounded-[5rem] border border-white/10 shadow-5xl relative overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto"
                        >
                            <div className="md:w-2/5 relative">
                                <img src={selectedService.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute inset-0 p-16 flex flex-col justify-between text-white">
                                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center">
                                        <Sparkles size={48} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">Fulfillment Protocol</span>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">{selectedService.name} <br/><span className="text-primary italic">Deep Dive.</span></h2>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-12">
                                    <div className="flex gap-10">
                                        <div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Service ID</span>
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">FIC-{selectedService?._id?.toString().slice(-6).toUpperCase() || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Base Price</span>
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">₹{selectedService.price}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedService(null)} className="w-12 h-12 bg-gray-50 dark:bg-dark-bg rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                                        <XCircle size={28} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-16 border-b border-gray-100 dark:border-gray-800 pb-16">
                                    <div>
                                        <h4 className="flex items-center gap-4 text-xs font-black text-green-500 uppercase tracking-[0.3em] mb-10 italic">
                                            <CheckCircle2 size={18} /> In Scope
                                        </h4>
                                        <ul className="space-y-6">
                                            {(selectedService.whatsIncluded || ['Deep Cleaning', 'Sanitization', 'Inspection']).map((incl, idx) => (
                                                <li key={idx} className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-300 italic">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> {incl}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="flex items-center gap-4 text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-10 italic">
                                            <XCircle size={18} /> Out of Scope
                                        </h4>
                                        <ul className="space-y-6">
                                            {(selectedService.whatsExcluded || ['Spares', 'Painting', 'Electrical']).map((excl, idx) => (
                                                <li key={idx} className="flex items-center gap-4 text-sm font-bold text-gray-400 italic opacity-50">
                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div> {excl}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-8">
                                    <button 
                                        onClick={() => {
                                            if (selectedService?._id) {
                                                navigate(`/home-services/booking/${selectedService._id}`);
                                            } else {
                                                console.error('Service ID missing for selection:', selectedService);
                                                toast.error('Mission ID mismatch. Re-scanning target...');
                                            }
                                        }}
                                        className="flex-grow py-7 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-3xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-center"
                                    >
                                        Initiate Configuration Protocol
                                    </button>
                                    <div className="p-7 bg-gray-50 dark:bg-dark-bg rounded-3xl flex items-center justify-center text-primary group cursor-help relative">
                                        <ShieldCheck size={28} />
                                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-4 bg-dark-card text-[8px] font-black text-white uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            100% Safe Execution Protocol Verified
                                        </div>
                                    </div>
                                </div>
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

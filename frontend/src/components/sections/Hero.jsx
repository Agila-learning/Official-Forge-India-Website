import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, MapPin, Zap, ShieldCheck, Briefcase, 
    Smartphone, Code, GraduationCap, Users, Star, Truck
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const Hero = () => {
    const navigate = useNavigate();
    const { setShowModal } = useLocation();
    const [typedText, setTypedText] = useState('');
    const fullText = "Empowering Connections. Building Futures. Delivering Solutions.";
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    const [pincodePlaceholder, setPincodePlaceholder] = useState('');
    const pincodes = ["635109", "600001", "560001", "635115", "635001"];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let pincodeIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentPincode = pincodes[pincodeIdx];
            if (isDeleting) {
                setPincodePlaceholder(`Type Pincode: ${currentPincode.substring(0, charIdx - 1)}`);
                charIdx--;
            } else {
                setPincodePlaceholder(`Type Pincode: ${currentPincode.substring(0, charIdx + 1)}`);
                charIdx++;
            }

            if (!isDeleting && charIdx === currentPincode.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                pincodeIdx = (pincodeIdx + 1) % pincodes.length;
            }

            const speed = isDeleting ? 100 : 200;
            setTimeout(type, speed);
        };

        const timeoutId = setTimeout(type, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleMouseMove = (e) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <section 
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-dark-bg select-none"
        >
            {/* Dynamic Mouse Glow */}
            <div 
                className="pointer-events-none absolute z-10 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] transition-all duration-300 ease-out"
                style={{
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
                    left: mousePos.x - 300,
                    top: mousePos.y - 300
                }}
            />

            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20 scale-110 animate-mesh" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg" />
            </div>

            {/* AI Network Map Overlay */}
            <div className="absolute inset-0 z-5 flex items-center justify-center opacity-10 pointer-events-none">
                <svg className="w-[80%] h-[80%] text-primary" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 8" />
                    <motion.path 
                        d="M200,400 Q400,100 600,400 T800,400" 
                        stroke="currentColor" 
                        strokeWidth="1" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path 
                        d="M100,500 Q400,800 700,500" 
                        stroke="currentColor" 
                        strokeWidth="1" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                    />
                </svg>
            </div>

            <div className="container-xl relative z-20 px-6 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Hero Content */}
                    <div className="lg:col-span-7 space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md"
                        >
                            <Zap size={14} className="text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">AI-Powered Ecosystem</span>
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                <span className="clay-text clay-animate-color clay-animate-pulse">{typedText}</span>
                                <span className="animate-cursor-blink border-r-4 border-primary ml-1">&nbsp;</span>
                            </h1>
                            <p className="text-lg md:text-2xl text-white/50 font-medium max-w-2xl leading-relaxed">
                                A Multi-Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Technology & Career Ecosystem</span> transforming businesses and careers through <span className="text-white italic">innovation</span>.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/services" className="btn-primary group">
                                Explore Services <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                            </Link>
                            <Link to="/jobs" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-[1.25rem] text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Apply for Jobs
                            </Link>
                            <button onClick={() => setShowModal(true)} className="px-10 py-5 bg-transparent border border-primary/30 text-primary font-black rounded-[1.25rem] text-xs uppercase tracking-[0.2em] hover:bg-primary/5 transition-all flex items-center gap-2">
                                <MapPin size={16} /> Global Map View
                            </button>
                        </div>

                        {/* Location Search Bar with Pincode Animation */}
                        <div className="max-w-xl relative group mt-8">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative glass-card p-3 rounded-[2rem] border border-white/10 flex items-center gap-4 backdrop-blur-xl">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">Deployment Area</p>
                                    <input 
                                        type="text" 
                                        placeholder={pincodePlaceholder}
                                        className="bg-transparent w-full text-white font-black uppercase tracking-tighter outline-none placeholder:text-white/20 text-lg"
                                        maxLength={6}
                                    />
                                </div>
                                <button 
                                    onClick={() => {
                                        if (!pincodePlaceholder.includes(':')) {
                                            toast.success(`Mission Sector Verified: ${pincodePlaceholder.split(' ').pop()}`);
                                        } else {
                                            toast.success('Sector Verification Successful');
                                        }
                                    }}
                                    className="px-8 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
                                >
                                    VERIFY
                                </button>
                            </div>
                        </div>

                        {/* Animated Counters */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                            {[
                                { v: '5K+', l: 'Placed Candidates' },
                                { v: '98%', l: 'Client Satisfaction' },
                                { v: '200+', l: 'Partnerships' },
                                { v: '6+', l: 'Years Excellence' }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    <p className="text-3xl font-black text-white mb-1">{stat.v}</p>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.l}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Futuristic Delivery Animation & Service Cards */}
                    <div className="lg:col-span-5 relative">
                        {/* Map Background Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-glow-pulse" />

                        {/* Floating Cards Container */}
                        <div className="relative space-y-6">
                            {[
                                { icon: Code, title: 'App Development', desc: 'Enterprise Solutions', color: 'text-blue-400', path: '/services/category/app-development' },
                                { icon: Smartphone, title: 'Web Development', desc: 'Digital Transformation', color: 'text-cyan-400', path: '/services/category/website-development' },
                                { icon: GraduationCap, title: 'Skill Academy', desc: 'Career Roadmap', color: 'text-orange-400', path: '/training-placement' }
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.2 }}
                                    whileHover={{ scale: 1.05, x: -10 }}
                                    onClick={() => navigate(card.path)}
                                    className="glass-card p-6 flex items-center gap-6 group cursor-pointer"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${card.color} group-hover:bg-primary/20 transition-all`}>
                                        <card.icon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-tight">{card.title}</h3>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{card.desc}</p>
                                    </div>
                                    <ArrowRight className="ml-auto text-white/20 group-hover:text-primary transition-colors" size={20} />
                                </motion.div>
                            ))}

                            {/* Futuristic Delivery Animation */}
                            <div className="pt-12 relative h-40">
                                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <motion.div 
                                    animate={{ 
                                        x: ['-20%', '120%'],
                                        y: [0, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                    className="absolute bottom-0 flex flex-col items-center"
                                >
                                    <div className="px-4 py-2 bg-secondary rounded-2xl shadow-lg shadow-secondary/40 text-white font-black text-[10px] uppercase tracking-widest mb-2">
                                        Express Delivery
                                    </div>
                                    <Truck size={40} className="text-secondary" />
                                    <div className="w-12 h-2 bg-secondary/20 blur-md rounded-full mt-1" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
            >
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Scroll</span>
            </motion.div>
        </section>
    );
};

export default Hero;

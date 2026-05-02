import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Zap, ShoppingBag, 
  Briefcase, ArrowRight, ShieldCheck, 
  ChevronRight, CreditCard, Star, Plus,
  Navigation, Loader2, Sparkles, LocateFixed,
  Globe, MousePointer2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation as useUserLocation } from '../../context/LocationContext';

const MapMarker = ({ x, y, delay, label, icon: Icon }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="absolute z-20"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <div className="relative">
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-md"
            />
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 hidden group-hover:block whitespace-nowrap">
                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Icon size={10} className="text-blue-600" /> {label}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
);

const MarketplaceHero = () => {
    const navigate = useNavigate();
    const { location: appLocation, detectLocation, status } = useUserLocation();
    const [pincode, setPincode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (appLocation?.pincode) {
            setPincode(appLocation.pincode);
        }
    }, [appLocation]);

    const handleSearch = () => {
        let path = '/explore-shop';
        if (searchQuery.toLowerCase().includes('job') || searchQuery.toLowerCase().includes('career')) {
            path = '/explore-jobs';
        }
        navigate(path, { state: { searchQuery, pincode } });
    };

    const categories = [
        { id: 'Jobs', label: 'Jobs', sub: 'Find opportunities', icon: Briefcase, color: 'bg-indigo-600', path: '/explore-jobs' },
        { id: 'Services', label: 'Services', sub: 'Book local pros', icon: Zap, color: 'bg-emerald-600', path: '/explore-shop' },
        { id: 'Products', label: 'Products', sub: 'Buy trusted goods', icon: ShoppingBag, color: 'bg-orange-500', path: '/explore-shop' },
        { id: 'Membership', label: 'Membership', sub: 'Unlock digital pass', icon: CreditCard, color: 'bg-rose-500', path: '/profile' },
    ];

    return (
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a0a0b]">
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#1e293b,transparent)] opacity-40" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Floating Glow Orbs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" 
                />
            </div>

            <div className="container-xl relative z-10 px-6 w-full max-w-8xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    
                    {/* Left Content - Typography & Search */}
                    <div className="w-full lg:w-[55%] text-left">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Live Platform Protocol</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl xl:text-8xl font-black text-white tracking-tight mb-8 leading-[0.9] font-syne"
                        >
                            All Services. <br />
                            One Hub. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400">Your Location.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-400 font-medium max-w-xl mb-12 leading-relaxed"
                        >
                            FIC transforms your pincode into a portal for verified jobs, 
                            on-demand services, and premium product assets.
                        </motion.p>

                        {/* Pincode Search Bar */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-xl bg-white rounded-3xl p-1.5 flex flex-col md:flex-row gap-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] mb-10"
                        >
                            <div className="flex-1 flex items-center gap-4 px-6 py-4">
                                <LocateFixed className="text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your pincode to explore"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    maxLength={6}
                                    className="w-full outline-none text-slate-900 font-bold placeholder:text-slate-400 text-sm"
                                />
                                <button 
                                    onClick={detectLocation}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                                    title="Auto-detect location"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 size={18} className="animate-spin text-primary" />
                                    ) : (
                                        <Navigation size={18} className="text-primary group-hover:scale-110 transition-transform" />
                                    )}
                                </button>
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-[0.2em]"
                            >
                                Search
                            </button>
                        </motion.div>

                        <div className="flex flex-wrap gap-4 items-center">
                            {['Jobs', 'Home Services', 'Web Solutions', 'Products'].map(tag => (
                                <span key={tag} className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Map Visualization */}
                    <div className="w-full lg:w-[45%] h-[400px] lg:h-[600px] relative group">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] border border-white/5 backdrop-blur-sm overflow-hidden">
                            {/* SVG Grid Map Background */}
                            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500/30" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                                {/* Simplified India Map Path or Abstract Shapes */}
                                <path 
                                    d="M300,100 Q400,50 500,100 T700,300 Q750,450 600,550 T300,500 Q150,450 100,300 T300,100" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    className="text-blue-500/20"
                                    strokeDasharray="5,5"
                                />
                            </svg>

                            {/* Dynamic Markers */}
                            <MapMarker x={35} y={30} delay={1.0} label="Elite Jobs" icon={Briefcase} />
                            <MapMarker x={65} y={45} delay={1.2} label="Verified Pros" icon={Zap} />
                            <MapMarker x={45} y={70} delay={1.4} label="Premium Shop" icon={ShoppingBag} />
                            <MapMarker x={25} y={60} delay={1.6} label="Membership Active" icon={CreditCard} />

                            {/* Connection Lines (Animated) */}
                            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                                <motion.path 
                                    d="M 35% 30% L 65% 45% L 45% 70% L 35% 30%" 
                                    fill="none" 
                                    stroke="url(#lineGradient)" 
                                    strokeWidth="1.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.4 }}
                                    transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 5 }}
                                />
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Floating Category Cards Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between items-end">
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="glass-premium p-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 group-hover:scale-110 transition-transform"
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                        <LocateFixed size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">Your Pincode</p>
                                        <p className="text-xs font-bold text-blue-400">{pincode || 'Detecting...'}</p>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    {categories.slice(0, 2).map((cat, idx) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 2.5 + (idx * 0.2) }}
                                            onClick={() => navigate(cat.path)}
                                            className="w-32 h-32 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all cursor-pointer group/card"
                                        >
                                            <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover/card:scale-110 transition-transform`}>
                                                <cat.icon size={20} />
                                            </div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{cat.label}</h4>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Powered By Badge */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-white rounded-full shadow-2xl flex items-center gap-4 z-30 border border-slate-100">
                             <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                    </div>
                                ))}
                             </div>
                             <div className="h-6 w-[1px] bg-slate-100" />
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="text-slate-900">5k+ Professionals</span> in your area
                             </p>
                        </div>
                    </div>
                </div>

                {/* Membership Digital Strip */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-24 lg:mt-32 max-w-6xl mx-auto glass-premium p-1 md:p-2 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center gap-2 overflow-hidden"
                >
                    <div className="flex-1 flex items-center gap-6 px-8 py-6">
                        <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner shrink-0">
                            <CreditCard size={28} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                FIC Digital Pass <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] rounded-md tracking-widest">NO DELIVERY REQUIRED</span>
                            </h3>
                            <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Unlock unlimited services instantly with our Digital Subscription</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-full md:w-auto px-12 py-8 bg-white text-slate-900 font-black rounded-[2rem] text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-4 group active:scale-95"
                    >
                        Activate Membership <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketplaceHero;

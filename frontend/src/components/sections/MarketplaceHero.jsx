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
                    <div className="w-full lg:w-[50%] h-[450px] lg:h-[650px] relative">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] border border-white/5 backdrop-blur-sm overflow-hidden group">
                            {/* SVG Dotted India Map */}
                            <svg className="absolute inset-0 w-full h-full opacity-40 p-10" viewBox="0 0 600 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-blue-500/40" />
                                    </pattern>
                                </defs>
                                {/* India Map Path (Simplified) */}
                                <path 
                                    d="M300,50 L340,70 L380,60 L420,100 L450,150 L480,220 L500,300 L480,380 L450,450 L400,520 L350,600 L300,650 L250,600 L200,520 L150,450 L120,380 L100,300 L120,220 L150,150 L180,100 L220,60 L260,70 Z" 
                                    fill="url(#dots)"
                                    className="filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                />
                                <motion.path 
                                    d="M300,50 L340,70 L380,60 L420,100 L450,150 L480,220 L500,300 L480,380 L450,450 L400,520 L350,600 L300,650 L250,600 L200,520 L150,450 L120,380 L100,300 L120,220 L150,150 L180,100 L220,60 L260,70 Z" 
                                    stroke="currentColor" 
                                    strokeWidth="1" 
                                    className="text-blue-400/20"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                />
                            </svg>

                            {/* Network Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none p-10">
                                <motion.path 
                                    d="M 180 210 L 360 280 L 300 490 L 120 350 Z" 
                                    fill="none" 
                                    stroke="url(#lineGrad)" 
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                    animate={{ strokeDashoffset: [0, -20] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Dynamic Map Pins with Tooltips */}
                            <div className="absolute inset-0 p-10">
                                <div className="relative w-full h-full">
                                    <MapPinPoint x={30} y={30} label="120 Jobs" icon={Briefcase} />
                                    <MapPinPoint x={60} y={40} label="45 Services" icon={Zap} />
                                    <MapPinPoint x={50} y={70} label="20 Products" icon={ShoppingBag} />
                                    <MapPinPoint x={20} y={50} label="Premium Pass" icon={CreditCard} />
                                </div>
                            </div>

                            {/* Floating Category Connectors */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative w-full h-full">
                                    {categories.map((cat, i) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.5 + (i * 0.2) }}
                                            className={`absolute pointer-events-auto cursor-pointer group/cat`}
                                            style={{ 
                                                top: i < 2 ? '15%' : '75%', 
                                                left: i % 2 === 0 ? '10%' : '70%' 
                                            }}
                                            onClick={() => navigate(cat.path)}
                                        >
                                            <div className="glass-premium p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4 group-hover/cat:scale-110 group-hover/cat:border-blue-500/50 transition-all duration-500">
                                                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                    <cat.icon size={20} />
                                                </div>
                                                <div className="text-left hidden md:block">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">{cat.label}</p>
                                                    <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{cat.sub}</p>
                                                </div>
                                            </div>
                                            {/* Connection Line back to center or pin */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -rotate-45 -z-10 opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Location Live Feed Badge */}
                        <motion.div 
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-5 bg-white dark:bg-dark-card rounded-[2rem] shadow-2xl flex items-center gap-4 z-30 border border-slate-100 dark:border-gray-800"
                        >
                             <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                                <Sparkles size={20} />
                             </div>
                             <div className="text-left">
                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Active in {appLocation?.city || 'Your Area'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">5.2k+ Local Verifications Completed</p>
                             </div>
                        </motion.div>
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

const MapPinPoint = ({ x, y, label, icon: Icon }) => (
    <motion.div 
        className="absolute z-20 group"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <div className="relative">
            <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-md -m-2"
            />
            <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center relative cursor-pointer">
                <Icon size={10} className="text-white" />
                
                {/* Enhanced Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap">
                        <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {label}
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900/90" />
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default MarketplaceHero;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Zap, ShoppingBag, 
  Briefcase, ArrowRight, ShieldCheck, 
  ChevronRight, CreditCard, Star, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceHero = () => {
    const navigate = useNavigate();
    const [pincode, setPincode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('Jobs');

    const handleSearch = () => {
        let path = '/explore-shop';
        if (activeSearch === 'Jobs' || searchQuery.toLowerCase().includes('job')) {
            path = '/explore-jobs';
        }
        navigate(path, { state: { searchQuery, pincode } });
    };

    const categories = [
        { id: 'Jobs', label: 'Jobs', sub: 'Find the right opportunity', icon: Briefcase, color: 'bg-indigo-600', path: '/explore-jobs' },
        { id: 'Services', label: 'Services', sub: 'Book trusted local services', icon: Zap, color: 'bg-emerald-600', path: '/explore-shop' },
        { id: 'Products', label: 'Products', sub: 'Buy from trusted sellers', icon: ShoppingBag, color: 'bg-orange-500', path: '/explore-shop' },
        { id: 'Membership', label: 'Membership', sub: 'Unlock unlimited benefits', icon: CreditCard, color: 'bg-rose-500', path: '/profile' },
    ];

    return (
        <section className="relative min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden bg-[#0a0a0b]">
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-40" />
                
                {/* Floating Glow Orbs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.3, 0.1],
                        x: [0, -60, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px]" 
                />
                
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="container-xl relative z-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* Left Content - Text & Search */}
                    <div className="flex-1 text-left">
                        {/* Status Badge */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                        >
                            <Star size={14} className="text-blue-500 fill-blue-500" />
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">All-in-One Platform</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.95]"
                        >
                            All Services. <br />
                            One Platform. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Powered by Your Location.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-400 font-medium max-w-xl mb-12"
                        >
                            Find jobs, book services, buy products and more – <br />
                            all in your city, all in one place.
                        </motion.p>

                        {/* Search Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl bg-white rounded-3xl p-1.5 flex flex-col md:flex-row gap-2 shadow-2xl mb-10"
                        >
                            <div className="flex-1 flex items-center gap-4 px-6 py-4">
                                <MapPin className="text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your pincode to explore jobs, services & products"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    maxLength={6}
                                    className="w-full outline-none text-slate-900 font-bold placeholder:text-slate-400 text-sm"
                                />
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Search
                            </button>
                        </motion.div>

                        {/* Popular Searches */}
                        <div className="flex flex-wrap items-center gap-3 mb-16">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Popular Searches:</span>
                            {['Electrician', 'Jobs in IT', 'Mobile Phones', 'Home Cleaning'].map(s => (
                                <button key={s} onClick={() => setSearchQuery(s)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Category Shortcuts */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                    onClick={() => navigate(cat.path)}
                                    className="group cursor-pointer bg-white/5 border border-white/10 p-5 rounded-[2rem] hover:bg-white/10 transition-all text-left flex flex-col"
                                >
                                    <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <cat.icon size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">{cat.label}</h3>
                                    <p className="text-[9px] text-white/40 font-bold leading-tight">{cat.sub}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Visual Feature */}
                    <div className="hidden lg:flex flex-1 relative justify-center">
                        <div className="relative">
                            {/* Main Visual Image (User with Phone) */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative z-10 w-[500px] h-[600px]"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" 
                                    className="w-full h-full object-cover rounded-[4rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10"
                                    alt="User Hero"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60 rounded-[4rem]" />
                            </motion.div>

                            {/* Floating Membership Card */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 top-1/4 z-20 w-72 glass-premium p-8 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                        <CreditCard size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Membership Card</span>
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Unlimited Services Within Your Plan</h4>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="group flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-indigo-400 transition-colors"
                                >
                                    Explore Plans <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
                            <div className="absolute -right-24 -top-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                        </div>
                    </div>
                </div>

                {/* Membership Strip */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 max-w-6xl mx-auto glass-premium p-4 md:p-6 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-6 px-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                            <ShieldCheck size={28} />
                        </div>
                        <p className="text-sm md:text-base font-bold text-white/90 text-left">
                            Use Membership Card Like a Pass – <span className="text-indigo-400 font-black uppercase tracking-tight">Get Unlimited Services Within Your Plan</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="px-10 py-4 bg-white text-[#0a0a0b] font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl shadow-white/5 active:scale-95"
                    >
                        View Membership Plans <ArrowRight size={16} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketplaceHero;

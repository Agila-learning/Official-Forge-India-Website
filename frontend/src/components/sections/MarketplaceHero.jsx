import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, ShoppingBag, Briefcase, GraduationCap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceHero = () => {
    const navigate = useNavigate();
    const [pincode, setPincode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'jobs', label: 'Jobs', icon: Briefcase, color: 'from-blue-500 to-indigo-600', path: '/explore-jobs' },
        { id: 'services', label: 'Services', icon: Zap, color: 'from-emerald-500 to-teal-600', path: '/explore-shop' },
        { id: 'products', label: 'Products', icon: ShoppingBag, color: 'from-rose-500 to-pink-600', path: '/explore-shop' },
        { id: 'training', label: 'Training', icon: GraduationCap, color: 'from-amber-500 to-orange-600', path: '/services' },
    ];

    const handleSearch = () => {
        const isJobSearch = searchQuery.toLowerCase().includes('job') || 
                          searchQuery.toLowerCase().includes('work') || 
                          searchQuery.toLowerCase().includes('career');
        
        const path = isJobSearch ? '/explore-jobs' : '/explore-shop';
        navigate(path, { state: { searchQuery, pincode } });
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-slate-950">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-50" />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" 
                />
            </div>

            <div className="container-xl relative z-10 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Trust Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <ShieldCheck size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Pincode-Verified Multi-Service Marketplace</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                    >
                        DEPLOY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 italic">EXCELLENCE</span> <br />
                        IN YOUR <span className="relative">
                            REGION.
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-600/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-12 italic"
                    >
                        "The ultimate pincode-aware ecosystem for Jobs, IT Solutions, Local Services, and Premium Assets. One Membership. Unlimited Access."
                    </motion.p>

                    {/* Search Hub */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-premium p-2 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row gap-2 mb-16 border border-white/10 max-w-4xl mx-auto"
                    >
                        <div className="flex-1 flex items-center gap-4 px-6 py-5 bg-white/5 rounded-3xl border border-white/5 group focus-within:border-blue-500/50 transition-all">
                            <Search className="text-white/40 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="What mission do you need today?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent w-full outline-none text-white font-bold placeholder:text-white/20 text-sm md:text-base"
                            />
                        </div>
                        <div className="lg:w-48 flex items-center gap-4 px-6 py-5 bg-white/5 rounded-3xl border border-white/5 group focus-within:border-blue-500/50 transition-all">
                            <MapPin className="text-white/40 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="Pincode"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="bg-transparent w-full outline-none text-white font-black placeholder:text-white/20 text-sm md:text-base"
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.8rem] transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            Execute Search <ArrowRight size={16} />
                        </button>
                    </motion.div>

                    {/* Quick Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {categories.map((cat, idx) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                onClick={() => navigate(cat.path)}
                                className="group relative p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all text-left overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity`} />
                                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={24} />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{cat.label}</h3>
                                <p className="text-[9px] text-white/40 font-bold uppercase mt-1">Explore Marketplace</p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Stats / Proof */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-20 flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                    >
                        <div className="text-center">
                            <p className="text-2xl font-black text-white italic">24,000+</p>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Active Pincodes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-white italic">500+</p>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Verified Partners</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-white italic">120+</p>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Service Categories</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MarketplaceHero;

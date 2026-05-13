import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeliveryBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="px-6 py-20 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 bg-[#0a0a0b]" />
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="glass-premium rounded-[4rem] p-8 md:p-16 border border-white/10 overflow-hidden relative group">
                    {/* Floating Elements */}
                    <motion.div 
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 text-white/5 pointer-events-none"
                    >
                        <Truck size={160} />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
                                <Zap size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Logistics Redefined</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Logistics</span> <br/>
                                Deployment.
                            </h2>
                            
                            <p className="text-lg text-white/50 font-medium leading-relaxed max-w-xl italic">
                                From hyperlocal parcels to industrial procurement—we deploy precision logistics across every pincode. Secured. Verified. Instant.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Insured Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400">
                                        <Clock size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">60 Min Express</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/services/delivery')}
                                className="group relative bg-white text-black px-12 py-8 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-white/10 flex items-center gap-4 overflow-hidden"
                            >
                                <span className="relative z-10">Deploy Logistics</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeliveryBanner;

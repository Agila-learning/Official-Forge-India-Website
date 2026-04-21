import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, ShieldCheck, MapPin, Truck, HelpCircle } from 'lucide-react';
import MissionMap from '../components/ui/MissionMap';

const TrackMission = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <ShieldCheck size={48} className="text-gray-300 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">No Active Mission Detected</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-10">Verification Protocol Failure: Mission Data Absent</p>
                <button onClick={() => navigate('/candidate/dashboard')} className="px-10 py-5 bg-primary text-white font-black rounded-3xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">Return to Command Hub</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg pt-32 pb-24 px-6 md:px-12 lg:px-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left: Mission Info */}
                <div className="lg:col-span-1 space-y-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-all">
                        <ArrowLeft size={16} /> Retreat to Command
                    </button>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden group shadow-2xl shadow-primary/5"
                    >
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Strategic Mission</p>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter italic">Tracking <span className="text-primary italic">Live.</span></h2>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-8">Mission #{order._id.slice(-6).toUpperCase()}</p>
                            
                            <div className="flex items-center gap-6 mb-10">
                                <div className="p-4 bg-white dark:bg-dark-card rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                    <Truck size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white">{order.fulfillmentType}</h4>
                                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Certified Fulfillment</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-dark-card p-4 rounded-xl border border-primary/5">
                                    <span>Status</span>
                                    <span className="text-primary animate-pulse">{order.status}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-dark-card p-4 rounded-xl border border-primary/5">
                                    <span>Distance</span>
                                    <span className="text-gray-900 dark:text-white">Calculating...</span>
                                </div>
                            </div>
                        </div>
                        <MapPin size={120} className="absolute -bottom-10 -right-10 text-primary/5 group-hover:scale-110 transition-transform" />
                    </motion.div>

                    <div className="p-8 bg-gray-50 dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2 italic">
                            <HelpCircle size={14} className="text-primary" /> Support Protocol
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed">Having issues with your live feed? Contact our Command Support for immediate tactical assistance.</p>
                        <button className="w-full py-5 bg-white dark:bg-dark-bg text-primary border border-primary/20 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5">Request Signal Patch</button>
                    </div>
                </div>

                {/* Right: Map Simulation */}
                <div className="lg:col-span-2">
                    <MissionMap mission={order} />
                </div>
            </div>
        </div>
    );
};

export default TrackMission;

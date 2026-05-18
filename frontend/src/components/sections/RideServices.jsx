import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Navigation, Clock, ShieldCheck, ArrowRight, Zap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RideServices = () => {
 const navigate = useNavigate();

 const rides = [
 {
 id: 'bike',
 title: 'Bike Taxi',
 desc: 'Beat the traffic with our lightning-fast bike taxi network.',
 icon: Zap,
 price: '₹5/km',
 color: 'bg-yellow-500'
 },
 {
 id: 'taxi',
 title: 'Car Taxi',
 desc: 'Premium comfort rides for your daily commute.',
 icon: Navigation,
 price: '₹12/km',
 color: 'bg-blue-500'
 },
 {
 id: 'delivery',
 title: 'Express Delivery',
 desc: 'Pincode-based lightning delivery for all your needs.',
 icon: Truck,
 price: 'From ₹29',
 color: 'bg-green-500'
 }
 ];

 return (
 <section className="py-24 px-6 bg-slate-50 dark:bg-dark-bg overflow-hidden relative">
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
 
 <div className="max-w-7xl mx-auto relative z-10">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
 <div className="max-w-2xl">
 <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3">Lightning Transit</h4>
 <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
 Ride & Delivery <span className="text-primary">Reimagined.</span>
 </h2>
 <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
 India's first pincode-verified transit network. Reliable, secure, and lightning-fast.
 </p>
 </div>
 <button 
 onClick={() => navigate('/services/landing/bike-taxi')}
 className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:border-primary transition-all"
 >
 Explore Rides <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {rides.map((ride, idx) => (
 <motion.div 
 key={ride.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="glass-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-2xl group hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col h-full cursor-pointer"
 onClick={() => {
 const routeMap = {
 'bike': '/services/landing/bike-taxi',
 'taxi': '/services/landing/car-taxi',
 'delivery': '/services/landing/express-delivery'
 };
 navigate(routeMap[ride.id] || '/services');
 }}
 >
 <div className={`w-14 h-14 md:w-16 md:h-16 ${ride.color} rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-primary/20 relative z-10 flex-shrink-0`}>
 <ride.icon size={28} className="text-white" />
 </div>
 
 <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10 tracking-tight">{ride.title}</h3>
 <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm leading-relaxed relative z-10 flex-grow">
 {ride.desc}
 </p>

 <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 relative z-10 mt-auto">
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Starting At</p>
 <p className="text-lg md:text-xl font-black text-primary">{ride.price}</p>
 </div>
 <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-dark-bg flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
 <ArrowRight size={20} />
 </button>
 </div>

 {/* Background Number */}
 <span className="absolute -bottom-10 -right-5 text-[120px] md:text-[150px] font-black text-slate-50/50 dark:text-white/5 select-none pointer-events-none">
 0{idx + 1}
 </span>
 </motion.div>
 ))}
 </div>

 {/* Trust Footer */}
 <div className="mt-20 flex flex-wrap justify-center gap-12 grayscale opacity-30">
 {[
 { icon: ShieldCheck, label: 'Verified Drivers' },
 { icon: Clock, label: 'Live Tracking' },
 { icon: MapPin, label: 'Pincode Precise' }
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3">
 <item.icon size={20} />
 <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
};

export default RideServices;

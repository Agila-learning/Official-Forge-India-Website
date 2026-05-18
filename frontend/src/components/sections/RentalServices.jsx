import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, Hotel, Key, MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RentalServices = () => {
 const navigate = useNavigate();

 const rentals = [
 {
 id: 'pg',
 title: 'Modern PGs',
 location: 'Krishnagiri / Bangalore',
 price: '₹5,500/mo',
 image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
 icon: Building2
 },
 {
 id: 'villas',
 title: 'Luxury Villas',
 location: 'Hosur / Chennai',
 price: '₹45,000/mo',
 image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
 icon: Home
 },
 {
 id: 'hotels',
 title: 'Business Hotels',
 location: 'All India',
 price: '₹2,500/day',
 image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
 icon: Hotel
 }
 ];

 return (
 <section className="py-32 px-6 bg-white dark:bg-dark-card overflow-hidden">
 <div className="max-w-7xl mx-auto">
 <div className="text-center max-w-3xl mx-auto mb-20">
 <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">FIC Spaces</h4>
 <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
 Stay. Work. <span className="text-primary">Thrive.</span>
 </h2>
 <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
 Discover verified PGs, Hotels, and Rentals with zero brokerage and total transparency.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
 {rentals.map((item, idx) => (
 <motion.div 
 key={item.id}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 transition={{ delay: idx * 0.1 }}
 className="group cursor-pointer flex flex-col h-full"
 onClick={() => {
 // Map IDs to the new dynamic category routes
 const routeMap = {
 'pg': '/services/landing/pg',
 'villas': '/services/landing/villas',
 'hotels': '/services/landing/hotels'
 };
 navigate(routeMap[item.id] || '/services');
 }}
 >
 <div className="relative rounded-[3rem] overflow-hidden mb-8 shadow-2xl shadow-slate-200 dark:shadow-black/20 h-[300px] md:h-[400px] flex-shrink-0">
 <img 
 src={item.image} 
 alt={item.title} 
 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
 
 <div className="absolute top-6 right-6">
 <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30">
 <item.icon size={22} />
 </div>
 </div>

 <div className="absolute bottom-8 left-8 right-8 text-white">
 <div className="flex items-center gap-2 mb-3">
 <MapPin size={14} className="text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest">{item.location}</span>
 </div>
 <h3 className="text-xl md:text-2xl font-black tracking-tight mb-4">{item.title}</h3>
 <div className="flex items-center justify-between">
 <p className="text-lg md:text-xl font-black text-primary">{item.price}</p>
 <div className="flex items-center gap-1">
 <Star size={14} className="text-yellow-500 fill-yellow-500" />
 <span className="text-xs font-black">4.9</span>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="mt-20 p-10 rounded-[3.5rem] bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
 <div className="flex items-center gap-8">
 <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary">
 <Key size={32} />
 </div>
 <div>
 <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Own a Property?</h4>
 <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Join our network and reach thousands of verified seekers.</p>
 </div>
 </div>
 <button 
 onClick={() => navigate('/register', { state: { presetRole: 'Rental Provider' }})}
 className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
 >
 List Your Space <ArrowRight size={16} />
 </button>
 </div>
 </div>
 </section>
 );
};

export default RentalServices;

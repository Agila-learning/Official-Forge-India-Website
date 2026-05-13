import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 ChevronLeft, ChevronRight, Zap, Star
} from 'lucide-react';
import ServiceCard from '../ui/ServiceCard';
import api from '../../services/api';

const HorizontalCarousel = ({ title, items, onBook }) => {
 const scrollRef = React.useRef(null);

 const scroll = (direction) => {
 if (scrollRef.current) {
 const { scrollLeft, clientWidth } = scrollRef.current;
 const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
 scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
 }
 };

 if (!items || items.length === 0) return null;

 return (
 <div className="mb-20">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{title}</h3>
 <div className="flex gap-2">
 <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
 <ChevronLeft size={20} />
 </button>
 <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
 <ChevronRight size={20} />
 </button>
 </div>
 </div>
 
 <div 
 ref={scrollRef}
 className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
 >
 {items.map((item) => (
 <div key={item._id || item.id} className="min-w-[300px] md:min-w-[380px] snap-start">
 <ServiceCard product={item} onBook={onBook} />
 </div>
 ))}
 </div>
 </div>
 );
};

const Services = () => {
 const [services, setServices] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchServices = async () => {
 try {
 const { data } = await api.get('/products');
 const onlyServices = (data || []).filter(p => p.isService);
 setServices(onlyServices);
 } catch (err) {
 console.error('Failed to fetch services for homepage carousel', err);
 } finally {
 setLoading(false);
 }
 };
 fetchServices();
 }, []);

 const handleBookNow = (service) => {
 // This component is mostly for display on home, 
 // redirects to services page for actual booking flow if needed,
 // or we can handle it here if requested.
 window.location.href = `/services`;
 };

 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 const userMembership = userInfo.membershipVault || { planValue: 0 };

 const popularServices = services.filter(s => s.rating >= 4.5).slice(0, 8);
 const membershipServices = services.filter(s => s.price <= userMembership.planValue).slice(0, 8);

 if (loading || services.length === 0) return null;

 return (
 <section id="services" className="py-24 bg-white dark:bg-dark-bg overflow-hidden border-t border-slate-100 dark:border-slate-800">
 <div className="container-xl px-6">
 <HorizontalCarousel title="Popular Services in Your Area" items={popularServices} onBook={handleBookNow} />
 <HorizontalCarousel title="Included in Membership (Unlimited)" items={membershipServices} onBook={handleBookNow} />
 </div>
 </section>
 );
};

export default Services;

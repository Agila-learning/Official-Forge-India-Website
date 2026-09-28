import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import api from '../../services/api';

const TestimonialCard = ({ rev, idx }) => (
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: idx * 0.1 }}
 className="glass-card p-10 flex flex-col relative group h-full cursor-pointer"
 >
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
 
 <div className="flex justify-between items-start mb-8">
 <div className="flex gap-1">
 {[...Array(5)].map((_, i) => (
 <Star key={i} size={14} className={i < (rev.rating || 5) ? "fill-secondary text-secondary" : "text-white/10"} />
 ))}
 </div>
 <Zap size={16} className="text-primary animate-pulse" />
 </div>

 <div className="relative mb-8 flex-1">
 <Quote className="text-white/5 absolute -top-8 -left-8" size={80} />
 <p className="text-base font-medium text-white/70 leading-relaxed relative z-10">
 "{rev.content || rev.comment}"
 </p>
 </div>

 <div className="flex items-center gap-4 pt-8 border-t border-white/5 mt-auto">
 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-primary shadow-inner shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
 {rev.name?.charAt(0)}
 </div>
 <div>
 <h4 className="font-black text-white text-sm flex items-center gap-2 uppercase tracking-tight">
 {rev.name}
 <CheckCircle2 size={14} className="text-secondary" />
 </h4>
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">
 {rev.role || rev.user?.role || 'Verified Partner'}
 </p>
 </div>
 </div>
 </motion.div>
);

const Testimonials = ({ previewMode = false }) => {
 const [reviews, setReviews] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [reviewsRes, testimonialsRes] = await Promise.all([
 api.get('/reviews/public').catch(() => ({ data: [] })),
 api.get('/testimonials').catch(() => ({ data: [] }))
 ]);
 const tData = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : [];
 const rData = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
 const combined = [...tData, ...rData];
 setReviews(combined);
 } catch (err) {
 console.error('Failed to load testimonials');
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 

 const displayReviews = reviews;

 return (
 <section id="testimonials" className="py-32 bg-dark-bg relative overflow-hidden">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
 
 <div className="container-xl px-6 relative z-10">
 <div className="max-w-3xl mb-20">
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-secondary/20"
 >
 Community Trust Signals
 </motion.div>
 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
 Real Impact. <span className="text-primary">Global</span> Stories.
 </h2>
 <p className="text-lg text-white/40 font-medium">
 Verified experiences from our multi-service ecosystem of partners, candidates, and clients.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {displayReviews.slice(0, previewMode ? 3 : undefined).map((rev, idx) => (
 <TestimonialCard key={idx} rev={rev} idx={idx} />
 ))}
 </div>

  {previewMode && (
    <div className="mt-12 text-center">
      <a href="/achievements" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-blue-600 transition-colors shadow-xl shadow-primary/20">
        View More Achievements <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  )}

<div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10">
 <div className="flex -space-x-4">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="w-14 h-14 rounded-full border-4 border-dark-bg bg-white/10 overflow-hidden ring-2 ring-primary/20">
 <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
 </div>
 ))}
 </div>
 <div className="text-center md:text-left">
 <p className="text-xl font-black text-white uppercase tracking-tight mb-1">
 Joined by <span className="text-primary">5,000+</span> Success Stories
 </p>
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
 Growing every minute across the ecosystem
 </p>
 </div>
 </div>
 </div>
 </section>
 );
};

export default Testimonials;

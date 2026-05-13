import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, GraduationCap, Award, TrendingUp, MapPin } from 'lucide-react';

const metrics = [
 { icon: Users, value: 2400, suffix: '+', label: 'Candidates Placed', sub: 'Banking, IT & BPO', color: 'text-blue-500' },
 { icon: Building2, value: 180, suffix: '+', label: 'Hiring Partners', sub: 'Verified Enterprises', color: 'text-cyan-500' },
 { icon: GraduationCap, value: 40, suffix: '+', label: 'College Partners', sub: 'Campus Drives', color: 'text-indigo-500' },
 { icon: Award, value: 95, suffix: '%', label: 'Placement Rate', sub: 'Industry Success', color: 'text-orange-500' },
 { icon: TrendingUp, value: 6, suffix: '+', label: 'Years Excellence', sub: 'Trusted since 2018', color: 'text-amber-500' },
 { icon: MapPin, value: 3, suffix: '', label: 'Strategic Hubs', sub: 'Chennai · Krishnagiri · BLR', color: 'text-emerald-500' },
];

const useCounter = (target, duration = 2000, start = false) => {
 const [count, setCount] = useState(0);
 useEffect(() => {
 if (!start) return;
 let startTime = null;
 const animate = (timestamp) => {
 if (!startTime) startTime = timestamp;
 const elapsed = timestamp - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const eased = 1 - Math.pow(1 - progress, 3);
 setCount(Math.floor(eased * target));
 if (progress < 1) requestAnimationFrame(animate);
 };
 requestAnimationFrame(animate);
 }, [target, duration, start]);
 return count;
};

const MetricCard = ({ metric, delay }) => {
 const ref = useRef(null);
 const inView = useInView(ref, { once: true, margin: '-80px' });
 const count = useCounter(metric.value, 2000, inView);
 const Icon = metric.icon;

 return (
 <motion.div
 ref={ref}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={inView ? { opacity: 1, scale: 1 } : {}}
 transition={{ duration: 0.6, delay }}
 className="glass-card p-10 group relative overflow-hidden"
 >
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 
 <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500 ${metric.color}`}>
 <Icon size={32} />
 </div>
 
 <div className="space-y-2">
 <div className={`text-5xl font-black tracking-tighter ${metric.color}`}>
 {count}{metric.suffix}
 </div>
 <h3 className="text-sm font-black text-white uppercase tracking-widest">{metric.label}</h3>
 <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{metric.sub}</p>
 </div>

 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
 </motion.div>
 );
};

const MetricsSection = () => (
 <section className="py-32 bg-dark-bg relative overflow-hidden">
 <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
 
 <div className="container-xl px-6 relative z-10">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
 <div className="max-w-2xl">
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-primary/20"
 >
 Live Performance Metrics
 </motion.div>
 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
 Scale of <span className="text-primary">Impact</span>
 </h2>
 </div>
 <p className="text-lg text-white/40 font-medium max-w-sm">
 Tracking real-time metrics across our service verticals and placement ecosystem.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {metrics.map((m, i) => (
 <MetricCard key={m.label} metric={m} delay={i * 0.1} />
 ))}
 </div>
 </div>
 </section>
);

export default MetricsSection;

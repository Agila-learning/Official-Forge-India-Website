import React from 'react';
import { motion } from 'framer-motion';
import { 
 Home, Zap, Briefcase, GraduationCap, Smartphone, 
 ShieldCheck, Building2, Utensils, ShoppingBag, 
 ArrowUpRight, Heart, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
 { 
 id: 'it', 
 label: 'IT & Software', 
 icon: Smartphone, 
 count: '240+ Services',
 color: 'from-blue-500 to-indigo-600',
 tags: ['Web Dev', 'Mobile App', 'AI Solutions'],
 path: '/services/category/it-solutions'
 },
 { 
 id: 'home', 
 label: 'Home Services', 
 icon: Home, 
 count: '150+ Experts',
 color: 'from-emerald-500 to-teal-600',
 tags: ['Cleaning', 'Plumbing', 'Electrical'],
 path: '/explore-shop'
 },
 { 
 id: 'jobs', 
 label: 'Job Marketplace', 
 icon: Briefcase, 
 count: '1,200+ Openings',
 color: 'from-rose-500 to-pink-600',
 tags: ['Banking', 'IT Jobs', 'Logistics'],
 path: '/explore-jobs'
 },
 { 
 id: 'consulting', 
 label: 'Business Consulting', 
 icon: Building2, 
 count: '45+ Verticals',
 color: 'from-amber-500 to-orange-600',
 tags: ['GST', 'Insurance', 'Licensing'],
 path: '/services/category/business-consulting'
 },
 { 
 id: 'shopping', 
 label: 'Product Assets', 
 icon: ShoppingBag, 
 count: '5,000+ Items',
 color: 'from-purple-500 to-violet-600',
 tags: ['Electronics', 'Health', 'Industrial'],
 path: '/explore-shop'
 },
 { 
 id: 'training', 
 label: 'Skill Academy', 
 icon: GraduationCap, 
 count: '15+ Programs',
 color: 'from-cyan-500 to-blue-600',
 tags: ['Full Stack', 'UI/UX', 'Marketing'],
 path: '/training-placement'
 },
 { 
 id: 'job-consulting', 
 label: 'Job Consulting', 
 icon: Briefcase, 
 count: 'Elite Protocol',
 color: 'from-indigo-400 to-blue-500',
 tags: ['Resume Review', 'Mock Interview', 'Salary Negotiation'],
 path: '/job-consulting'
 },
 { 
 id: 'bike-taxi', 
 label: 'Bike Taxi', 
 icon: Zap, 
 count: 'Instant Pickup',
 color: 'from-orange-400 to-red-500',
 tags: ['Swift', 'Economical', 'City wide'],
 path: '/services/category/bike-taxi'
 },
 { 
 id: 'car-taxi', 
 label: 'Car Taxi', 
 icon: Zap, 
 count: 'Luxury & Mini',
 color: 'from-blue-400 to-indigo-500',
 tags: ['Safe', 'Intercity', 'Airport'],
 path: '/services/category/car-taxi'
 },
 { 
 id: 'luxury-stays', 
 label: 'Hotels & PG', 
 icon: Building2, 
 count: 'Premium Stays',
 color: 'from-violet-500 to-purple-600',
 tags: ['Luxury', 'Budget PG', 'Verified'],
 path: '/services/category/stay'
 }
];

const MarketplaceCategories = () => {
 const navigate = useNavigate();

 return (
 <section className="py-24 bg-white dark:bg-dark-bg overflow-hidden">
 <div className="container-xl px-6">
 <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
 <div className="max-w-2xl">
 <motion.span 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block"
 >
 Discovery Protocol
 </motion.span>
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]"
 >
 EXPLORE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ECOSYSTEM.</span>
 </motion.h2>
 </div>
 <motion.p 
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="text-sm text-gray-500 font-bold uppercase tracking-widest max-w-xs md:text-right"
 >
 Verified vendors and specialized agencies across 12+ industry verticals.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {categories.map((category, idx) => (
 <motion.div
 key={category.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.05 }}
 onClick={() => navigate(category.path)}
 className="group relative p-8 rounded-[2.5rem] bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
 >
 <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-500`} />

 <div className="flex items-start justify-between mb-10">
 <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-[1.8rem] flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-all duration-500`}>
 <category.icon size={28} />
 </div>
 <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all transform group-hover:rotate-45">
 <ArrowUpRight size={20} />
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">{category.label}</h3>
 <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-full border border-primary/10">
 {category.count}
 </p>
 
 <div className="flex flex-wrap gap-2 pt-4">
 {category.tags.map(tag => (
 <span key={tag} className="text-[9px] font-bold text-gray-400 uppercase tracking-tight px-3 py-1 bg-white dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-lg group-hover:border-primary/20 group-hover:text-primary transition-all">
 {tag}
 </span>
 ))}
 </div>
 </div>

 {/* Bottom Stat */}
 <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
 <div className="flex items-center gap-1.5">
 <ShieldCheck size={14} className="text-green-500" />
 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified Hub</span>
 </div>
 <div className="flex -space-x-2">
 {[1, 2, 3].map(i => (
 <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-card bg-slate-200 overflow-hidden">
 <img src={`https://i.pravatar.cc/100?u=${cat.id}${i}`} alt="user" className="w-full h-full object-cover" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Bottom Trust Action */}
 <motion.div 
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 className="mt-20 p-12 bg-slate-900 dark:bg-dark-card rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10 border border-white/5 relative overflow-hidden shadow-2xl"
 >
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#2563eb,transparent)] opacity-10" />
 <div className="relative z-10">
 <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Become a Verified <span className="text-blue-500">Partner.</span></h4>
 <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Scale your business or career through FIC logistics network.</p>
 </div>
 <div className="flex flex-wrap gap-4 relative z-10">
 <button onClick={() => navigate('/register')} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Register Vendor</button>
 <button onClick={() => navigate('/services')} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">View Protocol</button>
 </div>
 </motion.div>
 </div>
 </section>
 );
};

export default MarketplaceCategories;

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Zap, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ product, onBook }) => {
 const navigate = useNavigate();
 const isService = product.isService;
 
 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 const userMembership = userInfo.membershipVault || { planValue: 0 };
 const isIncluded = userInfo.isMember && product.price <= userMembership.planValue;

 const isConsultation = ['it-solutions', 'website-development', 'app-development', 'insurance-services', 'software-development', 'ui-ux-design', 'digital-marketing', 'Consulting', 'IT Solutions'].some(
 type => product.serviceType?.includes(type) || product.category?.includes(type)
 );
 
 return (
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 whileHover={{ 
 y: -10,
 rotateY: 5,
 rotateX: -2,
 transition: { duration: 0.4, ease: "easeOut" }
 }}
 className="group glass-card p-4 h-full relative preserve-3d perspective-1000 cursor-pointer"
 >
 {/* Glow Overlay */}
 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[80px] rounded-full -z-10" />

 <div className="bg-dark-bg/40 rounded-[2rem] overflow-hidden relative border border-white/5 h-full flex flex-col">
 {/* Standardized Aspect Ratio Container */}
 <div className="relative h-48 sm:h-52 w-full overflow-hidden">
 <img 
 src={product.image || '/logo.jpg'} 
 alt={product.name} 
 loading="lazy"
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent"></div>
 
 {/* Floating Badges */}
 <div className="absolute top-4 left-4 flex flex-col gap-2">
 {isIncluded && (
 <div className="px-3 py-1 bg-primary text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-white/20 animate-pulse">
 <ShieldCheck size={10} fill="currentColor" /> Pro Tier
 </div>
 )}
 {product.rating >= 4.8 && (
 <div className="px-3 py-1 bg-secondary text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
 <Star size={10} fill="currentColor" /> Enterprise Choice
 </div>
 )}
 </div>

 {/* Rating Badge */}
 <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[8px] font-black text-white flex items-center gap-1.5">
 <Star size={10} className="text-secondary fill-secondary" />
 {product.rating || '4.9'}
 </div>
 
 {product.willLaunchSoon && (
  <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-[2px] flex items-center justify-center z-10">
    <div className="px-6 py-2 bg-gradient-to-r from-orange-500/80 to-pink-600/80 border border-white/30 backdrop-blur-md rounded-2xl transform -rotate-12 shadow-2xl scale-110">
       <span className="text-white font-black uppercase tracking-[0.3em] text-xs shadow-black drop-shadow-md">Launching Soon</span>
    </div>
  </div>
 )}
 </div>

 <div className="p-8 flex flex-col flex-grow">
 <div className="mb-6">
 <h3 className="text-xl font-black text-white tracking-tighter mb-2 leading-tight uppercase group-hover:text-primary transition-colors">
 {product.name}
 </h3>
 <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
 <MapPin size={10} className="text-primary" />
 {product.shopName || 'FIC Ecosystem Partner'}
 </div>
 </div>

 <p className="text-xs text-white/40 font-medium mb-8 line-clamp-2 leading-relaxed">
 {product.description || "Transforming operations with enterprise-grade quality standards and verified delivery protocols."}
 </p>

 {/* Highlights */}
 <div className="flex flex-wrap gap-2 mb-8 mt-auto">
 {product.highlights?.slice(0, 2).map((h, i) => (
 <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest">
 <Zap size={10} className="text-primary" /> {h}
 </div>
 ))}
 </div>

 {/* Pricing and CTA */}
 <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
 <div className="flex flex-col">
 <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Valuation</span>
 <span className={`text-2xl font-black tracking-tighter ${isIncluded && !product.willLaunchSoon ? 'text-primary' : 'text-white'}`}>
 {product.willLaunchSoon ? 'TBA' : (isIncluded ? 'ELITE' : `₹${(product.price || 0).toLocaleString()}`)}
 </span>
 </div>
 <button 
 disabled={product.willLaunchSoon}
 onClick={(e) => {
 e.stopPropagation();
 if(!product.willLaunchSoon) onBook(product);
 }}
 className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all ${product.willLaunchSoon ? 'bg-white/5 border border-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5 hover:bg-primary hover:text-white border border-white/10 group-hover:scale-110'}`}
 >
 <ArrowRight size={20} />
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 );
};

export default ServiceCard;

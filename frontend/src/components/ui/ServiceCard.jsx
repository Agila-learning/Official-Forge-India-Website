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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary/5 transition-all relative flex flex-col h-full"
        >
            {/* Standardized Aspect Ratio Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={product.image || '/logo.jpg'} 
                    alt={product.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isIncluded && (
                        <div className="px-3 py-1 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-white/20 animate-pulse">
                            <ShieldCheck size={10} fill="currentColor" /> Membership Included
                        </div>
                    )}
                    {product.rating >= 4.8 && !isIncluded && (
                        <div className="px-3 py-1 bg-yellow-400 text-dark-bg rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                            <Star size={10} fill="currentColor" /> Top Rated
                        </div>
                    )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[9px] font-black text-white flex items-center gap-1.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    {product.rating || '4.9'}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white tracking-tighter mb-1 leading-tight line-clamp-2 uppercase">{product.name}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-[9px] font-black uppercase tracking-widest">
                        <MapPin size={10} className="text-primary" />
                        {product.shopName || 'FIC Partner'}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Truncated Description */}
                <p className="text-xs text-gray-400 font-medium mb-6 line-clamp-3 leading-relaxed italic h-[4.5rem]">
                    {product.description || "Premium service delivered by verified Forge India Connect partners with enterprise-grade quality standards."}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6 min-h-[2.5rem]">
                    {product.highlights?.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <Zap size={10} className="text-primary" /> {h}
                        </div>
                    )) || (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <ShieldCheck size={10} className="text-primary" /> Verified Service
                        </div>
                    )}
                </div>

                {/* Pricing and CTA - Bottom Aligned */}
                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Value</p>
                            <p className={`text-2xl font-black tracking-tighter italic ${isIncluded ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                {isIncluded ? 'FREE' : `₹${product.price.toLocaleString()}`}
                            </p>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-card bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${product._id}${i}`} alt="user" loading="lazy" decoding="async" />
                                </div>
                            ))}
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-bg border-2 border-white dark:border-dark-card flex items-center justify-center text-[8px] font-black text-gray-400">+</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => navigate(`/services/${product._id}`)}
                            className="w-full py-3.5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Details
                        </button>
                        <button 
                            onClick={() => onBook(product)}
                            className={`w-full py-3.5 ${isIncluded ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-blue-700'} text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all active:scale-95`}
                        >
                            {isIncluded ? 'Use Pass' : (isConsultation ? 'Consult' : 'Book')}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Users, Zap, ArrowRight, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ product, onBook, onViewDetails }) => {
    const navigate = useNavigate();
    const isService = product.isService;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary/5 transition-all relative flex flex-col h-full"
        >
            {/* Full Cover Image */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={product.image || '/logo.jpg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Floating Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.rating >= 4.8 && (
                        <div className="px-4 py-1.5 bg-yellow-400 text-dark-bg rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                            <Star size={12} fill="currentColor" /> Popular
                        </div>
                    )}
                    {isService ? (
                        <div className="px-4 py-1.5 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                            <Zap size={12} fill="currentColor" /> On-site Service
                        </div>
                    ) : (
                        product.fulfillmentType === 'Delivery Partner' ? (
                            <div className="px-4 py-1.5 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                <Zap size={12} fill="currentColor" /> Home Delivery
                            </div>
                        ) : (
                            <div className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                <ShieldCheck size={12} fill="currentColor" /> Shop Pickup
                            </div>
                        )
                    )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-6 right-6 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white flex items-center gap-1.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {product.rating || '4.9'} ({product.numReviews || '120'}+)
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white tracking-tighter mb-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-primary" />
                        {product.shopName || 'Forge India Partner'}
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                {/* Highlights */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {product.highlights?.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            <Zap size={10} className="text-primary" /> {h}
                        </div>
                    )) || (
                        <>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                <Clock size={10} className="text-primary" /> {product.duration || '60-90 Mins'}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                <ShieldCheck size={10} className="text-primary" /> Service Guarantee
                            </div>
                        </>
                    )}
                </div>

                <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Service Details: Included/Excluded */}
                <div className="mb-10 flex flex-col gap-4">
                    {product.whatsIncluded && product.whatsIncluded.length > 0 ? (
                        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2 italic">
                                <ShieldCheck size={14} /> What's Included
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {product.whatsIncluded.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-sm"></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2 italic">
                                <ShieldCheck size={14} /> Professional Standard
                            </p>
                            <div className="grid grid-cols-1 gap-2.5">
                                {(product.highlights && product.highlights.length > 0) ? (
                                    product.highlights.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-sm"></div>
                                            {item}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-widest">Standard Service Protocols Applied</p>
                                )}
                            </div>
                        </div>
                    )}

                    {product.whatsExcluded && product.whatsExcluded.length > 0 && (
                        <div className="p-5 bg-red-500/5 rounded-[2rem] border border-red-500/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2 italic">
                                <X size={14} /> What's Excluded
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {product.whatsExcluded.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm opacity-50"></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pricing and CTA */}
                <div className="mt-auto flex items-center justify-between gap-6 pt-8 border-t border-gray-50 dark:border-gray-800">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            {isService ? 'Service Starting From' : 'Direct Shop Value'}
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            ₹{product.price.toLocaleString()}
                        </p>
                    </div>
                    
                        <button 
                            onClick={() => navigate(`/services/${product._id}`)}
                            className="w-full py-4 bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group/btn mb-4"
                        >
                            View Specifications
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => onBook(product)}
                            className="w-full py-4 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            {isService ? 'Book Service' : 'Order Asset'}
                            <Zap size={14} className="fill-current" />
                        </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;

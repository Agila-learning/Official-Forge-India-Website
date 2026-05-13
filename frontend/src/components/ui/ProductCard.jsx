import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, ShoppingBag, ArrowRight, Info, Zap, Sparkles } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite, onViewDetails = () => {} }) => {
 return (
 <motion.div 
 whileHover={{ y: -10 }}
 className="group relative bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-3xl transition-all duration-500 flex flex-col h-full"
 >
 {/* Standardized Aspect Ratio Container */}
 <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-dark-bg">
 <motion.img 
 whileHover={{ scale: 1.1 }}
 transition={{ duration: 0.6 }}
 src={product.image || '/logo.jpg'} 
 alt={product.name} 
 className="w-full h-full object-cover"
 />
 
 {/* Status Overlays */}
 {!product.isService && product.countInStock === 0 && (
 <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
 <span className="px-5 py-1.5 bg-red-600 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-full">Out of Stock</span>
 </div>
 )}
 
 <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
 {product.countInStock > 0 && product.countInStock < 10 && (
 <span className="px-3 py-1 bg-orange-500 text-white font-black text-[8px] uppercase tracking-widest rounded-lg shadow-lg">
 Limited {product.countInStock} Left
 </span>
 )}
 {product.rating >= 4.5 && (
 <span className="px-3 py-1 bg-primary text-white font-black text-[8px] uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-1.5">
 <Sparkles size={10} /> Top Rated
 </span>
 )}
 </div>

 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
 {/* Wishlist Button */}
 <button 
 onClick={(e) => {
 e.stopPropagation();
 onToggleFavorite(product._id);
 }}
 className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md border ${isFavorite ? 'bg-primary border-primary text-white' : 'bg-white/80 dark:bg-dark-card/80 border-white/20 text-gray-400 hover:text-primary hover:scale-110'}`}
 >
 <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
 </button>
 </div>

 <div className="p-6 flex flex-col flex-grow">
 {/* Header Information */}
 <div className="mb-4">
 <div className="flex items-center gap-2 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
 <span>{product.category}</span>
 <span className="w-1 h-1 bg-gray-300 rounded-full" />
 <div className="flex items-center gap-1 text-yellow-500">
 <Star size={10} fill="currentColor" />
 {product.rating || '4.8'}
 </div>
 </div>
 <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem] uppercase">
 {product.name}
 </h3>
 </div>

 {/* Truncated Description */}
 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed h-[2.5rem]">
 {product.description || "Premium quality asset sourced through Forge India Connect verified global supply chain."}
 </p>

 {/* Bottom Section - Pinned to Bottom */}
 <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
 <div className="flex items-center justify-between mb-6">
 <div className="min-w-0">
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Value</p>
 <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter truncate">
 ₹{(product.discountPrice || product.price).toLocaleString()}
 {product.discountPrice && (
 <span className="ml-2 text-[10px] text-gray-400 line-through font-bold opacity-60">₹{product.price.toLocaleString()}</span>
 )}
 </p>
 </div>

 <button 
 onClick={() => onAddToCart(product)}
 disabled={!product.isService && product.countInStock <= 0}
 className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all disabled:opacity-40 active:scale-95 group/cart"
 >
 <ShoppingBag size={20} className="group-hover/cart:scale-110 transition-transform" />
 </button>
 </div>
 
 <button 
 onClick={() => onViewDetails(product)}
 className="w-full py-3 bg-gray-100 dark:bg-white/5 text-[9px] font-black text-primary uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/details"
 >
 View Info <ArrowRight size={12} className="group-hover/details:translate-x-1 transition-transform" />
 </button>
 </div>
 </div>
 </motion.div>
 );
};

export default ProductCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, ShoppingBag, ArrowRight, Info, Zap, Sparkles } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite, onViewDetails = () => {} }) => {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-3xl transition-all duration-500 flex flex-col h-full"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                {/* Image with Parallax-like hover */}
                <motion.img 
                    whileHover={{ scale: 1.1, rotate: 1 }}
                    transition={{ duration: 0.6 }}
                    src={product.image || '/logo.jpg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
                
                {/* Stock Labels */}
                {!product.isService && product.countInStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
                        <span className="px-6 py-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-2xl">Out of Stock</span>
                    </div>
                )}
                {product.countInStock > 0 && product.countInStock < 10 && (
                    <div className="absolute top-6 left-6 z-10">
                        <span className="px-4 py-1.5 bg-orange-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2">
                             Only {product.countInStock} Left
                        </span>
                    </div>
                )}
                {product.rating >= 4.5 && (
                    <div className="absolute top-6 left-6 z-10">
                        <span className="px-4 py-1.5 bg-primary text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2">
                            <Sparkles size={10} /> Top Rated
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Wishlist Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product._id);
                    }}
                    title="Add to Wishlist"
                    className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md border ${isFavorite ? 'bg-primary border-primary text-white' : 'bg-white/80 dark:bg-dark-card/80 border-white/20 text-gray-400 hover:text-primary hover:scale-110'}`}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
                </button>

                {/* View Details Overlay Button */}
                <button 
                    onClick={() => onViewDetails(product)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-md text-dark-bg font-black text-[10px] uppercase tracking-widest rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl flex items-center gap-2"
                >
                    <Info size={14} /> Quick View
                </button>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                        <span>{product.category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={12} fill="currentColor" />
                            {product.rating || '4.8'}
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:text-primary transition-colors hover:cursor-pointer" onClick={() => onViewDetails(product)}>
                        {product.name}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Highlights / Badges Preview */}
                {product.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 text-[8px] font-black text-primary uppercase tracking-[0.1em]">
                                <ShieldCheck size={10} /> {h}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center flex-wrap gap-2">
                            ₹{(product.discountPrice || product.price).toLocaleString()}
                            {product.discountPrice && (
                                <span className="text-xs text-gray-400 line-through font-bold opacity-60">₹{product.price.toLocaleString()}</span>
                            )}
                        </p>
                    </div>

                    <button 
                        onClick={() => onAddToCart(product)}
                        disabled={!product.isService && product.countInStock <= 0}
                        className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale group/cart"
                    >
                        <ShoppingBag size={24} className="group-hover/cart:scale-110 transition-transform" />
                    </button>
                </div>
                
                {/* Secondary 'View Details' Button at bottom for accessibility */}
                <button 
                    onClick={() => onViewDetails(product)}
                    className="mt-6 w-full py-4 bg-gray-50 dark:bg-white/5 text-[10px] font-black text-primary uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all group/details"
                >
                    Expand details <ArrowRight size={14} className="group-hover/details:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;

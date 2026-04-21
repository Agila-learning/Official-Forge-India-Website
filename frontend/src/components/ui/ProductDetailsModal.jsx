import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, Zap, Truck, CheckCircle2, ShoppingBag, MapPin, Heart, Sparkles } from 'lucide-react';

const ProductDetailsModal = ({ product, isOpen, onClose, onAddToCart, onToggleFavorite, isFavorite }) => {
    const [activeView, setActiveView] = React.useState('main'); // 'main', 'front', 'back', 'top', 'bottom'

    if (!product) return null;

    const views = [
        { id: 'main', label: 'Main', icon: ShoppingBag },
        { id: 'front', label: 'Front', icon: CheckCircle2 },
        { id: 'back', label: 'Back', icon: CheckCircle2 },
        { id: 'top', label: 'Top', icon: CheckCircle2 },
        { id: 'bottom', label: 'Bottom', icon: CheckCircle2 },
    ];

    const getImageUrl = () => {
        if (activeView === 'main') return product.image || '/logo.jpg';
        return product.viewImages?.[activeView] || product.image || '/logo.jpg';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    ></motion.div>

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl bg-white dark:bg-dark-bg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh] border border-white/10"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-8 z-20 p-4 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors text-white md:text-gray-900 dark:md:text-white"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Gallery Side */}
                        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative bg-gray-100 dark:bg-dark-card group">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={activeView}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    src={getImageUrl()} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                            
                            {/* 360 Controls */}
                            {product.viewImages && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl z-20 transition-all hover:scale-105">
                                    {['front', 'back', 'top', 'bottom'].map(view => (
                                        product.viewImages[view] && (
                                            <button 
                                                key={view}
                                                onClick={() => setActiveView(view)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === view ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                            >
                                                {view}
                                            </button>
                                        )
                                    ))}
                                    <button 
                                        onClick={() => setActiveView('main')}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'main' ? 'bg-primary text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                    >
                                        RESET
                                    </button>
                                </div>
                            )}

                            {/* Wishlist Button On Image */}
                            <button 
                                onClick={() => onToggleFavorite(product._id)}
                                className={`absolute top-8 left-8 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl backdrop-blur-md border ${isFavorite ? 'bg-primary border-primary text-white' : 'bg-white/20 border-white/20 text-white hover:bg-primary hover:text-white'}`}
                            >
                                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col">
                            {/* Product Header */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                                        <Star size={16} fill="currentColor" />
                                        {product.rating || '4.9'}
                                        <span className="text-gray-400 text-xs ml-1">({product.numReviews} Verified Reviews)</span>
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-4">
                                    {product.name}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <p className="text-xl text-gray-400 font-medium">By {product.shopName || 'Forge India Partner'}</p>
                                    {product.viewImages && (
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2 shadow-sm">
                                            <Sparkles size={10} /> 360° Visualizer
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                            {product.warranty && (
                                <div className="p-6 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 text-primary mb-2">
                                        <ShieldCheck size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guarantee</span>
                                    </div>
                                    <p className="font-bold text-sm">{product.warranty}</p>
                                </div>
                            )}
                            {product.estimatedDeliveryTime && (
                                <div className="p-6 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 text-secondary mb-2">
                                        <Truck size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery</span>
                                    </div>
                                    <p className="font-bold text-sm">{product.estimatedDeliveryTime}</p>
                                </div>
                            )}
                            </div>

                            {/* Description */}
                            <div className="mb-12">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Product Overview</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic">
                                    "{product.description}"
                                </p>
                            </div>

                            {/* Detailed Specs: Included/Excluded/Highlights */}
                            <div className="space-y-12 mb-12">
                                {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <ShieldCheck size={14} /> Comprehensive Coverage
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.whatsIncluded.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                                                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm italic">"{item}"</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.whatsExcluded && product.whatsExcluded.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <X size={14} /> Service Limitations
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.whatsExcluded.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                                                    <X size={16} className="text-red-500 shrink-0 opacity-50" />
                                                    <span className="font-bold text-gray-500 dark:text-gray-400 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.highlights && product.highlights.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 italic">Elite Highlights</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.highlights.map((h, i) => (
                                                <div key={i} className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                                                    <Zap size={14} className="text-secondary" />
                                                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400">{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Serviceable Area Preview */}
                            <div className="mb-12 p-8 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4 text-primary">
                                    <MapPin size={20} />
                                    <span className="text-sm font-black uppercase tracking-widest">Global Fulfillment</span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    This product features <span className="text-primary font-black">Absolute Quality</span> and is available for delivery to all major cities across India through our certified delivery network.
                                </p>
                            </div>

                            {/* Interaction Footer */}
                            <div className="mt-auto pt-10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-8 flex-wrap">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Elite Premium Price</p>
                                    <div className="flex items-end gap-3">
                                        <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                                            ₹{product.price.toLocaleString()}
                                        </p>
                                        <p className="text-lg text-gray-400 line-through mb-1.5 italic">₹{(product.price * 1.25).toLocaleString()}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => onAddToCart(product)}
                                    disabled={!product.isService && product.countInStock <= 0}
                                    className="flex-1 min-w-[200px] h-20 bg-secondary text-dark-bg font-black text-sm uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-secondary/30 hover:bg-yellow-400 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale group/checkout border-none"
                                >
                                    <ShoppingBag size={24} className="group-hover/checkout:rotate-12 transition-transform" />
                                    {product.isService || product.countInStock > 0 ? "Add To Global Cart" : "Currently Out Of Stock"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;

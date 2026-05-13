import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ShoppingBag, Star, ShieldCheck, Heart, 
    ArrowRight, Sparkles, Zap, Leaf 
} from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';

const products = [
  {
    id: 1,
    name: "HemoHim",
    category: "Health Supplement",
    price: 7500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584017945366-b97b099b1fe7?q=80&w=800&auto=format&fit=crop",
    desc: "Korean functional food developed by the Korean Atomic Energy Research Institute (KAERI).",
    highlights: ["Immune System Support", "Energy Boost", "Patented Formula"]
  },
  {
    id: 2,
    name: "Atomy Absolute Skincare",
    category: "Beauty & Skincare",
    price: 12000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    desc: "Premium skincare line using advanced nanotechnology and fermentation science.",
    highlights: ["Anti-Aging", "CellActive Tech", "Intense Hydration"]
  },
  {
    id: 3,
    name: "Atomy Toothpaste",
    category: "Personal Care",
    price: 450,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559594864-188b417d293f?q=80&w=800&auto=format&fit=crop",
    desc: "Propolis extract toothpaste for effective plaque removal and dental health.",
    highlights: ["Propolis Infused", "Plaque Removal", "Fresh Breath"]
  },
  {
    id: 4,
    name: "Atomy Finezyme",
    category: "Health & Wellness",
    price: 1800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=800&auto=format&fit=crop",
    desc: "Vitamin-enriched enzyme formula to support digestion and metabolic health.",
    highlights: ["Digestive Support", "Vitamin B1", "Natural Ingredients"]
  }
];

const AtomyProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Health Supplement', 'Beauty & Skincare', 'Personal Care', 'Health & Wellness'];

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="bg-dark-bg min-h-screen pt-24 pb-32">
            <SEOMeta 
                title="Atomy Premium Products | Forge India Connect"
                description="Explore the absolute quality and absolute price of Atomy's Korean health and beauty products, available through FIC."
            />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center overflow-hidden mb-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
                
                <div className="container-xl px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8 border border-primary/20">
                            <Sparkles size={14} /> Atomy Global Partner
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                            Absolute <span className="text-primary italic">Quality</span> <br />
                            Absolute Price
                        </h1>
                        <p className="text-xl text-white/40 font-medium leading-relaxed">
                            Experience the best of Korean health and beauty innovation. Science-backed products for your daily wellness journey.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Product Filter */}
            <div className="container-xl px-6 mb-16">
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="container-xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, i) => (
                    <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="glass-card group flex flex-col h-full overflow-hidden"
                    >
                        <div className="relative aspect-square overflow-hidden bg-white/5">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute top-4 right-4 px-2 py-1 bg-dark-bg/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white flex items-center gap-1">
                                <Star size={10} className="text-primary fill-primary" /> {product.rating}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <div className="mb-4">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.category}</p>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                            </div>
                            
                            <p className="text-xs text-white/40 font-medium mb-8 line-clamp-2 leading-relaxed">
                                {product.desc}
                            </p>

                            <div className="space-y-2 mb-8 mt-auto">
                                {product.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                        <ShieldCheck size={12} className="text-primary" /> {h}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">M.R.P</span>
                                    <span className="text-2xl font-black text-white">₹{product.price.toLocaleString()}</span>
                                </div>
                                <button className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary/20">
                                    <ShoppingBag size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Atomy Vision Section */}
            <section className="container-xl px-6 mt-32">
                <div className="glass-card p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
                                Why Choose <span className="text-primary">Atomy</span>?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { icon: Leaf, title: "Natural Ingredients", desc: "Sourced from pristine environments and processed with advanced extraction technology." },
                                    { icon: Zap, title: "Nano-Tech Absorption", desc: "Products designed for deep cellular penetration and maximum effectiveness." },
                                    { icon: ShieldCheck, title: "Global Quality Standards", desc: "Tested and certified by international health and safety organizations." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.title}</h4>
                                            <p className="text-sm text-white/40 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10">
                                <img 
                                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop" 
                                    className="w-full h-full object-cover"
                                    alt="Atomy Excellence"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 glass-card p-8 bg-primary text-white shadow-2xl">
                                <p className="text-3xl font-black mb-1">10M+</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Global Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AtomyProducts;

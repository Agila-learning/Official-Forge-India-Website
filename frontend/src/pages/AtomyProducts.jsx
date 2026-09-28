import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Star, ShieldCheck, Leaf, Zap, Sparkles, Package, ArrowRight, ExternalLink
} from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const AtomyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?shopCode=FIC-ATOMY');
        const atomyProducts = (data.data || data || []).filter(
          (p) => p.shopCode === 'FIC-ATOMY' || p.category?.toLowerCase().includes('atomy')
        );
        setProducts(atomyProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const filtered = selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      shopCode: 'FIC-ATOMY',
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-dark-bg min-h-screen pt-24 pb-32">
      <SEOMeta
        title="Atomy Premium Products | Forge India Connect"
        description="Explore the absolute quality and absolute price of Atomy's Korean health and beauty products, available through FIC."
      />

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden mb-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
        <div className="container-xl px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8 border border-primary/20">
              <Sparkles size={14} /> Atomy Global Partner
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              Absolute <span className="text-primary">Quality</span> <br />Absolute Price
            </h1>
            <p className="text-xl text-white/40 font-medium leading-relaxed">
              Experience the best of Korean health and beauty innovation. Science-backed products for your daily wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter — only shown if products exist */}
      {products.length > 0 && (
        <div className="container-xl px-6 mb-12">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="container-xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[2rem] bg-white/5 border border-white/5 aspect-[3/4] animate-pulse" />
          ))}
        </div>
      )}

      {/* Product Grid */}
      {!loading && filtered.length > 0 && (
        <div className="container-xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass-card group flex flex-col h-full overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {product.rating && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-dark-bg/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white flex items-center gap-1">
                    <Star size={10} className="text-primary fill-primary" /> {product.rating}
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors mb-3">
                  {product.name}
                </h3>
                <p className="text-xs text-white/40 font-medium mb-6 line-clamp-2 leading-relaxed flex-grow">
                  {product.description}
                </p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-0.5">M.R.P</span>
                    <span className="text-xl font-black text-white">₹{Number(product.price).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-11 h-11 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary/20"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State — shown when no products yet */}
      {!loading && products.length === 0 && (
        <div className="container-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20">
              <Package size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Products Coming Soon
            </h2>
            <p className="text-white/40 font-medium max-w-md leading-relaxed mb-8">
              Our Atomy product catalog is being curated. World-class Korean wellness and beauty products will be available here shortly.
            </p>
            <a
              href="https://www.atomy.com/in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              Visit Atomy Official <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      )}

      {/* Why Atomy Section */}
      <section className="container-xl px-6 mt-24">
        <div className="glass-card p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
                Why Choose <span className="text-primary">Atomy</span>?
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Leaf, title: 'Natural Ingredients', desc: 'Sourced from pristine environments and processed with advanced extraction technology.' },
                  { icon: Zap, title: 'Nano-Tech Absorption', desc: 'Products designed for deep cellular penetration and maximum effectiveness.' },
                  { icon: ShieldCheck, title: 'Global Quality Standards', desc: 'Tested and certified by international health and safety organizations.' },
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
              <div className="absolute -bottom-8 -left-8 glass-card p-6 bg-primary text-white shadow-2xl rounded-2xl">
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

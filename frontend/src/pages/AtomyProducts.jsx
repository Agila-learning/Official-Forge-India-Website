import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, Zap, MapPin } from 'lucide-react';

import api from '../services/api';

const AtomyProducts = () => {
  const [locationStatus, setLocationStatus] = useState('idle');
  const [cityName, setCityName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();

    if (navigator.geolocation) {
      setLocationStatus('checking');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setCityName("detected location");
            setLocationStatus('success');
          }, 1500);
        },
        () => {
          setLocationStatus('denied');
        }
      );
    }
  }, []);

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Availability Banner */}
        <div className="mb-12">
            <AnimatePresence>
                {locationStatus === 'checking' && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-primary/5 rounded-2xl flex items-center justify-center gap-3 text-primary font-bold">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        Checking delivery availability for your area...
                    </motion.div>
                )}
                {locationStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 rounded-2xl flex items-center justify-center gap-3 text-green-600 font-bold border border-green-500/20">
                        <MapPin size={20} />
                        Delivery is available in your area ({cityName})! Enjoy Absolute Quality products.
                    </motion.div>
                )}
                {locationStatus === 'denied' && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/5 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-bold">
                        <MapPin size={20} />
                        Location access denied. Please enable location to check delivery availability.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-widest text-sm"
          >
            Explore Our Marketing Products
          </motion.span>
          <h1 className="text-5xl md:text-8xl font-black mt-4 mb-8 tracking-tighter">
            Atomy South Korean <span className="animated-text-gradient">Premium Range</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Experience the philosophy of Absolute Quality, Absolute Price with our exclusive selection of Atomy products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl hover:shadow-primary/10 transition-all group"
            >
              <div className="h-72 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm">
                  {product.category}
                </div>
                {product.vendorId?.deliveryAvailable === false ? (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg z-20">Local Pickup Only</div>
                ) : (
                    <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg z-20">Express Delivery</div>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black mb-2">{product.name}</h3>
                <p className="text-gray-500 mb-6 line-clamp-2">{product.desc}</p>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{product.price}</span>
                    <button className="bg-primary hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-lg shadow-primary/20">
                        <ShoppingBag size={24} />
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-black mb-4 italic">Want to become an Atomy Distributor?</h2>
                <p className="text-white/80 font-bold">Join our network and start your global business journey with Forge India Connect.</p>
            </div>
            <button className="px-10 py-5 bg-white text-primary rounded-full font-black text-lg hover:bg-gray-100 transition-colors shadow-2xl">
                Join Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default AtomyProducts;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import api from '../../services/api';
import LocationRequestModal from '../modals/LocationRequestModal';

const ServiceCoverage = () => {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/locations');
        // Filter only serviceable ones if needed
        setLocations(data.filter(loc => loc.isServiceable) || []);
      } catch (err) {
        console.error('Failed to fetch service areas');
      }
    };
    fetchLocations();
  }, []);

  // Standard locations if API fails or empty
  const displayLocations = locations.length > 0 ? locations : [
    { city: 'Chennai', pincode: '600001' },
    { city: 'Bangalore', pincode: '560001' },
    { city: 'Hyderabad', pincode: '500001' },
    { city: 'Mumbai', pincode: '400001' },
    { city: 'Pune', pincode: '411001' },
    { city: 'Krishnagiri', pincode: '635001' },
  ];

  return (
    <section id="coverage" className="py-24 bg-[#FAFBFD] dark:bg-[#050B15] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
                <div className="max-w-2xl text-left">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
                    >
                        <Globe size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Regional Presence</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight"
                    >
                        Service <span className="text-primary italic">Coverage</span> & Network
                    </motion.h2>
                    <p className="mt-6 text-lg text-gray-500 font-medium leading-relaxed">
                        We are rapidly expanding our footprint across India. Discover our active service hubs where we bridge excellence with opportunity.
                    </p>
                </div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="hidden lg:flex items-center gap-4 p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl"
                >
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900 dark:text-white leading-none">100%</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Operational Slit</p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayLocations.map((loc, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                            <MapPin size={28} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{loc.city}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Pincode: {loc.pincode}</p>
                        
                        <div className="mt-auto flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-full text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Live & Active
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-20 p-10 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-2">Can't find your location?</h3>
                    <p className="text-white/80 font-medium">We are constantly adding new zones. Send us a request!</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="relative z-10 px-10 py-5 bg-white text-primary font-black rounded-full hover:bg-secondary hover:text-dark-bg transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                    Request Integration
                </button>
            </motion.div>

            <LocationRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    </section>
  );
};

export default ServiceCoverage;

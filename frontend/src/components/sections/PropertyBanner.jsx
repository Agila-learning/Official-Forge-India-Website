import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ArrowRight, CheckCircle, Home } from 'lucide-react';

const PropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-dark-bg overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-[3rem] border border-blue-900/30 overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
            <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">Real Estate & Stays</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Premium <span className="text-blue-400">PGs & Rentals</span>
            </h2>
            <p className="text-sm text-slate-400 font-bold mb-8 max-w-md">
              Discover fully furnished PGs, co-living spaces, and premium rentals with zero brokerage. Enjoy high-speed WiFi, daily housekeeping, and 24/7 security.
            </p>
            
            <div className="space-y-3 mb-10">
              {['Zero Brokerage Fees', 'Verified Properties', 'Instant Online Booking'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span className="text-slate-300 font-black text-[11px] uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/pg-stays')}
              className="group px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 w-fit flex items-center gap-3"
            >
              Explore Properties
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 relative min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-transparent z-10 hidden md:block" />
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200" 
              alt="Premium PG"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyBanner;

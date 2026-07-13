import React from 'react';
import { motion } from 'framer-motion';

const HotelsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Luxury Hotels" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Find Your Perfect Stay
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-xl mb-8"
          >
            Premium hotels, resorts, and villas curated for your comfort.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-4xl bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4"
          >
            <input type="text" placeholder="Where are you going?" className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" className="px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" className="px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              Search
            </button>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Dummy cards */}
           {[1,2,3].map(i => (
             <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer">
               <img src={`https://images.unsplash.com/photo-1542314831-c6a4d14d837${i}?auto=format&fit=crop&w=600&q=80`} className="w-full h-48 object-cover" />
               <div className="p-4">
                 <h3 className="font-bold text-lg">Luxury Resort & Spa</h3>
                 <p className="text-gray-500 text-sm">Goa, India</p>
                 <div className="mt-4 flex justify-between items-center">
                   <span className="font-bold text-blue-600">₹4,500 / night</span>
                   <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100">Book Now</button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;

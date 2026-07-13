import React from 'react';
import { motion } from 'framer-motion';

const RentalsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Rentals" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Rent Everything You Need
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-emerald-100 max-w-xl mb-8"
          >
            From professional cameras to luxury cars. Rent it, use it, return it.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-3xl bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4"
          >
            <input type="text" placeholder="What are you looking to rent?" className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
              Search Catalog
            </button>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {['Electronics', 'Vehicles', 'Furniture', 'Party Supplies'].map((cat, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
               <h3 className="font-bold text-lg text-emerald-800">{cat}</h3>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default RentalsPage;

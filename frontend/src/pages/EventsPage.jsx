import React from 'react';
import { motion } from 'framer-motion';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Events" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-900/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Discover Incredible Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-purple-100 max-w-xl mb-8"
          >
            Concerts, workshops, conferences, and meetups happening near you.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-2xl bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4"
          >
            <input type="text" placeholder="Search events..." className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
              Find Events
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

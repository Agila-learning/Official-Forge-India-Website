import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-12"
        >
          <h1 className="text-[12rem] md:text-[18rem] font-black text-gray-100 dark:text-gray-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-48 h-48 md:w-64 md:h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white dark:bg-dark-card rounded-3xl shadow-2xl flex items-center justify-center mb-6 rotate-12 border border-gray-100 dark:border-gray-800">
                <Search size={48} className="text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                Path Not Found
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-8"
        >
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto">
            The resource you're searching for has been moved or doesn't exist in our current network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
            >
              <Home size={18} />
              Return Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="px-10 py-5 bg-gray-50 dark:bg-dark-card text-gray-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-3"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="mt-20 flex justify-center gap-12 opacity-20 grayscale">
            <img src="/logo.jpg" alt="" className="w-12 h-12 object-contain rounded-xl" />
            <div className="w-12 h-12 bg-primary rounded-xl" />
            <div className="w-12 h-12 bg-secondary rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;

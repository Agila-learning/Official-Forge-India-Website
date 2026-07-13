import React from 'react';
import { Car, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceModeToggle = ({ currentMode, onToggle }) => {
  return (
    <div className="bg-white dark:bg-[#0A0B0F] p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm inline-flex items-center relative">
      <motion.div
        layout
        className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
        initial={false}
        animate={{
          left: currentMode === 'Rides' ? '0.375rem' : '50%',
          width: 'calc(50% - 0.375rem)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => onToggle('Rides')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-colors ${currentMode === 'Rides' ? 'text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
      >
        <Car size={16} /> Rides
      </button>
      <button
        onClick={() => onToggle('Deliveries')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-colors ${currentMode === 'Deliveries' ? 'text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
      >
        <Package size={16} /> Deliveries
      </button>
    </div>
  );
};

export default ServiceModeToggle;

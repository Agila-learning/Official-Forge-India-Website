import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, IndianRupee } from 'lucide-react';

const EarningsCounter = ({ value, label = "Today's Earnings", loading = false }) => {
  const [sparkle, setSparkle] = useState(false);
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    if (value > prevValue && prevValue !== 0) {
      setSparkle(true);
      setTimeout(() => setSparkle(false), 2000);
    }
    setPrevValue(value);
  }, [value, prevValue]);

  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-[#0F1115] rounded-3xl p-6 border border-gray-800 shadow-2xl shadow-blue-900/20"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background Decor */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Sparkle effect when value increases */}
      {sparkle && !loading && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-gray-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <Wallet size={14} className="text-blue-500" />
            {label}
          </h3>
          {loading ? (
            <div className="mt-2 h-10 w-32 bg-gray-700/50 animate-pulse rounded-lg" />
          ) : (
            <div className="mt-2 text-4xl font-black tracking-tighter text-white flex items-center">
              <IndianRupee size={28} className="text-green-400 mr-1" />
              <CountUp 
                start={prevValue} 
                end={value} 
                duration={2.5} 
                separator="," 
                useEasing={true}
              />
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <TrendingUp size={20} className="text-blue-400" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-500 relative z-10">
        <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded flex items-center gap-1">
          +14.5%
        </span>
        vs yesterday
      </div>
    </motion.div>
  );
};

export default EarningsCounter;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Truck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickBookingNav = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const navItems = [
    { label: 'Products', icon: ShoppingBag, path: '/explore-shop', glow: 'shadow-blue-500/50', border: 'hover:border-blue-500', iconColor: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
    { label: 'Services', icon: Zap, path: '/services', glow: 'shadow-orange-500/50', border: 'hover:border-orange-500', iconColor: 'text-orange-400', bg: 'hover:bg-orange-500/10' },
    { label: 'Rides', icon: Truck, path: '/rides/book', glow: 'shadow-purple-500/50', border: 'hover:border-purple-500', iconColor: 'text-purple-400', bg: 'hover:bg-purple-500/10' },
    { label: 'Rentals', icon: Building2, path: '/pg-stays', glow: 'shadow-emerald-500/50', border: 'hover:border-emerald-500', iconColor: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-20 mb-16">
      {/* Premium Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-dark-card/60 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Dynamic Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
          <div className="absolute -top-[50%] -left-[10%] w-[40%] h-[150%] bg-blue-500/5 rotate-12 blur-3xl rounded-full" />
          <div className="absolute -bottom-[50%] -right-[10%] w-[40%] h-[150%] bg-purple-500/5 -rotate-12 blur-3xl rounded-full" />
        </div>


        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4 relative z-10">
          
          {/* Header Section */}
          <div className="text-center lg:text-left shrink-0">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase mb-1 drop-shadow-md"
            >
              Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Access</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]"
            >
              Connect Marketplace
            </motion.p>
          </div>
          
          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate(item.path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                className={`relative group overflow-hidden rounded-2xl flex flex-col items-center justify-center py-6 px-4 border transition-all duration-300 ${hoveredIndex === i ? item.border : 'border-white/5'} ${hoveredIndex === i ? item.bg : 'bg-[#23293b]/80'}`}
              >
                {/* Button Glow Effect on Hover */}
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none`}
                    />
                  )}
                </AnimatePresence>

                <motion.div 
                  animate={{ 
                    y: hoveredIndex === i ? -2 : 0,
                    scale: hoveredIndex === i ? 1.1 : 1
                  }}
                  className={`mb-3 transition-colors duration-300 ${hoveredIndex === i ? item.iconColor : 'text-gray-300'}`}
                >
                  <item.icon size={28} strokeWidth={hoveredIndex === i ? 2.5 : 2} />
                </motion.div>
                
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${hoveredIndex === i ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>

                {/* Bottom Highlight Line */}
                <div className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 transform origin-left ${hoveredIndex === i ? 'scale-x-100 bg-current' : 'scale-x-0'} ${item.iconColor}`} />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickBookingNav;

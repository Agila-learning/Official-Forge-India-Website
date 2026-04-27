import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppWidget = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowPopup(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hey! I'm interested in starting my journey with Forge India Connect.");
    window.open(`https://wa.me/916369406416?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-10 right-10 md:bottom-12 md:right-12 z-[999] flex flex-col items-end gap-4 text-right">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-[250px] relative"
          >
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
            >
              <X size={14} />
            </button>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
               Hey! You still waiting for step in and start your journey?
            </p>
            <div className="mt-3 flex gap-2">
                <button 
                    onClick={handleWhatsAppClick}
                    className="text-xs font-bold text-white bg-[#25D366] px-3 py-1.5 rounded-lg hover:bg-[#128C7E] transition-colors"
                >
                    Chat Now
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 transition-shadow focus:outline-none"
      >
        <MessageCircle size={32} />
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, HelpCircle, MessageSquare } from 'lucide-react';

const ServicePopup = ({ serviceName, phoneNumber = "6369406416" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-8 right-8 z-[1000] w-full max-w-sm"
      >
        <div className="bg-white dark:bg-dark-bg p-8 rounded-[2.5rem] shadow-3xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
            {/* Thinking Background Accent */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            
            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 relative">
                    <HelpCircle size={40} className="text-primary animate-bounce" />
                    <div className="absolute -top-2 -right-2 bg-secondary text-dark-bg text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Thinking?</div>
                </div>

                <h3 className="text-xl font-black mb-3 leading-tight">
                    Looking to build an <span className="text-primary">outstanding</span> {serviceName}?
                </h3>
                <p className="text-gray-500 font-medium mb-8">
                    Our elite engineering team is ready to transform your vision into reality.
                </p>

                <div className="w-full space-y-3">
                    <a 
                        href={`tel:${phoneNumber}`}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <PhoneCall size={20} />
                        Call Our Team: {phoneNumber}
                    </a>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="w-full py-4 text-gray-400 font-bold hover:text-primary transition-colors text-sm"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServicePopup;

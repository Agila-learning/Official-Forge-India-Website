import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user is Admin or Vendor - skip consent
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.role === 'Admin' || userInfo.role === 'Vendor') {
            setIsVisible(false);
            return;
        }

        // Check local storage for existing consent
        const hasConsented = localStorage.getItem('fic_cookie_consent');
        
        if (!hasConsented) {
            // Wait 60 seconds (60000ms) before prompting
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 60000);
            
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('fic_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('fic_cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-[400px] bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[9999]"
                >
                    <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 hover:rotate-12">
                            <Cookie size={28} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-black text-gray-900 dark:text-white text-xl">We Value Privacy</h3>
                                <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                                We use cookies and advanced tracking technologies to enhance your browsing experience, analyze site traffic, and personalize the FIC platform content.
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleAccept}
                                    className="flex-1 bg-primary text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-xl shadow-primary/20"
                                >
                                    Accept All
                                </button>
                                <button 
                                    onClick={handleDecline}
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                                >
                                    Necessary
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;

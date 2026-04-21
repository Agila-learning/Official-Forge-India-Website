import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasBeenWelcomed = localStorage.getItem('fic_welcomed');
        if (!hasBeenWelcomed) {
            // Show after 1.5 seconds
            const showTimer = setTimeout(() => setIsOpen(true), 1500);
            
            // Auto-close after 6.5 seconds (1.5 delay + 5 visible)
            const closeTimer = setTimeout(() => {
                handleClose();
            }, 6500);

            return () => {
                clearTimeout(showTimer);
                clearTimeout(closeTimer);
            };
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Delay storage to allow animation to finish if needed, but set it immediately for state
        localStorage.setItem('fic_welcomed', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-dark-bg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full filter blur-[40px] mix-blend-multiply opacity-50 pointer-events-none"></div>
                            
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <img src="/logo.jpg" alt="FIC Logo" className="w-20 h-20 mx-auto rounded-2xl shadow-xl mb-6 relative z-10" />

                            <h2 className="text-3xl font-black mb-2 text-gray-900 dark:text-white relative z-10">Welcome to<br/><span className="text-primary">Forge India Connect</span></h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto text-sm relative z-10">
                                The ultimate bridge connecting human potential to enterprise excellence.
                            </p>

                            <ul className="space-y-4 text-left mb-8 max-w-sm mx-auto relative z-10">
                                <li className="flex items-start gap-4">
                                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">Candidates: Apply for jobs & track status</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">Employers: Post jobs & hire top talent</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">Customers: Seamlessly book B2B services</span>
                                </li>
                            </ul>

                            <button 
                                onClick={handleClose}
                                className="w-full py-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg relative z-10 text-lg"
                            >
                                Explore Platform
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeModal;

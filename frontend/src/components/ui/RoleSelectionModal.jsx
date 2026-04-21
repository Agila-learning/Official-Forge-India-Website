import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, ShoppingBag, Store, X } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Candidate",
            desc: "Find a Job & Build Career",
            icon: Briefcase,
            role: "Candidate",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "HR / Employer",
            desc: "Post a Job & Hire Talent",
            icon: Building,
            role: "HR",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            title: "Customer",
            desc: "Shop & Book Services",
            icon: ShoppingBag,
            role: "Customer",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        },
        {
            title: "Vendor / Provider",
            desc: "Sell Products & Partner",
            icon: Store,
            role: "Vendor",
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        }
    ];

    const handleSelect = (roleValue) => {
        onClose();
        navigate('/register', { state: { presetRole: roleValue } });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-3xl bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Choose Your Purpose</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select how you want to interact with Forge India Connect</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {roles.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelect(item.role)}
                                    className={`flex flex-col items-start p-6 rounded-2xl border ${item.border} ${item.bg} hover:bg-opacity-20 transition-all text-left`}
                                >
                                    <div className={`p-4 rounded-xl bg-white dark:bg-dark-bg shadow-sm ${item.color} mb-4`}>
                                        <item.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{item.desc}</p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoleSelectionModal;

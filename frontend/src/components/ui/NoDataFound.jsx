import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

const NoDataFound = ({ 
    title = "No Data Found", 
    description = "We couldn't find any records for this specific query.", 
    icon: Icon = Search,
    onAction,
    actionLabel = "Add New"
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50 dark:bg-dark-bg/30 rounded-[3.5rem] border-4 border-dashed border-gray-100 dark:border-gray-800/50"
        >
            <div className="w-24 h-24 bg-white dark:bg-dark-card rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 shadow-xl mb-8 group-hover:scale-110 transition-transform">
                <Icon size={48} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3 italic">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold max-w-md mx-auto mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                {description}
            </p>
            
            {onAction && (
                <button 
                    onClick={onAction}
                    className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default NoDataFound;

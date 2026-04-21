import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="group relative w-16 h-8 md:w-20 md:h-10 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#020617] p-1 transition-all duration-700 hover:border-primary/50 shadow-sm overflow-hidden"
        >
            {/* Liquid Background Effect */}
            <motion.div
                animate={{
                    x: isDark ? '50%' : '-10%',
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`absolute inset-0 w-[120%] h-full opacity-10 blur-xl pointer-events-none bg-gradient-to-r ${isDark ? 'from-primary to-blue-500' : 'from-yellow-400 to-orange-400'}`}
            />

            <div className="relative flex items-center justify-between h-full px-2 z-10">
                <Sun size={14} className={`transition-all duration-700 ${!isDark ? 'text-yellow-500 scale-110 opacity-100' : 'text-zinc-500 scale-75 opacity-20'}`} />
                <Moon size={14} className={`transition-all duration-700 ${isDark ? 'text-primary scale-110 opacity-100' : 'text-zinc-500 scale-75 opacity-20'}`} />
            </div>

            {/* The Floating Orb */}
            <motion.div
                animate={{
                    x: isDark ? (window.innerWidth < 768 ? 32 : 40) : 0,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    x: { type: "spring", stiffness: 400, damping: 30 },
                    scale: { duration: 0.3 }
                }}
                className={`absolute top-1 left-1 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${isDark ? 'bg-primary shadow-primary/40' : 'bg-yellow-400 shadow-yellow-400/40'}`}
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse" />
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div key="dark" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <Orbit size={16} className="text-white animate-spin-slow" />
                        </motion.div>
                    ) : (
                        <motion.div key="light" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <Sparkles size={16} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    );
};

export default ThemeToggle;

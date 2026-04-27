import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Truck, ShoppingBag, Zap, Globe, Cpu } from 'lucide-react';

const icons = [
  { icon: Briefcase, color: 'text-blue-500', text: 'Bridging Talent to Opportunity' },
  { icon: Truck, color: 'text-orange-500', text: 'Streamlining Logistics & Delivery' },
  { icon: ShoppingBag, color: 'text-purple-500', text: 'Empowering B2B Marketplace' },
  { icon: Zap, color: 'text-yellow-500', text: 'Accelerating Industrial Growth' },
  { icon: Globe, color: 'text-green-500', text: 'Connecting India to the World' },
  { icon: Cpu, color: 'text-cyan-500', text: 'Engineering Digital Innovation' },
];

const LoadingScreen = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 600);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000); // 4s cinematic duration

    return () => {
      clearInterval(iconInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Generate random dots for the "network" background
  const dots = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
  }));

  const CurrentIcon = icons[index].icon;

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Network Background - Glowing Nodes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              x: [`${dot.x}%`, `${(dot.x + 5) % 100}%`, `${dot.x}%`],
              y: [`${dot.y}%`, `${(dot.y + 5) % 100}%`, `${dot.y}%`]
            }}
            transition={{ duration: dot.duration, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full bg-primary blur-[1px]"
            style={{ width: dot.size, height: dot.size, left: `${dot.x}%`, top: `${dot.y}%`, boxShadow: '0 0 10px #0A66C2' }}
          />
        ))}
      </div>

      {/* Main Orchestrator */}
      <motion.div className="relative z-10 flex flex-col items-center">
        
        {/* Animated Central Node */}
        <div className="relative w-40 h-40 mb-12">
            {/* Outer Rotating Halo */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
            />
            {/* Pulsing Rings */}
            <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-4 border border-primary/30 rounded-full"
            />
            
            {/* Central Elephant Logo with Yellow Glow */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                    animate={{ 
                        scale: [1, 1.15, 1], 
                        boxShadow: ["0 0 20px rgba(255,193,7,0.2)", "0 0 60px rgba(255,193,7,0.7)", "0 0 20px rgba(255,193,7,0.2)"] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-2 border-2 border-[#FFC107] relative z-10"
                >
                    <img src="/logo.jpg" alt="Elephant Logo" className="w-full h-full object-contain rounded-xl" />
                </motion.div>
            </div>

            {/* Orbiting / Morphing Icons Badge */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ scale: 0.5, opacity: 0, x: 45, y: -45, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, x: 45, y: -45, rotate: 0 }}
                        exit={{ scale: 1.2, opacity: 0, x: 45, y: -45, rotate: 45 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className={`w-12 h-12 rounded-xl bg-[#020617]/90 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] absolute ${icons[index].color}`}
                    >
                        <CurrentIcon size={24} strokeWidth={2.5} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* Branding */}
        <div className="text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-black tracking-tighter mb-2">
                <span className="text-[#0A66C2]">FORGE</span> <span className="text-[#FFC107]">INDIA</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400 pl-3">
                CONNECT
            </p>
          </motion.div>

          {/* Cycling Status Text */}
          <div className="h-6 mt-8 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-gray-500 font-bold text-xs uppercase tracking-widest px-4"
                >
                    {icons[index].text}
                </motion.p>
            </AnimatePresence>
          </div>

          {/* Cinematic Progress Bar */}
          <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mx-auto mt-6">
            <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ width: '200%' }}
            />
          </div>
        </div>

      </motion.div>

      {/* Decorative Gradients */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]" />
    </motion.div>
  );
};

export default LoadingScreen;

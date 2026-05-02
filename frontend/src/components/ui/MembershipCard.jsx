import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Star, QrCode } from 'lucide-react';

const MembershipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e) => {
    if (isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative group perspective-2000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={{
          rotateY: isFlipped ? 180 : rotateY,
          rotateX: isFlipped ? 0 : rotateX,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-md aspect-[1.586/1] rounded-[2.5rem] shadow-2xl transition-all duration-300 group-hover:shadow-blue-600/20"
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] p-8 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/20">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(37,99,235,0.15),transparent_70%)]" />
            
            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-white font-black text-2xl tracking-tighter uppercase italic">Forge India <span className="text-blue-500">Connect</span></h3>
                        <p className="text-blue-500/60 text-[10px] font-bold uppercase tracking-[0.4em]">Premium Membership</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <ShieldCheck className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                        <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 2, delay: 0.5 }}
                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Digital Vault Access</p>
                            <p className="text-white font-mono text-xl tracking-[0.2em]">•••• •••• •••• 8888</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">VALID THRU</p>
                            <p className="text-white font-mono text-sm">12/26</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* BACK SIDE */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] p-8 bg-slate-900 border border-white/20 overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
        >
            <div className="h-4 bg-gradient-to-r from-blue-600 to-indigo-600 -mx-8 -mt-2 mb-8" />
            <div className="flex justify-between items-start mb-8">
                <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-2xl">
                    <QrCode size="100%" className="text-black" />
                </div>
                <div className="text-right space-y-4">
                    <div>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Membership ID</p>
                        <p className="text-xs font-black text-white">FIC-PRM-2026-X99</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Authorized Member</p>
                        <p className="text-xs font-black text-white">JOHN DOE</p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/40">
                    <Globe size={14} />
                    <p className="text-[9px] font-black uppercase tracking-widest">www.forgeindiaconnect.com</p>
                </div>
                <p className="text-[8px] text-white/20 font-medium uppercase leading-relaxed text-left">
                    This digital asset is non-transferable and subject to Forge India Connect terms. Unauthorized replication is strictly prohibited under FIC protocol.
                </p>
            </div>
        </div>
      </motion.div>

      {/* Shadow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/40 blur-2xl rounded-[100%]" />
      
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl">
            Tap to Flip
         </span>
      </div>
    </div>
  );
};

export default MembershipCard;

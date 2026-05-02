import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Star } from 'lucide-react';

const MembershipCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e) => {
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
    <div className="relative group perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-md aspect-[1.586/1] rounded-[2.5rem] p-8 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-gold-500/20"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.15),transparent_70%)]" />
        
        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-white font-black text-2xl tracking-tighter uppercase italic">Forge India <span className="text-gold-500">Connect</span></h3>
              <p className="text-gold-500/60 text-[10px] font-bold uppercase tracking-[0.4em]">Premium Membership</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="text-gold-500" size={24} />
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-md shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
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
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)]" />
      </motion.div>

      {/* Shadow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/40 blur-2xl rounded-[100%]" />
    </div>
  );
};

export default MembershipCard;

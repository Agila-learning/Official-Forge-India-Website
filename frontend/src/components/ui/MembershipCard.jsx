import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Globe, QrCode, CreditCard, 
  Bed, Bus, Utensils, ShoppingBag, Tv, 
  Wifi, Zap, Phone, Mail, ChevronRight
} from 'lucide-react';

const MembershipCard = ({ userData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Fallback data if userData is missing
  const user = userData || {
    firstName: 'SHANU',
    lastName: 'S',
    membershipId: 'FIC-PLT-001',
    validThru: '12/28'
  };

  const services = [
    { icon: <Bed size={16} />, label: 'STAY' },
    { icon: <Bus size={16} />, label: 'TRAVEL' },
    { icon: <Utensils size={16} />, label: 'FOOD' },
    { icon: <ShoppingBag size={16} />, label: 'SHOP' },
    { icon: <Tv size={16} />, label: 'ENTERTAIN' },
  ];

  return (
    <div className="w-full max-w-[500px] mx-auto perspective-1000">
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full aspect-[1.586/1] preserve-3d cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE (Luxury Black & Gold) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl backface-hidden border border-[#d4af37]/30"
          style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'
          }}
        >
          {/* Decorative Gold Accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-[60px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-[50px] -ml-16 -mb-16" />
          
          {/* Gold Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/2 h-full border-r border-[#d4af37]/20 rotate-12 -translate-x-10" />
            <div className="absolute top-0 right-0 w-1/2 h-full border-l border-[#d4af37]/20 -rotate-12 translate-x-10" />
          </div>

          <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <img src="/logo.jpg" alt="FIC" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[#d4af37] font-black text-lg md:text-xl tracking-tighter leading-none">FORGE INDIA</h2>
                  <span className="text-white/40 text-[8px] tracking-[0.4em] font-bold mt-1">CONNECT</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#d4af37]/60 text-[8px] md:text-[10px] font-black tracking-widest uppercase italic">Premium Member</span>
              </div>
            </div>

            {/* Service Icons Row */}
            <div className="flex justify-between items-center px-2 md:px-4">
              {services.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-full flex items-center justify-center text-[#d4af37] border border-[#d4af37]/10 shadow-lg">
                    {s.icon}
                  </div>
                  <span className="text-[6px] md:text-[8px] font-black text-white/40 tracking-widest uppercase">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tagline & Signal Icon */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <p className="text-[#d4af37] text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase italic">One Connect. Unlimited Possibilities.</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-10 h-7 bg-gradient-to-br from-[#d4af37] to-[#8a6d1a] rounded-md shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <p className="text-white font-mono text-base md:text-lg tracking-[0.2em]">•••• {user.membershipId?.slice(-4) || '0001'}</p>
                </div>
              </div>
              <div className="text-[#d4af37]">
                <Wifi className="rotate-90 opacity-40" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Luxury Details) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl backface-hidden border border-[#d4af37]/30 rotate-y-180"
          style={{ 
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)'
          }}
        >
          {/* Gold Stripe */}
          <div className="h-12 bg-gradient-to-r from-[#8a6d1a] via-[#d4af37] to-[#8a6d1a] mt-8 flex items-center px-8 shadow-inner">
             <span className="text-[10px] font-black text-black/80 tracking-[0.3em] uppercase">FORGE INDIA CONNECT</span>
             <span className="ml-auto text-[10px] font-black text-black/80 tracking-[0.3em] uppercase">MEMBER CARD</span>
          </div>

          <div className="p-8 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start pt-8">
              <div className="space-y-4 max-w-[60%] text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#d4af37]/30 rounded-xl flex items-center justify-center text-[#d4af37]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest">Your Digital Vault of Privileges</h4>
                    <p className="text-white/40 text-[8px] leading-relaxed mt-1">Prepaid. Secure. Seamless. Access a world of premium services across Stay, Travel, Food, Shopping & Entertainment.</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 text-left">
                  <div className="flex items-center gap-2 text-[8px] text-white/30 font-bold uppercase tracking-widest">
                    <Globe size={10} className="text-[#d4af37]" /> www.forgeindiaconnect.com
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-white/30 font-bold uppercase tracking-widest">
                    <Phone size={10} className="text-[#d4af37]" /> +91 63694 06416
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-white/30 font-bold uppercase tracking-widest">
                    <Mail size={10} className="text-[#d4af37]" /> support@forgeindiaconnect.com
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   <QrCode size={80} className="text-black" />
                </div>
                <div className="text-center">
                   <p className="text-[7px] font-black text-[#d4af37] uppercase tracking-[0.2em]">Scan to Access</p>
                   <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Your Account</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
               <p className="text-[7px] text-white/20 font-medium uppercase tracking-widest">{user.membershipId || 'FIC-PLT-001'}</p>
               <p className="text-[7px] text-white/20 font-medium uppercase tracking-widest">© 2026 FORGE INDIA CONNECT PVT. LTD.</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Interaction Hint */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#d4af37] hover:text-white transition-all group flex items-center gap-2"
        >
          {isFlipped ? 'View Front' : 'Flip for Scanner'} <ChevronRight size={14} className={`transition-transform ${isFlipped ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;

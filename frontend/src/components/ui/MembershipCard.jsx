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
    <div className="w-full max-w-[500px] mx-auto perspective-1000 px-2 sm:px-0">
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full aspect-[1.586/1] preserve-3d cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE (Luxury Black & Gold) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl backface-hidden border border-[#d4af37]/30"
          style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'
          }}
        >
          {/* Decorative Gold Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-[#d4af37]/5 rounded-full blur-[60px] -mr-16 -mt-16 md:-mr-20 md:-mt-20" />
          <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-[#d4af37]/5 rounded-full blur-[50px] -ml-12 -mb-12 md:-ml-16 md:-mb-16" />
          
          {/* Gold Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/2 h-full border-r border-[#d4af37]/20 rotate-12 -translate-x-10" />
            <div className="absolute top-0 right-0 w-1/2 h-full border-l border-[#d4af37]/20 -rotate-12 translate-x-10" />
          </div>

          <div className="relative z-10 h-full p-4 md:p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center p-1 md:p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <img src="/logo.jpg" alt="FIC" className="w-full h-full object-contain rounded-md" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[#d4af37] font-black text-sm md:text-xl tracking-tighter leading-none">FORGE INDIA</h2>
                  <span className="text-white/40 text-[6px] md:text-[8px] tracking-[0.4em] font-bold mt-0.5 md:mt-1 uppercase">CONNECT</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#d4af37]/60 text-[7px] md:text-[10px] font-black tracking-widest uppercase italic whitespace-nowrap">Premium Member</span>
              </div>
            </div>

            {/* Service Icons Row */}
            <div className="flex justify-between items-center px-1 md:px-4">
              {services.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1 md:gap-2">
                  <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-full flex items-center justify-center text-[#d4af37] border border-[#d4af37]/10 shadow-lg scale-90 md:scale-100">
                    {React.cloneElement(s.icon, { size: window.innerWidth < 768 ? 12 : 16 })}
                  </div>
                  <span className="text-[5px] md:text-[8px] font-black text-white/40 tracking-widest uppercase">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tagline & Signal Icon */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col min-w-0">
                <p className="text-[#d4af37] text-[7px] md:text-[11px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase italic truncate">One Connect. Unlimited Possibilities.</p>
                <div className="mt-2 md:mt-4 flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-5 md:w-10 md:h-7 bg-gradient-to-br from-[#d4af37] to-[#8a6d1a] rounded-sm md:rounded-md shadow-inner relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <p className="text-white font-mono text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] truncate">•••• {user.membershipId?.slice(-4) || '0001'}</p>
                </div>
              </div>
              <div className="text-[#d4af37] shrink-0">
                <Wifi className="rotate-90 opacity-40" size={window.innerWidth < 768 ? 16 : 24} />
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Luxury Details) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl backface-hidden border border-[#d4af37]/30 rotate-y-180"
          style={{ 
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)'
          }}
        >
          {/* Gold Stripe */}
          <div className="h-8 md:h-12 bg-gradient-to-r from-[#8a6d1a] via-[#d4af37] to-[#8a6d1a] mt-6 md:mt-8 flex items-center px-4 md:px-8 shadow-inner">
             <span className="text-[7px] md:text-[10px] font-black text-black/80 tracking-[0.2em] md:tracking-[0.3em] uppercase">FORGE INDIA CONNECT</span>
             <span className="ml-auto text-[7px] md:text-[10px] font-black text-black/80 tracking-[0.2em] md:tracking-[0.3em] uppercase">MEMBER CARD</span>
          </div>

          <div className="p-4 md:p-8 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start pt-4 md:pt-8">
              <div className="space-y-3 md:space-y-4 max-w-[65%] text-left">
                <div className="flex items-start gap-2 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 border border-[#d4af37]/30 rounded-lg md:rounded-xl flex items-center justify-center text-[#d4af37] shrink-0">
                    <ShieldCheck size={window.innerWidth < 768 ? 16 : 24} />
                  </div>
                  <div>
                    <h4 className="text-[#d4af37] text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-tight">Your Digital Vault of Privileges</h4>
                    <p className="text-white/40 text-[6px] md:text-[8px] leading-relaxed mt-1 line-clamp-2 md:line-clamp-none">Prepaid. Secure. Seamless. Access premium services across Stay, Travel, Food, Shopping & Entertainment.</p>
                  </div>
                </div>
                
                <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-4 text-left">
                  <div className="flex items-center gap-2 text-[6px] md:text-[8px] text-white/30 font-bold uppercase tracking-widest">
                    <Globe size={window.innerWidth < 768 ? 8 : 10} className="text-[#d4af37]" /> www.forgeindiaconnect.com
                  </div>
                  <div className="flex items-center gap-2 text-[6px] md:text-[8px] text-white/30 font-bold uppercase tracking-widest">
                    <Phone size={window.innerWidth < 768 ? 8 : 10} className="text-[#d4af37]" /> +91 63694 06416
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
                <div className="bg-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   <QrCode size={window.innerWidth < 768 ? 50 : 80} className="text-black" />
                </div>
                <div className="text-center">
                   <p className="text-[6px] md:text-[7px] font-black text-[#d4af37] uppercase tracking-[0.2em]">Scan to Access</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-2 md:pt-4 pb-4 md:pb-0">
               <p className="text-[6px] md:text-[7px] text-white/20 font-medium uppercase tracking-widest">{user.membershipId || 'FIC-PLT-001'}</p>
               <p className="text-[6px] md:text-[7px] text-white/20 font-medium uppercase tracking-widest">© 2026 FORGE INDIA CONNECT</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Interaction Hint */}
      <div className="mt-6 md:mt-8 flex justify-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
          className="px-6 md:px-8 py-2.5 md:py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-xl hover:bg-[#d4af37] hover:text-white transition-all group flex items-center gap-2 active:scale-95"
        >
          {isFlipped ? 'View Front' : 'Flip for Scanner'} <ChevronRight size={14} className={`transition-transform ${isFlipped ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;

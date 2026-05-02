import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Star, ShieldCheck, 
  Zap, Clock, Heart, ArrowRight, Home, 
  Hotel, Bus, Utensils, ShoppingBag, Ticket,
  CheckCircle2, ChevronRight, Filter, Plus
} from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import MembershipCard from '../components/ui/MembershipCard';
import toast from 'react-hot-toast';

const categories = [
  { id: 'stay', label: 'PG / Stay', icon: Home, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'travel', label: 'Travel', icon: Bus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'entertainment', label: 'Entertainment', icon: Ticket, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const listings = [
  {
    id: 1,
    category: 'stay',
    title: 'Premium Coliving PG - HSR Layout',
    rating: 4.8,
    reviews: 124,
    price: 12000,
    unit: 'month',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600',
    tags: ['WiFi', 'Food Incl.', 'AC'],
    isPremium: true
  },
  {
    id: 2,
    category: 'travel',
    title: 'Inter-City Luxury Sleeper Coach',
    rating: 4.9,
    reviews: 850,
    price: 1500,
    unit: 'trip',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
    tags: ['Live Tracking', 'Water Incl.'],
    isPremium: true
  },
  {
    id: 3,
    category: 'food',
    title: 'Gourmet Meal Plan - North Indian',
    rating: 4.7,
    reviews: 320,
    price: 4500,
    unit: 'month',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    tags: ['Freshly Cooked', 'Daily Delivery'],
    isPremium: true
  },
  {
    id: 4,
    category: 'hotels',
    title: 'The Grand Residency - Business Suite',
    rating: 4.9,
    reviews: 56,
    price: 3500,
    unit: 'night',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    tags: ['5-Star', 'Breakfast Incl.'],
    isPremium: true
  }
];

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const filteredListings = listings.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory) &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingPanel(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <SEOMeta 
        title="Premium Service Marketplace | Forge India Connect"
        description="Explore premium services including stay, travel, food, and entertainment. Unlock unlimited access with our Forge Membership Card."
      />

      {/* --- 🔍 1. HERO + SMART SEARCH --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 tracking-tighter italic"
            >
                EXPERIENCE <span className="gold-text-gradient">UNLIMITED</span>
            </motion.h1>
            
            <div className="max-w-4xl mx-auto">
                <div className="glass-premium p-2 rounded-[2rem] flex flex-col md:flex-row gap-2 shadow-2xl">
                    <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                        <Search className="text-white/40" size={20} />
                        <input 
                            type="text" 
                            placeholder="What service do you need today?"
                            className="bg-transparent w-full outline-none font-medium placeholder:text-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                        <MapPin className="text-white/40" size={20} />
                        <select className="bg-transparent outline-none font-bold text-sm !bg-none !pr-0">
                            <option>Krishnagiri</option>
                            <option>Chennai</option>
                            <option>Bangalore</option>
                        </select>
                    </div>
                    <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                        SEARCH
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* --- ⚡ 2. QUICK CATEGORY BAR --- */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            <button 
                onClick={() => setActiveCategory('all')}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
            >
                All Services
            </button>
            {categories.map((cat) => (
                <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all whitespace-nowrap flex items-center gap-3 ${activeCategory === cat.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                >
                    <cat.icon size={18} className={activeCategory === cat.id ? 'text-black' : cat.color} />
                    {cat.label}
                </button>
            ))}
        </div>
      </section>

      {/* --- 💳 3. MEMBERSHIP CARD BANNER --- */}
      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
            <div className="glass-premium rounded-[3rem] p-10 md:p-20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-500/10 to-transparent pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-gold-500/20">
                            <Zap size={14} /> Core Marketplace USP
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
                            ONE MEMBERSHIP.<br/>
                            <span className="gold-text-gradient">UNLIMITED SERVICES.</span>
                        </h2>
                        <p className="text-white/60 font-medium text-lg leading-relaxed max-w-lg">
                            Stop paying per booking. Preload your digital vault and unlock premium access to our entire ecosystem of stays, travel, and lifestyle services.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-black rounded-2xl shadow-2xl shadow-gold-500/20 hover:scale-105 transition-all uppercase text-xs tracking-widest">
                                Activate Membership
                            </button>
                            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest">
                                View Benefits
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <MembershipCard />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 📦 5. SERVICE LISTING SECTION --- */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Premium <span className="text-blue-500">Listings</span></h3>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Available for immediate booking</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredListings.map((item, idx) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-white/30 transition-all flex flex-col"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {item.isPremium && (
                                    <span className="px-3 py-1.5 bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                        Membership Incl.
                                    </span>
                                )}
                            </div>
                            <button className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl text-white hover:text-rose-500 transition-all">
                                <Heart size={18} />
                            </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="text-gold-500 fill-gold-500" size={14} />
                                <span className="text-xs font-black">{item.rating}</span>
                                <span className="text-white/30 text-[10px] font-bold">({item.reviews} Reviews)</span>
                            </div>
                            <h4 className="text-xl font-black leading-tight mb-4 uppercase italic tracking-tighter truncate">{item.title}</h4>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Pricing From</p>
                                    <p className="text-xl font-black tracking-tight">₹{item.price}<span className="text-xs text-white/30 font-bold tracking-normal">/{item.unit}</span></p>
                                </div>
                                <button 
                                    onClick={() => handleBookNow(item)}
                                    className="p-4 bg-white/10 rounded-2xl hover:bg-white text-white hover:text-black transition-all"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- 💎 6. MEMBERSHIP UPSELL BLOCK (INLINE) --- */}
            <div className="mt-20 glass-premium rounded-[3.5rem] p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_150%,rgba(212,175,55,0.1),transparent_50%)]" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                    <div className="w-20 h-20 bg-gold-500/10 text-gold-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-gold-500/20">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Stop Paying Per Booking.<br/><span className="text-gold-500">Go Unlimited.</span></h3>
                    <p className="text-white/60 font-medium text-lg leading-relaxed">
                        Join 10,000+ members who have revolutionized their lifestyle with the Forge India Vault. No transaction fees, priority support, and infinite possibilities.
                    </p>
                    <div className="flex justify-center gap-6">
                        <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all uppercase text-xs tracking-widest">Get Membership</button>
                        <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest">Compare Plans</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 🎁 7. BENEFITS SECTION --- */}
      <section className="px-6 py-20 bg-white/2">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { title: 'Unlimited Bookings', icon: Zap, desc: 'Zero limits on how many times you book your favorite services monthly.', color: 'text-amber-500' },
                    { title: 'Priority Access', icon: Clock, desc: 'Skip the queue with instant approvals and guaranteed slots for members.', color: 'text-blue-500' },
                    { title: 'Digital Vault', icon: ShieldCheck, desc: 'Securely preload funds and enjoy seamless one-click payments.', color: 'text-emerald-500' }
                ].map((benefit, i) => (
                    <div key={i} className="space-y-6 group">
                        <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${benefit.color}`}>
                            <benefit.icon size={28} />
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">{benefit.title}</h4>
                        <p className="text-white/40 font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- ⚡ 8. QUICK BOOKING PANEL --- */}
      <AnimatePresence>
        {showBookingPanel && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="w-full max-w-xl bg-[#0f172a] rounded-t-[3rem] md:rounded-[3rem] p-10 border-t md:border border-white/10 shadow-2xl relative"
                >
                    <button 
                        onClick={() => setShowBookingPanel(false)}
                        className="absolute top-8 right-8 text-white/40 hover:text-white font-black text-xs uppercase tracking-widest"
                    >
                        Close
                    </button>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                <img src={selectedService?.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{selectedService?.category}</p>
                                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{selectedService?.title}</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Select Preference</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                    <span className="text-xs font-bold">Standard Slot</span>
                                    <Plus size={16} />
                                </div>
                                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-500 italic">Priority Slot</span>
                                    <Zap size={16} className="text-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-white/40 text-sm font-bold">Booking Amount</span>
                                <span className="text-2xl font-black">₹{selectedService?.price}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <button className="w-full py-6 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">
                                    Pay Regularly
                                </button>
                                <button className="w-full py-6 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-gold-500/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <Zap size={16} /> Use Membership
                                </button>
                            </div>
                            <p className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                Instant confirmation for members. Secure vault transaction.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- 📱 10. MOBILE UX (Sticky CTA for Membership) --- */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:hidden z-50">
        <button className="w-full py-5 bg-gold-500 text-black font-black rounded-2xl shadow-2xl shadow-gold-500/40 uppercase text-xs tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3">
            <Zap size={16} /> Activate Membership
        </button>
      </div>

    </div>
  );
};

export default ServicesPage;

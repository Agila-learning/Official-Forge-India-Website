import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Star, ShieldCheck, 
  Zap, Clock, Heart, ArrowRight, Home, 
  Hotel, Bus, Utensils, ShoppingBag, Ticket,
  CheckCircle2, ChevronRight, Filter, Plus, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEOMeta from '../components/ui/SEOMeta';
import MembershipCard from '../components/ui/MembershipCard';
import ServiceInquiryForm from '../components/ui/ServiceInquiryForm';
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const filteredListings = listings.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory) &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBuyMembership = () => {
    addToCart({
        _id: 'membership-pro',
        name: 'FIC Pro Membership',
        price: 999,
        image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400',
        isService: true,
        qty: 1
    });
    toast.success('Pro Membership added to cart. Access Authorized.');
    navigate('/checkout');
  };

  const handleBookNow = (service) => {
    const isHighValue = ['it-solutions', 'website-development', 'app-development', 'insurance-services', 'software-development', 'ui-ux-design', 'digital-marketing'].includes(service.id);
    setSelectedService(service);
    if (isHighValue) {
        setShowInquiryForm(true);
    } else {
        setShowBookingPanel(true);
    }
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

      {/* --- 🛡️ MEMBERSHIP PROMPT --- */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto glass-premium rounded-[3rem] p-8 md:p-12 border border-blue-600/20 bg-gradient-to-br from-blue-600/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div className="lg:w-1/3 flex justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                    <MembershipCard />
                </div>
                <div className="lg:w-2/3 text-left">
                    <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-600/20 mb-6 inline-block">Pro Tier Authorized</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6">Forge <span className="text-blue-500">Membership Card</span></h2>
                    <p className="text-lg text-white/50 font-medium leading-relaxed mb-10 max-w-2xl italic">Unlock unlimited access to all verified services for one monthly fee. Pre-load credits and deploy services at zero fulfillment cost.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: Zap, title: 'Unlimited Visits', desc: 'Deploy services anytime.' },
                            { icon: ShieldCheck, title: 'Zero Fees', desc: 'No transaction charges.' },
                            { icon: Clock, title: 'Elite Priority', desc: 'Fastest response time.' }
                        ].map((b, i) => (
                            <div key={i} className="space-y-2">
                                <b.icon className="text-blue-500" size={24} />
                                <h5 className="text-xs font-black uppercase tracking-tight text-white">{b.title}</h5>
                                <p className="text-[10px] text-white/30 font-bold uppercase italic">{b.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={handleBuyMembership}
                            className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            Buy Membership - ₹999/mo
                        </button>
                        <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">View Full Protocol</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 🏷️ CATEGORY BAR --- */}
      <section className="px-6 pb-12 sticky top-20 z-50">
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
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center gap-3 whitespace-nowrap ${activeCategory === cat.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                >
                    <cat.icon className={activeCategory === cat.id ? 'text-blue-600' : 'text-white/40'} size={18} />
                    {cat.label}
                </button>
            ))}
        </div>
      </section>

      {/* --- 📋 2. LISTINGS GRID --- */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                    {filteredListings.map((item) => (
                        <motion.div 
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-premium rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-600/30 transition-all group shadow-2xl"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                {item.isPremium && (
                                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                        Premium Authorized
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex gap-2">
                                        {item.tags.map(t => (
                                            <span key={t} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/10">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 text-left">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center text-orange-500 gap-1">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-[10px] font-black">{item.rating}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/20 uppercase">({item.reviews} Reviews)</span>
                                </div>

                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 leading-tight truncate group-hover:text-blue-500 transition-colors">{item.title}</h3>
                                
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Starting from</p>
                                        <p className="text-2xl font-black text-white italic">₹{item.price.toLocaleString()} <span className="text-xs font-bold text-white/40 uppercase tracking-normal">/{item.unit}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => handleBookNow(item)}
                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-90"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
      </section>

      {/* --- 📜 FOOTER --- */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Forge India <span className="text-blue-600">Connect</span></h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-12">Premier Service Marketplace Protocol</p>
              <div className="flex flex-wrap justify-center gap-10">
                  {['Legal', 'Privacy', 'Compliance', 'Terminal'].map(l => (
                      <a key={l} href="#" className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-blue-500 transition-colors">{l}</a>
                  ))}
              </div>
          </div>
      </footer>

      {/* --- 🎫 BOOKING PANEL --- */}
      <AnimatePresence>
          {showBookingPanel && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowBookingPanel(false)}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="max-w-lg w-full bg-slate-900 rounded-[3rem] border border-white/10 p-10 relative z-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]"
                >
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8 mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter text-center mb-4 italic">Confirm <span className="text-blue-500">Deployment</span></h3>
                    <p className="text-sm text-white/50 text-center font-medium leading-relaxed mb-10 italic">You are initiating the deployment protocol for {selectedService?.title}. Proceed to cart to finalize logistics.</p>
                    
                    <div className="space-y-4 mb-10">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Base Rate</span>
                            <span className="text-xl font-black text-white italic">₹{selectedService?.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => {
                                addToCart({ ...selectedService, qty: 1, isService: true, _id: selectedService.id });
                                toast.success('Service Deployment Authorized');
                                setShowBookingPanel(false);
                            }}
                            className="py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
                        >
                            Authorize
                        </button>
                        <button onClick={() => setShowBookingPanel(false)} className="py-5 bg-white/5 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest border border-white/10">Abort</button>
                    </div>
                </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* --- 📝 INQUIRY FORM --- */}
      <ServiceInquiryForm 
        isOpen={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        serviceId={selectedService?.id}
        serviceName={selectedService?.title}
      />
    </div>
  );
};

export default ServicesPage;

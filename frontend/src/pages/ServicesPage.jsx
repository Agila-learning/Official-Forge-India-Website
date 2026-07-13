import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Search, MapPin, Calendar, Star, ShieldCheck, 
  Zap, Clock, Heart, ArrowRight, Home, 
  Hotel, Bus, Utensils, ShoppingBag, Ticket,
  CheckCircle2, ChevronRight, Filter, Plus, ArrowUpRight,
  ChevronLeft, ArrowRightIcon, Cpu, Smartphone, Building2, Briefcase, Truck, Layers
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEOMeta from '../components/ui/SEOMeta';
import MembershipCard from '../components/ui/MembershipCard';
import ServiceInquiryForm from '../components/ui/ServiceInquiryForm';
import ServiceCard from '../components/ui/ServiceCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const HorizontalCarousel = ({ title, items, onBook }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{title}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory px-4 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item._id || item.id} className="min-w-[85vw] sm:min-w-[300px] md:min-w-[380px] snap-start">
            <ServiceCard product={item} onBook={onBook} />
          </div>
        ))}
        {items.length === 0 && <div className="text-gray-500 font-bold uppercase tracking-widest text-xs p-10">No services found.</div>}
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { categorySlug } = useParams();
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Unified Services
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const listingsRef = React.useRef(null);
  const titleRef = React.useRef(null);

  useGSAP(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        color: '#fb923c',
        textShadow: "0px 0px 30px rgba(249, 115, 22, 0.6)",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut',
      });
    }
  }, []);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch unified services catalog
        const { data } = await api.get('/services');
        setServices(data || []);
        
        // Extract unique categories from the DB
        const uniqueCats = Array.from(new Set(data.map(s => s.category))).filter(Boolean);
        const catObjects = uniqueCats.map(c => ({
          id: c.toLowerCase().replace(/\s+/g, '-'),
          label: c,
          icon: Layers // Fallback icon
        }));
        setCategories(catObjects);
        
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userMembership = userInfo.membershipVault || { planValue: 0 };

  const popularServices = services.filter(s => (s.stats?.[0]?.value || 0) > 50 || s.rating >= 4.5).slice(0, 8);
  const membershipServices = services.filter(s => s.basePrice <= (userMembership.planValue || 1000)).slice(0, 8);
  const newServices = [...services].reverse().slice(0, 8);

  const filteredListings = services.filter(item => {
    const itemCategorySlug = (item.category || '').toLowerCase().replace(/\s+/g, '-');
    const activeCategorySlug = (activeCategory || '').toLowerCase().replace(/\s+/g, '-');
    
    const nameMatch = (item.serviceName || item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = activeCategory === 'all' || itemCategorySlug === activeCategorySlug;
    
    return catMatch && (nameMatch || descMatch);
  });

  const handleBuyMembership = () => {
    addToCart({
      _id: 'MEMBERSHIP_UPGRADE',
      name: 'Forge Membership Protocol',
      price: 2000,
      image: '/logo.jpg',
      isService: true,
      category: 'Membership'
    }, 1);
    toast.success('Membership Card added to cart');
    navigate('/checkout');
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    if (service.basePrice > 50000 || (service.category || '').toLowerCase().includes('consulting')) {
      setShowInquiryForm(true);
    } else {
      setShowBookingPanel(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-inter">
      <SEOMeta 
        title="Unified Services Marketplace | Forge India Connect"
        description="Explore premium services across all categories including Home Services, Vehicle Services, and IT."
      />

      {/* --- 🔍 1. HERO + SMART SEARCH --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            EXPERIENCE <span ref={titleRef} className="text-blue-500">UNLIMITED</span>
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
                <select className="bg-transparent outline-none font-bold text-sm !bg-none !pr-0 text-white">
                  <option className="text-black">Krishnagiri</option>
                  <option className="text-black">Chennai</option>
                  <option className="text-black">Bangalore</option>
                </select>
              </div>
              <button 
                onClick={scrollToListings}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
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
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">Forge <span className="text-blue-500">Membership Card</span></h2>
              <p className="text-lg text-white/50 font-medium leading-relaxed mb-10 max-w-2xl">Unlock unlimited access to all verified services for one monthly fee. Pre-load credits and deploy services at zero fulfillment cost.</p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleBuyMembership}
                  className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Buy Membership Card
                </button>
                <button 
                  onClick={scrollToListings}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  View Full Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🏷️ DYNAMIC CATEGORY BAR --- */}
      <section ref={listingsRef} className="px-6 pb-12 sticky top-20 z-50">
        <div className="max-w-7xl mx-auto flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar px-4 md:px-0 bg-[#0a0a0b]/80 backdrop-blur-xl rounded-2xl pt-4">
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
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center gap-3 whitespace-nowrap ${activeCategory === cat.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
            >
              <cat.icon className={activeCategory === cat.id ? 'text-blue-600' : 'text-white/40'} size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* --- 📋 2. LISTINGS / CAROUSELS --- */}
      <section id="listings" className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {activeCategory === 'all' && searchQuery === '' ? (
            <>
              <HorizontalCarousel title="Popular Services in Your Area" items={popularServices} onBook={handleBookNow} />
              <HorizontalCarousel title="Included in Membership (Unlimited)" items={membershipServices} onBook={handleBookNow} />
              <HorizontalCarousel title="New & Featured Services" items={newServices} onBook={handleBookNow} />
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredListings.map((item) => (
                  <motion.div key={item._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <ServiceCard product={{...item, name: item.serviceName, price: item.basePrice}} onBook={handleBookNow} />
                  </motion.div>
                ))}
                {filteredListings.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-500 font-bold uppercase tracking-widest">No services found for this category.</div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* --- 🎫 BOOKING PANEL --- */}
      <AnimatePresence>
        {showBookingPanel && selectedService && (
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
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter text-center mb-4">Confirm <span className="text-blue-500">Deployment</span></h3>
              <p className="text-sm text-white/50 text-center font-medium leading-relaxed mb-10">You are initiating the deployment protocol for {selectedService.serviceName || selectedService.name}. Proceed to checkout to finalize logistics.</p>
              
              <div className="space-y-4 mb-10">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Base Rate</span>
                  <span className="text-xl font-black text-white">₹{selectedService.basePrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    addToCart({ ...selectedService, name: selectedService.serviceName || selectedService.name, price: selectedService.basePrice, qty: 1, isService: true, _id: selectedService._id });
                    toast.success('Service Deployment Authorized');
                    setShowBookingPanel(false);
                    navigate('/checkout');
                  }}
                  className="py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
                >
                  Authorize
                </button>
                <button onClick={() => setShowBookingPanel(false)} className="py-5 bg-white/5 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest border border-white/10 hover:bg-white/10">Abort</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 📝 INQUIRY FORM --- */}
      <ServiceInquiryForm 
        isOpen={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        serviceId={selectedService?._id}
        serviceName={selectedService?.serviceName || selectedService?.name}
      />
    </div>
  );
};

export default ServicesPage;

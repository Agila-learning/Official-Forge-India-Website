import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wrench, ShieldCheck, Clock, ArrowRight, Zap, Droplets, Paintbrush, 
    Sparkles, Search, MapPin, Star, Filter, CheckCircle2,
    Home, Briefcase, Settings, Heart
} from 'lucide-react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import MembershipCard from '../../components/ui/MembershipCard';
import { useLocation } from '../../context/LocationContext';

const detailedCategories = [
    { id: 'cleaning', title: 'Deep Cleaning', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'maintenance', title: 'Maintenance', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'painting', title: 'Painting', icon: Paintbrush, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'plumbing', title: 'Plumbing', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'electrician', title: 'Electrician', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
];

const HomeServices = () => {
    const navigate = useNavigate();
    const { location: userLocation, setShowModal } = useLocation();
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const routerLocation = useRouterLocation();

    useEffect(() => {
        const params = new URLSearchParams(routerLocation.search);
        const categoryQuery = params.get('category');
        if (categoryQuery) {
            const matchedCategory = detailedCategories.find(c => c.id === categoryQuery);
            if (matchedCategory) {
                setActiveCategory(matchedCategory.title);
            }
        }
    }, [routerLocation.search]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/products');
                const list = data.filter(p => p.isService && p.isActive);
                setServices(list);
                setFilteredServices(list);
                setLoading(false);
            } catch (err) {
                toast.error('Failed to load home services ecosystem');
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const filtered = services.filter(s => {
            const matchesCategory = activeCategory === 'all' || s.serviceType === activeCategory || s.categoryRef === activeCategory;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Smart Location Filtering: Check if service matches user's city hub
            const matchesLocation = !userLocation || !userLocation.city || 
                (s.cityHub && s.cityHub.toLowerCase() === userLocation.city.toLowerCase()) ||
                (s.availableCities && s.availableCities.includes(userLocation.city));

            return matchesCategory && matchesSearch && matchesLocation;
        });
        setFilteredServices(filtered);
    }, [activeCategory, searchQuery, services, userLocation]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            
            {/* --- 🔍 HERO + SMART SEARCH --- */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-6 py-2 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-blue-600/20 mb-8 inline-block"
                            >
                                Optimized Home Ecosystem
                            </motion.span>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] italic"
                            >
                                HOME <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">EVOLUTION</span>.
                            </motion.h1>
                            <p className="text-xl text-white/50 font-medium leading-relaxed max-w-lg mb-12">
                                Deploying industrial-grade domestic operational standards across elite residential sectors. Professional. Precise. Guaranteed.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-12">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-black" alt="" />
                                    ))}
                                </div>
                                <div className="text-xs">
                                    <p className="font-black">10,000+ Verified Bookings</p>
                                    <div className="flex gap-1 text-gold-500 mt-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <MembershipCard />
                        </div>
                    </div>

                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="glass-premium p-2 rounded-[2.5rem] flex flex-col md:flex-row gap-2 shadow-2xl">
                            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                                <Search className="text-white/40" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search specialized service..."
                                    className="bg-transparent w-full outline-none font-medium placeholder:text-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all" onClick={() => setShowModal(true)}>
                                <MapPin className="text-white/40" size={20} />
                                <div className="text-left flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Service Area</p>
                                    <p className="text-sm font-bold text-white uppercase">{userLocation?.city || 'Select Area'}</p>
                                </div>
                            </div>
                            <button className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                                SEARCH
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- QUICK CATEGORY BAR --- */}
            <section className="px-6 pb-12 sticky top-20 z-50">
                <div className="max-w-7xl mx-auto glass-premium p-4 rounded-[2rem] flex gap-4 overflow-x-auto hide-scrollbar">
                    <button 
                        onClick={() => setActiveCategory('all')}
                        className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                    >
                        All Protocols
                    </button>
                    {detailedCategories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.title)}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all whitespace-nowrap flex items-center gap-3 ${activeCategory === cat.title ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                        >
                            <cat.icon size={16} className={activeCategory === cat.title ? 'text-black' : cat.color} />
                            {cat.title}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- SERVICE GRID SECTION --- */}
            <main className="max-w-7xl mx-auto py-20 px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Mission <span className="text-blue-500">Deployments</span></h2>
                        <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Certified Domestic Operational Standards</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-white/5 rounded-[3rem] animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredServices.map((s, i) => (
                            <motion.div 
                                key={s._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden hover:border-white/30 transition-all flex flex-col relative"
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <img 
                                        src={s.image} 
                                        alt={s.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl">
                                            Verified Pro
                                        </span>
                                    </div>
                                    <button className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:text-rose-500 transition-all">
                                        <Heart size={20} />
                                    </button>
                                </div>

                                <div className="p-10 pt-0 flex-1 flex flex-col relative -mt-8 z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Star className="text-gold-500 fill-gold-500" size={16} />
                                        <span className="text-sm font-black tracking-tight">4.9</span>
                                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-2">Certified Review</span>
                                    </div>
                                    <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{s.name}</h4>
                                    <p className="text-sm text-white/40 font-medium leading-relaxed mb-8 line-clamp-2 italic">
                                        {s.description}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Standard Rate</p>
                                            <p className="text-3xl font-black tracking-tighter italic text-blue-500">₹{s.price}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/home-services/booking/${s._id}`)}
                                            className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- MEMBERSHIP UPSELL --- */}
            <section className="px-6 py-24">
                <div className="max-w-7xl mx-auto glass-premium rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_70%)]" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <div className="w-24 h-24 bg-blue-600/10 text-blue-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-blue-600/20">
                            <Zap size={40} />
                        </div>
                        <h3 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                            Infinite Home <br/><span className="text-blue-500">Management</span>.
                        </h3>
                        <p className="text-xl text-white/50 font-medium leading-relaxed">
                            Join the Forge Membership to unlock unlimited on-call service requests, priority scheduling, and 24/7 strategic support for your residence.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="px-12 py-6 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all uppercase text-xs tracking-widest shadow-2xl">Join Premium</button>
                            <button className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest">Standard Booking</button>
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-8">
                            *Standard bookings are available to all verified accounts. Membership is optional for elite benefits.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeServices;

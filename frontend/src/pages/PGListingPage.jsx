import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Star, Wifi, Car, Shield, Dumbbell, Coffee,
  ChevronDown, Filter, Home, Building2, ArrowRight, Loader2,
  BedDouble, Users, DollarSign, Sparkles, X
} from 'lucide-react';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';

const CATEGORIES = ['All', 'PG / Hostel', 'Rental Flat', 'Hotel', 'Villa', 'Service Apartment'];
const PRICE_RANGES = ['Any', 'Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹20,000', '₹20,000+'];
const AMENITY_ICONS = { Wifi: Wifi, Parking: Car, Security: Shield, Gym: Dumbbell, Cafeteria: Coffee };

const AmenityBadge = ({ label }) => {
  const Icon = AMENITY_ICONS[label] || Home;
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
      <Icon size={10} /> {label}
    </span>
  );
};

const PropertyCard = ({ property, onClick }) => {
  const amenities = Array.isArray(property.amenities) ? property.amenities.slice(0, 3) : (typeof property.amenities === 'string' ? property.amenities.split(',') : []).filter(Boolean).slice(0, 3);
  const rating = property.rating || (4 + Math.random()).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={property.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
          {property.category || 'PG'}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-black text-slate-900">{rating}</span>
        </div>
        {property.isAvailable === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1 truncate">{property.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400 truncate">{property.location || 'Location TBD'}</span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {property.description || 'Premium stay with all modern amenities.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {amenities.map(a => <AmenityBadge key={a} label={a.trim()} />)}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Starting From</p>
            <p className="text-2xl font-black text-blue-600">₹{(property.price || 5500).toLocaleString()}<span className="text-xs text-slate-400 font-bold">/mo</span></p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-lg">
            Book Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Fallback demo properties when DB is empty
const DEMO_PROPERTIES = [
  { _id: 'demo1', name: 'Forge Premium PG - Tirupur North', category: 'PG / Hostel', price: 5500, location: 'Tirupur, Tamil Nadu', rating: 4.8, amenities: 'Wifi,Security,Cafeteria', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600', description: 'Modern co-living space with high-speed wifi, 24/7 security, and all-inclusive rent.' },
  { _id: 'demo2', name: 'Cozy Studio Apartment', category: 'Rental Flat', price: 9000, location: 'Chennai, Tamil Nadu', rating: 4.6, amenities: 'Wifi,Parking,Gym', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600', description: 'Fully furnished studio perfect for working professionals.' },
  { _id: 'demo3', name: 'Luxury Business Hotel Suite', category: 'Hotel', price: 3200, location: 'Coimbatore, Tamil Nadu', rating: 4.9, amenities: 'Wifi,Gym,Parking', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', description: 'Premium hotel with corporate facilities and round-the-clock service.' },
  { _id: 'demo4', name: 'Green Valley Villa', category: 'Villa', price: 45000, location: 'Ooty, Tamil Nadu', rating: 4.7, amenities: 'Parking,Security', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', description: 'Exclusive 4BHK villa with mountain views and private garden.' },
  { _id: 'demo5', name: 'Tech Park PG Hostel', category: 'PG / Hostel', price: 6000, location: 'Bangalore, Karnataka', rating: 4.5, amenities: 'Wifi,Cafeteria,Security', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600', description: 'Ideal for IT professionals — walking distance to major tech parks.' },
  { _id: 'demo6', name: 'Riverside Service Apartment', category: 'Service Apartment', price: 15000, location: 'Kochi, Kerala', rating: 4.7, amenities: 'Wifi,Gym,Parking', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', description: 'Fully-serviced apartment with kitchen and stunning river views.' },
];

const PGListingPage = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('Any');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/public');
      if (data && data.length > 0) {
        setProperties(data);
        setFiltered(data);
      } else {
        setProperties(DEMO_PROPERTIES);
        setFiltered(DEMO_PROPERTIES);
      }
    } catch {
      setProperties(DEMO_PROPERTIES);
      setFiltered(DEMO_PROPERTIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...properties];
    if (search) result = result.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'All') result = result.filter(p => p.category?.toLowerCase().includes(activeCategory.toLowerCase().split('/')[0].trim().toLowerCase()));
    if (priceRange !== 'Any') {
      if (priceRange === 'Under ₹5,000') result = result.filter(p => p.price < 5000);
      else if (priceRange === '₹5,000 - ₹10,000') result = result.filter(p => p.price >= 5000 && p.price <= 10000);
      else if (priceRange === '₹10,000 - ₹20,000') result = result.filter(p => p.price > 10000 && p.price <= 20000);
      else result = result.filter(p => p.price > 20000);
    }
    setFiltered(result);
  }, [search, activeCategory, priceRange, properties]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 pb-20">
      <SEOMeta
        title="PG, Rentals & Hotels | Forge India Connect"
        description="Find verified PGs, rental flats, hotels, and villas across India. All properties are inspected and premium quality."
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles size={12} /> Verified Stays Across India
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
              Find Your Perfect <span className="text-yellow-300">Stay</span>
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto mb-10">
              PGs, rental flats, hotels, and villas — all verified by Forge India Connect.
            </p>
            {/* Search Bar */}
            <div className="flex items-center gap-3 max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <Search size={20} className="text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 py-3 text-slate-900 font-medium text-sm outline-none bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { v: properties.length || '50+', l: 'Properties Listed' },
            { v: '4.8★', l: 'Average Rating' },
            { v: '100%', l: 'Verified' },
            { v: '24/7', l: 'Support' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black text-blue-600">{s.v}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-dark-bg text-slate-500 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto relative">
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl outline-none cursor-pointer"
            >
              {PRICE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Home size={60} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">No properties found</h3>
            <p className="text-slate-400 mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">
                {filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'} Found
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(p => (
                <PropertyCard
                  key={p._id}
                  property={p}
                  onClick={() => navigate(`/pg-stays/${p._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PGListingPage;

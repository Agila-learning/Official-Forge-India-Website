import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Car, Bike, ArrowRight, ChevronRight, Zap,
  Clock, Shield, Star, Loader2, Navigation, Search,
  CheckCircle2, Users, AlertCircle, X
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';
import VoiceBookingAssistant from '../components/ui/VoiceBookingAssistant';
import MembershipPromptModal from '../components/ui/MembershipPromptModal';

// ─── Constants ─────────────────────────────────────────────────────────────
const RIDE_TYPES = [
  { id: 'Bike',           label: 'Bike',           image: '/vehicles/bike.png',  icon: Bike, color: 'from-purple-600 to-violet-700', rate: 3,  base: 30,  eta: '3-5 min',   capacity: '1 Person' },
  { id: 'Auto',           label: 'Auto',           image: '/vehicles/auto.png',  icon: Zap,  color: 'from-yellow-500 to-orange-600', rate: 5,  base: 50,  eta: '5-7 min',   capacity: '3 Persons' },
  { id: 'Car',            label: 'Car (Mini)',     image: '/vehicles/cab.png',   icon: Car,  color: 'from-blue-600 to-sky-700',      rate: 12, base: 80,  eta: '8-12 min',  capacity: '4 Persons' },
  { id: 'SUV',            label: 'SUV (Premium)',  image: '/vehicles/cab.png',   icon: Car,  color: 'from-slate-800 to-black',       rate: 18, base: 120, eta: '10-15 min', capacity: '6 Persons' },
  { id: 'Parcel Delivery',label: 'Parcel Delivery',image: '/vehicles/truck.png', icon: Bike, color: 'from-indigo-500 to-indigo-700', rate: 8,  base: 60,  eta: '10-20 min', capacity: 'Packages' },
];

// Comprehensive Indian city/place dataset for autocomplete
const INDIA_PLACES = [
  // Tamil Nadu
  'Krishnagiri', 'Krishnagiri Bus Stand', 'Krishnagiri Town', 'Krishnagiri Junction',
  'Chennai', 'Chennai Airport', 'Chennai Central Station', 'Chennai Egmore',
  'Coimbatore', 'Coimbatore Airport', 'Coimbatore Junction', 'Coimbatore Town',
  'Tirupur', 'Tirupur Bus Stand', 'Tirupur Junction', 'Tirupur Town Hall',
  'Salem', 'Salem Junction', 'Salem Bus Stand', 'Vellore', 'Madurai', 'Trichy',
  'Erode', 'Namakkal', 'Dharmapuri', 'Hosur', 'Hosur Town', 'Hosur Industrial Area',
  // Karnataka
  'Bangalore', 'Bangalore Airport', 'Bangalore City Railway Station', 'Bangalore Majestic Bus Stand',
  'Bangalore Whitefield', 'Bangalore Electronic City', 'Bangalore Marathahalli',
  'Bangalore HSR Layout', 'Bangalore Koramangala', 'Bangalore Indiranagar',
  'Bangalore JP Nagar', 'Bangalore MG Road', 'Bangalore BTM Layout',
  'Mysore', 'Mysore City', 'Mysore Bus Stand', 'Mangalore', 'Hubli', 'Belgaum', 'Tumkur',
  // Maharashtra
  'Mumbai', 'Mumbai Airport', 'Mumbai CST', 'Mumbai Dadar', 'Mumbai Bandra',
  'Pune', 'Pune Airport', 'Pune Railway Station', 'Nashik', 'Nagpur',
  // Delhi NCR
  'Delhi', 'New Delhi Railway Station', 'Delhi Airport', 'Delhi Connaught Place',
  'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad',
  // Andhra Pradesh & Telangana
  'Hyderabad', 'Hyderabad Airport', 'Secunderabad', 'Vijayawada', 'Visakhapatnam',
  // Kerala
  'Kochi', 'Kochi Airport', 'Trivandrum', 'Kozhikode',
  // Generic locations
  'Airport Terminal', 'Railway Station', 'Bus Stand', 'City Center', 'Tech Park',
  'Hospital', 'Hotel', 'Mall', 'School', 'College', 'Home'
];

const estimateFare = (rideType, distanceKm) => {
  const ride = RIDE_TYPES.find(r => r.id === rideType) || RIDE_TYPES[2];
  return Math.ceil(ride.base + ride.rate * distanceKm);
};

// ─── Location Autocomplete Input ─────────────────────────────────────────
const LocationInput = ({ value, onChange, placeholder, icon: Icon, iconColor, onGeoLocate }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const getSuggestions = useCallback((query) => {
    if (!query || query.length < 2) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const matches = INDIA_PLACES.filter(p => p.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions(matches);
  }, []);

  useEffect(() => {
    getSuggestions(value);
  }, [value, getSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await resp.json();
          const addr = data.display_name?.split(',').slice(0, 3).join(',') || `Near (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          onChange(addr);
          toast.success('Location detected!');
        } catch {
          onChange(`My Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          toast.success('GPS location set!');
        }
        setLoading(false);
      },
      () => { toast.error('Could not get location'); setLoading(false); }
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 bg-slate-50 dark:bg-dark-bg transition-all ${focused ? 'border-blue-500 bg-white dark:bg-dark-card shadow-md shadow-blue-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className={`w-3 h-3 shrink-0 rounded-full ${iconColor}`} />
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-slate-900 dark:text-white font-bold text-sm outline-none placeholder:text-slate-400 placeholder:font-medium"
        />
        {value && (
          <button type="button" onClick={() => { onChange(''); setSuggestions([]); }} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={14} />
          </button>
        )}
        <button type="button" onClick={handleGeolocate} disabled={loading} className={`shrink-0 transition-all ${loading ? 'text-blue-400' : 'text-slate-400 hover:text-blue-500'}`} title="Use my location">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <button
                key={s}
                onMouseDown={(e) => { e.preventDefault(); onChange(s); setSuggestions([]); setFocused(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
              >
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Searching for Drivers Screen ────────────────────────────────────────
const SearchingScreen = ({ pickup, drop, ride, fare, onCancel }) => {
  const [dots, setDots] = useState(0);
  const [searchPhase, setSearchPhase] = useState(0);
  const phases = ['Searching nearby drivers...', 'Connecting to best match...', 'Almost there...', 'Driver found nearby!'];

  useEffect(() => {
    const dotTimer = setInterval(() => setDots(d => (d + 1) % 4), 500);
    const phaseTimer = setInterval(() => setSearchPhase(p => Math.min(p + 1, phases.length - 1)), 3000);
    return () => { clearInterval(dotTimer); clearInterval(phaseTimer); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#0f172a] z-50 flex flex-col items-center justify-center px-6"
    >
      {/* Pulsing rings animation */}
      <div className="relative mb-10">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-blue-500/30"
            animate={{ scale: [1, 2.5 + i * 0.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            style={{ width: 80, height: 80, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        ))}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 relative z-10">
          {ride?.icon && React.createElement(ride.icon, { size: 36, className: 'text-white' })}
        </div>
      </div>

      <motion.p
        key={searchPhase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-black text-white text-center mb-2"
      >
        {phases[searchPhase]}
      </motion.p>
      <p className="text-slate-400 font-medium text-sm text-center mb-8">
        {pickup?.split(',')[0]} → {drop?.split(',')[0]}
      </p>

      {/* Driver cards floating */}
      <div className="flex gap-4 mb-10">
        {[
          { name: 'Rajan K.', rating: 4.8, dist: '1.2 km', active: searchPhase >= 1 },
          { name: 'Siva M.', rating: 4.9, dist: '2.4 km', active: searchPhase >= 2 },
          { name: 'Arjun R.', rating: 4.7, dist: '3.1 km', active: false },
        ].map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.3 + 0.5 }}
            className={`p-3 rounded-2xl border text-center transition-all ${d.active ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' : 'border-slate-800 bg-slate-800/50'}`}
          >
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 ${d.active ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <Users size={18} className="text-white" />
            </div>
            <p className="text-white font-black text-xs">{d.name}</p>
            <p className="text-slate-400 text-[10px]">⭐ {d.rating}</p>
            <p className={`text-[10px] font-bold ${d.active ? 'text-blue-400' : 'text-slate-500'}`}>{d.dist}</p>
          </motion.div>
        ))}
      </div>

      {/* Fare */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl px-6 py-4 flex items-center gap-4 mb-8 border border-slate-700">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Estimated Fare</p>
          <p className="text-3xl font-black text-white">₹{fare}</p>
        </div>
        <div className="h-10 w-px bg-slate-700" />
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Vehicle</p>
          <p className="text-white font-black">{ride?.label}</p>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="text-slate-500 hover:text-red-400 font-black text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        <X size={14} /> Cancel Booking
      </button>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────
const RideBookingPage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedRide, setSelectedRide] = useState('Car');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [bookedRideId, setBookedRideId] = useState(null);
  const [womenSafetyMode, setWomenSafetyMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  // Estimate distance dynamically from text (rough estimation for UI)
  const estimatedDist = React.useMemo(() => {
    if (!pickup || !drop) return 8;
    // Give higher distances for cross-city routes
    const pickupLower = pickup.toLowerCase();
    const dropLower = drop.toLowerCase();
    const crossCityPairs = [
      ['krishnagiri', 'bangalore'],
      ['bangalore', 'krishnagiri'],
      ['chennai', 'bangalore'],
      ['bangalore', 'chennai'],
      ['coimbatore', 'bangalore'],
      ['tirupur', 'bangalore'],
    ];
    for (const [a, b] of crossCityPairs) {
      if (pickupLower.includes(a) && dropLower.includes(b)) return 200 + Math.floor(Math.random() * 30);
    }
    return Math.floor(5 + Math.random() * 20);
  }, [pickup, drop]);

  const fare = estimateFare(selectedRide, estimatedDist);
  const ride = RIDE_TYPES.find(r => r.id === selectedRide);

  const handleContinue = () => {
    if (step === 1) {
      if (!pickup || !drop) { toast.error('Please enter pickup and drop locations'); return; }
      if (pickup === drop) { toast.error('Pickup and drop cannot be the same'); return; }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleVoiceBooking = (data) => {
    if (data.pickup && data.pickup !== 'My Location') setPickup(data.pickup);
    if (data.drop) setDrop(data.drop);
    if (data.vehicle) {
      const v = RIDE_TYPES.find(r => r.id === data.vehicle || r.label.toLowerCase().includes(data.vehicle.toLowerCase()));
      if (v) setSelectedRide(v.id);
    }
    setStep(2);
  };

  const handleBook = () => {
    if (!userInfo) { toast.error('Please login to book a ride'); navigate('/login'); return; }
    const isMember = userInfo?.hasActiveMembership || userInfo?.membershipTier;
    if (!isMember) {
      setShowMembershipModal(true);
      return;
    }
    proceedWithBooking();
  };

  const proceedWithBooking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/rides/request', {
        pickupLocation: { address: pickup },
        dropLocation: { address: drop },
        origin: pickup,
        destination: drop,
        rideType: selectedRide,
        vehicleType: selectedRide,
        estimatedFare: fare,
        distance: estimatedDist,
        paymentMethod,
        womenSafetyMode,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setBookedRideId(data._id);
      setLoading(false);
      setSearching(true); // Show driver search animation
      toast.success(womenSafetyMode ? 'Searching for female driver...' : 'Ride booked! Searching nearby drivers...');

      // After 6 seconds of searching screen, navigate to tracking
      setTimeout(() => {
        navigate(`/rides/tracking/${data._id}`);
      }, 6000);
    } catch (err) {
      setLoading(false);
      console.error('Ride Booking Error:', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to book ride. Please try again.');
    }
  };

  const handleCancelSearch = async () => {
    if (bookedRideId) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/rides/${bookedRideId}/status`, { status: 'Cancelled' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }
    setSearching(false);
    setBookedRideId(null);
    toast.success('Booking cancelled');
  };

  // ─── Render Searching Screen ───────────────────────────────────────────
  if (searching) {
    return (
      <SearchingScreen
        pickup={pickup}
        drop={drop}
        ride={ride}
        fare={fare}
        onCancel={handleCancelSearch}
      />
    );
  }

  // ─── Main Booking UI ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row pt-24">
      <SEOMeta title="Book a Ride | Forge India Connect" description="Book bike, auto, or car rides instantly." />

      {/* Left: Booking Form */}
      <div className="w-full lg:w-[460px] bg-white dark:bg-dark-card shadow-2xl z-10 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Book a Ride</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forge India Connect Mobility</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          {['Locations', 'Choose Ride', 'Confirm'].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-dark-bg text-slate-400'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step === i + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-5">
          <AnimatePresence mode="wait">

            {/* Step 1: Locations */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <LocationInput
                  value={pickup}
                  onChange={setPickup}
                  placeholder="Enter pickup location"
                  iconColor="bg-blue-600"
                  onGeoLocate={() => {}}
                />

                <div className="flex items-center gap-3 px-2">
                  <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-700" />
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-700" />
                </div>

                <LocationInput
                  value={drop}
                  onChange={setDrop}
                  placeholder="Enter drop / destination"
                  iconColor="bg-red-500 rotate-45"
                  onGeoLocate={() => {}}
                />

                {/* Quick Suggestions */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Popular Destinations</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Bangalore Airport', 'Chennai Central', 'Hosur Town', 'Tech Park'].map(loc => (
                      <button key={loc} onClick={() => !drop ? setDrop(loc) : setPickup(loc)}
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-dark-bg rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left border border-slate-100 dark:border-slate-800">
                        <MapPin size={12} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {pickup && drop && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Route Preview</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-white">{pickup.split(',')[0]} → {drop.split(',')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase">Est. Distance</p>
                        <p className="text-lg font-black text-blue-600">~{estimatedDist} km</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Choose Ride */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <p className="text-xs font-black text-slate-700 dark:text-white truncate">{pickup}</p>
                  </div>
                  <div className="ml-1 pl-3 border-l-2 border-dashed border-blue-300 py-1">
                    <p className="text-[10px] text-slate-400 font-bold">~{estimatedDist} km · Est. drive</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-sm rotate-45" />
                    <p className="text-xs font-black text-slate-700 dark:text-white truncate">{drop}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {RIDE_TYPES.map(rideOpt => {
                    const Icon = rideOpt.icon;
                    const f = estimateFare(rideOpt.id, estimatedDist);
                    return (
                      <button key={rideOpt.id} onClick={() => setSelectedRide(rideOpt.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedRide === rideOpt.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'}`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rideOpt.color} flex items-center justify-center shrink-0 overflow-hidden`}>
                          {rideOpt.image ? <img src={rideOpt.image} alt={rideOpt.label} className="w-full h-full object-cover mix-blend-screen" /> : <Icon size={22} className="text-white" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-black text-slate-900 dark:text-white text-sm">{rideOpt.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rideOpt.capacity} · {rideOpt.eta}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900 dark:text-white">₹{f}</p>
                          <p className="text-[10px] text-slate-400 font-bold">est. fare</p>
                        </div>
                        {selectedRide === rideOpt.id && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0"><span className="text-white text-[10px]">✓</span></div>}
                      </button>
                    );
                  })}
                </div>

                {/* Women Safety Mode */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-100 dark:border-pink-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                        <Shield size={18} className="text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm">Women Safety Mode</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assign female drivers only</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={womenSafetyMode} onChange={(e) => setWomenSafetyMode(e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className={`bg-gradient-to-br ${ride?.color} rounded-[2rem] p-6 text-white`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-3">Booking Summary</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {ride?.image ? <img src={ride.image} alt={ride.label} className="w-full h-full object-cover mix-blend-screen" /> : (ride && <ride.icon size={32} className="text-white" />)}
                    </div>
                    <div>
                      <p className="text-2xl font-black">{ride?.label}</p>
                      <p className="text-sm opacity-70">{ride?.capacity} · {ride?.eta}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm font-bold opacity-80">
                    <div className="flex items-start gap-2"><div className="w-2 h-2 bg-white rounded-full mt-1.5 shrink-0" /><span>{pickup}</span></div>
                    <div className="flex items-start gap-2"><div className="w-2 h-2 bg-white/50 rounded-sm rotate-45 mt-1.5 shrink-0" /><span>{drop}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <p className="text-sm font-black opacity-70">{estimatedDist} km · Est. Fare</p>
                    <p className="text-3xl font-black">₹{fare}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Method</p>
                  <div className="flex gap-3">
                    {['Cash', 'Online'].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)}
                        className={`flex-1 py-3 rounded-xl text-sm font-black transition-all border-2 ${paymentMethod === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:border-blue-500'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {['Verified & Insured Driver', 'Real-time GPS Tracking', 'OTP Verified Ride Start'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-500">{f}</span>
                    </div>
                  ))}
                </div>

                {womenSafetyMode && (
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30">
                    <Shield size={14} className="text-pink-600 shrink-0" />
                    <span className="text-xs font-bold text-pink-600">Women Safety Mode Active — Female drivers only</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          {step < 3 ? (
            <button onClick={handleContinue} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2">
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleBook} disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Car size={18} /> Confirm &amp; Book Ride</>}
            </button>
          )}
          {step > 1 && (
            <button onClick={() => setStep(p => p - 1)} className="w-full mt-3 py-3 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:text-slate-700 transition-colors">
              ← Go Back
            </button>
          )}
        </div>
      </div>

      {/* Right: Animated Map */}
      <div className="flex-1 relative bg-slate-800 overflow-hidden min-h-[300px] lg:min-h-0">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) opacity(0.9)' }}
          src={`https://maps.google.com/maps?saddr=${encodeURIComponent(pickup || 'India')}&daddr=${encodeURIComponent(drop || 'India')}&output=embed`}
          allowFullScreen
          title="Ride Booking Map"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-transparent w-32 z-10 pointer-events-none" />

        {/* Floating Info Cards */}
        <div className="absolute top-6 right-6 space-y-3 z-20 pointer-events-none">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white shadow-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 text-blue-400">Route Distance</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin size={12} className="text-white" />
              </div>
              <span className="font-black text-sm">~{estimatedDist} km</span>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white shadow-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 text-green-400">Est. Fare</p>
            <span className="font-black text-xl">₹{fare}</span>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white flex items-center gap-2 shadow-2xl">
            <Navigation size={14} className="animate-pulse text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-widest">FIC Live Tracking Map</span>
          </div>
        </div>
      </div>

      <VoiceBookingAssistant onApplyBooking={handleVoiceBooking} />

      <MembershipPromptModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        onSuccess={() => {
          setShowMembershipModal(false);
          if (userInfo) {
            const updatedUser = { ...userInfo, hasActiveMembership: true };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          }
          setTimeout(() => { proceedWithBooking(); }, 500);
        }}
        onSkip={() => {
          setShowMembershipModal(false);
          setTimeout(() => { proceedWithBooking(); }, 500);
        }}
      />
    </div>
  );
};

export default RideBookingPage;

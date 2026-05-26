import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Car, Bike, ArrowRight, ChevronRight, Zap,
  Clock, DollarSign, Shield, Star, ChevronDown, Loader2, Navigation
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const RIDE_TYPES = [
  { id: 'Bike', label: 'Bike', icon: Bike, color: 'from-purple-600 to-violet-700', rate: 3, base: 30, eta: '3-5 min', capacity: '1 Person' },
  { id: 'Auto', label: 'Auto', icon: Zap, color: 'from-yellow-500 to-orange-600', rate: 5, base: 50, eta: '5-7 min', capacity: '3 Persons' },
  { id: 'Car', label: 'Car (Mini)', icon: Car, color: 'from-blue-600 to-sky-700', rate: 12, base: 80, eta: '8-12 min', capacity: '4 Persons' },
  { id: 'Scooter', label: 'Scooter', icon: Bike, color: 'from-green-500 to-teal-600', rate: 4, base: 35, eta: '3-5 min', capacity: '1 Person' },
];

const estimateFare = (rideType, distanceKm) => {
  const ride = RIDE_TYPES.find(r => r.id === rideType) || RIDE_TYPES[2];
  return Math.ceil(ride.base + ride.rate * distanceKm);
};

const RideBookingPage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedRide, setSelectedRide] = useState('Car');
  const [step, setStep] = useState(1); // 1=locations, 2=choose ride, 3=confirm
  const [loading, setLoading] = useState(false);
  const [estimatedDist] = useState(Math.floor(4 + Math.random() * 12)); // Simulated distance
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fare = estimateFare(selectedRide, estimatedDist);
  const ride = RIDE_TYPES.find(r => r.id === selectedRide);

  const handleContinue = () => {
    if (step === 1) {
      if (!pickup || !drop) { toast.error('Please enter pickup and drop locations'); return; }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBook = async () => {
    if (!userInfo) { toast.error('Please login to book a ride'); navigate('/login'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/rides/request', {
        pickupLocation: { address: pickup, lat: 11.0, lng: 77.0 },
        dropLocation: { address: drop, lat: 11.1, lng: 77.1 },
        rideType: selectedRide,
        estimatedFare: fare,
        distance: estimatedDist,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Ride booked! Finding your driver...');
      navigate(`/rides/tracking/${data._id}`);
    } catch {
      // Simulate booking for demo
      toast.success('Ride booked! Finding your driver...');
      navigate(`/rides/tracking/demo-ride-${Date.now()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row">
      <SEOMeta title="Book a Ride | Forge India Connect" description="Book bike, auto, or car rides instantly." />

      {/* Left: Booking Form */}
      <div className="w-full lg:w-[440px] bg-white dark:bg-dark-card shadow-2xl z-10 flex flex-col overflow-y-auto">
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
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full" />
                  <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup location"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/20 border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="flex items-center gap-3 px-2">
                  <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-700" />
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-700" />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-sm rotate-45" />
                  <input value={drop} onChange={e => setDrop(e.target.value)} placeholder="Drop location / destination"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500/20 border border-slate-200 dark:border-slate-700" />
                </div>
                {/* Quick Suggestions */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Select</p>
                  <div className="space-y-2">
                    {['Airport Terminal', 'Railway Station', 'City Center Mall', 'Tech Park'].map(loc => (
                      <button key={loc} onClick={() => !drop ? setDrop(loc) : setPickup(loc)}
                        className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-bg rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
                    <p className="text-[10px] text-slate-400 font-bold">~{estimatedDist} km</p>
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
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedRide === rideOpt.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'}`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rideOpt.color} flex items-center justify-center`}>
                          <Icon size={22} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-black text-slate-900 dark:text-white text-sm">{rideOpt.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rideOpt.capacity} · {rideOpt.eta}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900 dark:text-white">₹{f}</p>
                          <p className="text-[10px] text-slate-400 font-bold">est. fare</p>
                        </div>
                        {selectedRide === rideOpt.id && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className={`bg-gradient-to-br ${ride?.color} rounded-[2rem] p-6 text-white`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-3">Booking Summary</p>
                  <div className="flex items-center gap-3 mb-4">
                    {ride && <ride.icon size={32} className="text-white" />}
                    <div>
                      <p className="text-2xl font-black">{ride?.label}</p>
                      <p className="text-sm opacity-70">{ride?.capacity} · {ride?.eta}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm font-bold opacity-80">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full" />{pickup}</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/50 rounded-sm rotate-45" />{drop}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <p className="text-sm font-black opacity-70">{estimatedDist} km · Est. Fare</p>
                    <p className="text-3xl font-black">₹{fare}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Method</p>
                  <div className="flex gap-3">
                    {['Online', 'Cash'].map(m => (
                      <button key={m} className="flex-1 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-700 dark:text-white hover:border-blue-500 transition-all">
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {['Verified & Insured Driver', 'Real-time GPS Tracking', 'OTP Verified Ride Start'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Shield size={12} className="text-green-500" /><span className="text-[11px] font-bold text-slate-500">{f}</span></div>
                  ))}
                </div>
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Car size={18} /> Confirm Booking</>}
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
        <div className="absolute inset-0 bg-[#1a2942]" />
        {/* Grid lines simulate a map */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="mapgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>

        {/* Animated Route Line */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path d="M 30% 70% Q 50% 30% 70% 40%" fill="none" stroke="#3b82f6" strokeWidth="3"
            strokeDasharray="6 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          <circle cx="30%" cy="70%" r="8" fill="#3b82f6" />
          <circle cx="70%" cy="40%" r="8" fill="#ef4444" />
        </svg>

        {/* Moving Bike Icon */}
        <motion.div className="absolute text-white text-3xl"
          style={{ left: '30%', top: '70%', transform: 'translate(-50%, -50%)' }}
          animate={{ left: ['30%', '70%'], top: ['70%', '40%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 border-4 border-white">
            <Car size={22} className="text-white" />
          </div>
        </motion.div>

        {/* Floating Info Cards */}
        <div className="absolute top-6 right-6 space-y-3">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Nearest Driver</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Car size={12} className="text-white" />
              </div>
              <span className="font-black text-sm">2.1 km · 4 min</span>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Est. Fare</p>
            <span className="font-black text-xl">₹{fare}</span>
          </motion.div>
        </div>

        {/* Bottom Label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white flex items-center gap-2">
            <Navigation size={14} className="animate-pulse text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-widest">FIC Live Map</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideBookingPage;

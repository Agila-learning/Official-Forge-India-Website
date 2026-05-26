import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Car, MapPin, Phone, Star, Shield, Clock, Check, 
  ChevronRight, Navigation, Loader2, X, CreditCard, Banknote
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const STATUSES = ['Searching', 'Accepted', 'Arrived', 'InRide', 'Completed'];
const STATUS_LABELS = { Searching: 'Finding Driver...', Accepted: 'Driver on the Way', Arrived: 'Driver Arrived', InRide: 'On the Way', Completed: 'Ride Completed' };
const STATUS_COLORS = { Searching: 'text-yellow-500', Accepted: 'text-blue-500', Arrived: 'text-purple-500', InRide: 'text-green-500', Completed: 'text-green-600' };

const MOCK_DRIVER = {
  name: 'Arjun Kumar',
  vehicle: 'Honda City',
  plateNo: 'TN 04 AB 1234',
  rating: 4.9,
  trips: 1847,
  phone: '+91 98765 43210',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
};

const RideTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusIdx, setStatusIdx] = useState(0);
  const [otp] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [fareAmt] = useState(Math.floor(80 + Math.random() * 200));
  const [elapsed, setElapsed] = useState(0);
  const [vehiclePos, setVehiclePos] = useState({ x: 20, y: 70 });

  const currentStatus = STATUSES[statusIdx];
  const driver = MOCK_DRIVER;

  // Auto-advance status simulation
  useEffect(() => {
    if (statusIdx >= STATUSES.length - 1) return;
    const delays = [5000, 8000, 6000, 12000];
    const timer = setTimeout(() => setStatusIdx(p => p + 1), delays[statusIdx] || 5000);
    return () => clearTimeout(timer);
  }, [statusIdx]);

  // Show payment modal on completion
  useEffect(() => {
    if (currentStatus === 'Completed') {
      setTimeout(() => setShowPayment(true), 1000);
    }
  }, [currentStatus]);

  // Elapsed time
  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Animate vehicle position
  useEffect(() => {
    const targets = [
      { x: 20, y: 70 },   // Searching
      { x: 35, y: 55 },   // Accepted
      { x: 50, y: 40 },   // Arrived
      { x: 65, y: 30 },   // InRide
      { x: 80, y: 20 },   // Completed
    ];
    if (targets[statusIdx]) setVehiclePos(targets[statusIdx]);
  }, [statusIdx]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handlePayment = (method) => {
    toast.success(`Payment of ₹${fareAmt} via ${method} successful!`, { duration: 4000 });
    setPaymentDone(true);
    setShowPayment(false);
    setTimeout(() => navigate('/rides/history'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row">
      <SEOMeta title="Ride Tracking | Forge India Connect" description="Track your ride in real-time." />

      {/* Left: Status Panel */}
      <div className="w-full lg:w-[400px] bg-white dark:bg-dark-card shadow-2xl z-10 flex flex-col overflow-y-auto">
        {/* Status Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${currentStatus === 'Completed' ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${STATUS_COLORS[currentStatus]}`}>
              {currentStatus === 'Searching' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2" />}
              {STATUS_LABELS[currentStatus]}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">{formatTime(elapsed)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            {currentStatus === 'Completed' ? '🎉 Ride Complete!' : currentStatus === 'Searching' ? 'Finding Best Match...' : `${driver.name} is ${currentStatus === 'Accepted' ? 'coming' : currentStatus === 'Arrived' ? 'here!' : 'driving'}`}
          </h1>
        </div>

        {/* Status Stepper */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          {STATUSES.map((s, i) => {
            const isPast = i < statusIdx;
            const isCurrent = i === statusIdx;
            return (
              <div key={s} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border-2 transition-all ${isPast ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'border-blue-600 bg-blue-600 text-white animate-pulse' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                  {isPast ? <Check size={12} /> : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black ${isCurrent ? 'text-blue-600' : isPast ? 'text-green-600' : 'text-slate-400'}`}>
                    {STATUS_LABELS[s]}
                  </p>
                </div>
                {isCurrent && s !== 'Completed' && <Loader2 size={14} className="text-blue-600 animate-spin" />}
                {isPast && <Check size={14} className="text-green-500" />}
              </div>
            );
          })}
        </div>

        {/* OTP (show when Arrived) */}
        {(currentStatus === 'Arrived' || currentStatus === 'InRide') && (
          <div className="mx-6 my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Ride Start OTP — Share with Driver</p>
            <div className="flex justify-center gap-2">
              {otp.split('').map((digit, i) => (
                <div key={i} className="w-12 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black">{digit}</div>
              ))}
            </div>
          </div>
        )}

        {/* Driver Card */}
        {currentStatus !== 'Searching' && (
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 dark:text-white text-lg">{driver.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-black text-slate-600 dark:text-slate-400">{driver.rating} · {driver.trips.toLocaleString()} trips</span>
                </div>
              </div>
              <a href={`tel:${driver.phone}`} className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm">
                <Phone size={18} />
              </a>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl">
              <Car size={18} className="text-blue-600" />
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{driver.vehicle}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{driver.plateNo}</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">Verified</div>
            </div>
          </div>
        )}

        {/* Fare & Route */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Fare</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">₹{fareAmt}</span>
          </div>
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /><span className="text-xs font-bold text-slate-600 dark:text-slate-400">Pickup: Your Location</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-sm rotate-45" /><span className="text-xs font-bold text-slate-600 dark:text-slate-400">Drop: Destination</span></div>
          </div>

          {currentStatus === 'Completed' && !paymentDone && (
            <button onClick={() => setShowPayment(true)} className="w-full py-4 bg-green-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl animate-pulse">
              Pay ₹{fareAmt} Now
            </button>
          )}
          {paymentDone && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 text-center">
              <Check className="text-green-500 mx-auto mb-2" size={24} />
              <p className="font-black text-green-700 dark:text-green-400 uppercase text-sm">Payment Successful!</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Animated Map */}
      <div className="flex-1 relative bg-[#1a2942] overflow-hidden min-h-[300px] lg:min-h-0">
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="trackgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trackgrid)" />
        </svg>

        {/* Road Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#2d4a70" strokeWidth="20" />
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#2d4a70" strokeWidth="20" />
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#2d4a70" strokeWidth="20" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#2d4a70" strokeWidth="20" />
        </svg>

        {/* Route Path */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.polyline
            points={`${vehiclePos.x}%,${vehiclePos.y}% 80%,20%`}
            fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 4"
            animate={{ strokeDashoffset: [0, -24] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Pickup Point */}
          <circle cx="80%" cy="20%" r="10" fill="#ef4444" />
          <circle cx="80%" cy="20%" r="18" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4">
            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Animated Vehicle */}
        <motion.div
          className="absolute z-10"
          animate={{ left: `${vehiclePos.x}%`, top: `${vehiclePos.y}%` }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 border-4 border-white">
              <Car size={24} className="text-white" />
            </motion.div>
            {/* Pulse rings */}
            {currentStatus === 'Searching' && [1, 2, 3].map(r => (
              <motion.div key={r} className="absolute inset-0 rounded-full border-2 border-blue-400"
                animate={{ scale: [1, 2.5 + r * 0.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, delay: r * 0.4, repeat: Infinity }} />
            ))}
          </div>
        </motion.div>

        {/* Status Bubble */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white flex items-center gap-3">
            {currentStatus === 'Searching' && <Loader2 size={14} className="animate-spin text-yellow-400" />}
            {currentStatus === 'Completed' && <Check size={14} className="text-green-400" />}
            {!['Searching', 'Completed'].includes(currentStatus) && <Navigation size={14} className="text-blue-400 animate-pulse" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{STATUS_LABELS[currentStatus]}</span>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 w-full max-w-md shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Pay for Ride</h3>
                <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
              </div>

              <div className="text-center mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Fare</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white">₹{fareAmt}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-slate-500">Rate your driver after payment</span>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => handlePayment('UPI/Online')}
                  className="w-full flex items-center gap-4 p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl group">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                  <div className="text-left flex-1">
                    <p className="font-black text-sm uppercase tracking-tight">Pay Online (UPI/Card)</p>
                    <p className="text-xs opacity-70">Secure payment — instant confirmation</p>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => handlePayment('Cash')}
                  className="w-full flex items-center gap-4 p-5 bg-slate-100 dark:bg-dark-bg text-slate-800 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-dark-card transition-all group">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-dark-card rounded-xl flex items-center justify-center"><Banknote size={20} /></div>
                  <div className="text-left flex-1">
                    <p className="font-black text-sm uppercase tracking-tight">Pay Cash to Driver</p>
                    <p className="text-xs text-slate-500">Hand cash to driver directly</p>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RideTrackingPage;

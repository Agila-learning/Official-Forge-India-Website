Created At: 2026-07-09T11:09:21Z
Error invalid tool call: There was a problem parsing the tool call. 
Error Message: model output error: invalid tool call error (invalid_signature) trying to unmarshal args to {TargetFile:c:\FORGE_INDIA_CONNECT\FIC_Official-website\frontend\src\pages\RidePartnerDashboard.jsx Overwrite:true CodeContent:import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, MapPin, Star, CheckCircle2, X, Phone, MessageCircle,
  Navigation, Wallet, Clock, BarChart2, Zap, Shield,
  ChevronRight, Bell, LogOut, RefreshCw, AlertTriangle,
  Check, Power, TrendingUp, User, Bike, Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import InAppChat from '../components/ui/InAppChat';
// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString('en-IN');
const fmtTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
// ─── Pending Ride Request Popup ───────────────────────────────────────────────
const PendingRidePopup = ({ ride, onAccept, onDecline, loading }) => {
  const [countdown, setCountdown] = useState(25);
  useEffect(() => {
    if (countdown <= 0) { onDecline(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onDecline]);
  const pickup = ride?.pickupDetails?.location || ride?.shippingAddress?.address || 'Pickup';
  const drop   = ride?.shippingAddress?.address || 'Drop';
  const fare   = ride?.totalPrice || 0;
  const dist   = ride?.rideMetadata?.distanceKm || '?';
  const svcType = ride?.serviceType || 'Ride';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: '100%', scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white dark:bg-[#0F1117] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-white/10"
      >
        {/* Timer ring */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="#2563eb" strokeWidth="4"
                  strokeDasharray={`${(countdown / 25) * 150.8} 150.8`}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-black text-lg text-blue-600">{countdown}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">New Ride Request!</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">{svcType}</p>
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600">₹{fmt(Math.round(fare))}</span>
        </div>
        {/* Route */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mb-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-2">{pickup}</p>
          </div>
          <div className="ml-1 pl-3 border-l-2 border-dashed border-gray-300 dark:border-gray-700 py-0.5">
            <p className="text-[10px] text-gray-400 font-bold">~{dist} km</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500 rotate-45 mt-1 shrink-0" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-2">{drop}</p>
          </div>
        </div>
        {/* Customer */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600">
            {ride?.user?.firstName?.[0] || 'C'}
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {ride?.user?.firstName || 'Customer'} {ride?.user?.lastName || ''}
            </p>
            <p className="text-[10px] text-gray-400 font-bold">{ride?.paymentMethod || 'Cash'} · {ride?.user?.mobile || ''}</p>
          </div>
        </div>
        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDecline}
            className="py-3.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            disabled={loading}
            className="py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
            Accept
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
// ─── Trip Complete Screen ─────────────────────────────────────────────────────
const TripCompleteScreen = ({ ride, onDone }) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fare = ride?.totalPrice || 0;
  const commission = ride?.rideMetadata?.commission || fare * 0.2;
  const earned = fare - commission;
  const handleSubmitRating = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await api.put(`/rides/${ride._id}/rate`, { rating });
      toast.success('Rating submitted!');
      setSubmitted(true);
    } catch {
      toast.error('Could not submit rating');
    }
    setLoading(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-6 overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#0F1117] rounded-[3rem] p-8 w-full max-w-sm space-y-6 border border-white/10 text-center my-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={48} className="text-white" />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Trip Complete!</p>
          <p className="text-5xl font-black text-gray-900 dark:text-white mt-2">₹{fmt(Math.round(earned))}</p>
          <p className="text-gray-400 text-xs font-bold mt-1">
            Your earnings (after {Math.round((commission / (fare || 1)) * 100)}% commission)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Fare</p>
            <p className="text-lg font-black text-gray-900 dark:text-white">₹{fmt(Math.round(fare))}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Platform Fee</p>
            <p className="text-lg font-black text-gray-900 dark:text-white">₹{fmt(Math.round(commission))}</p>
          </div>
        </div>
        {!submitted ? (
          <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-4">
            <p className="text-sm font-black text-gray-900 dark:text-white">Rate the Customer</p>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                  <Star size={32} className={rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-700'} />
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmitRating}
              disabled={rating === 0 || loading}
              className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                rating > 0 ? 'bg-amber-400 text-amber-950 shadow-xl shadow-amber-400/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
              Submit & Continue
            </button>
          </div>
        ) : (
          <button
            onClick={onDone}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 hover:scale-[0.98] transition-transform"
          >
            Done — Find Next Ride
          </button>
        )}
      </div>
    </motion.div>
  );
};
// ─── Active Ride Card ─────────────────────────────────────────────────────────
const ActiveRideCard = ({ ride, onAction, isChatOpen, setIsChatOpen }) => {
  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const status = ride?.status || '';
  const pickup  = ride?.pickupDetails?.location || 'Pickup';
  const drop    = ride?.shippingAddress?.address || 'Destination';
  const fare    = ride?.totalPrice || 0;
  const customer = ride?.user;
  const otp     = ride?.rideMetadata?.otp;
  const handleAction = async (action, otpVal) => {
    setActionLoading(true);
    await onAction(ride._id, action, otpVal);
    setActionLoading(false);
  };
  const STATUS_COLOR = {
    'Driver Assigned':       'text-blue-600',
    'Driver Reached Pickup': 'text-orange-600',
    'Ride Started':          'text-emerald-600',
  };
  return (
    <div className="bg-white dark:bg-[#0F1117] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
      {/* Status banner */}
      <div className={`px-6 py-3 flex items-center gap-2 ${
        status === 'Driver Assigned' ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800' :
        status === 'Driver Reached Pickup' ? 'bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800' :
        'bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800'
      }`}>
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          status === 'Driver Assigned' ? 'bg-blue-500' :
          status === 'Driver Reached Pickup' ? 'bg-orange-500' : 'bg-emerald-500'
        }`} />
        <p className={`text-[10px] font-black uppercase tracking-widest ${STATUS_COLOR[status] || 'text-gray-600'}`}>{status}</p>
      </div>
      <div className="p-6 space-y-5">
        {/* Route */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-2">{pickup}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500 rotate-45 mt-1 shrink-0" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-2">{drop}</p>
          </div>
        </div>
        {/* Customer + Fare */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 text-sm">
              {customer?.firstName?.[0] || 'C'}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white">
                {customer?.firstName || 'Customer'} {customer?.lastName || ''}
              </p>
              <p className="text-[10px] text-gray-400 font-bold">{ride?.paymentMethod || 'Cash'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Fare</p>
            <p className="text-xl font-black text-emerald-600">₹{fmt(Math.round(fare))}</p>
          </div>
        </div>
        {/* OTP display (before start) */}
        {status === 'Driver Reached Pickup' && (
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-900">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Ask customer for OTP</p>
            <p className="text-2xl font-black text-blue-700 dark:text-blue-400 tracking-[0.3em]">● ● ● ●</p>
          </div>
        )}
        {/* Action buttons */}
        <div className="space-y-3">
          {status === 'Driver Assigned' && (
            <button
              onClick={() => handleAction('arrive')}
              disabled={actionLoading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <Navigation size={16} />}
              I Have Arrived
            </button>
          )}
          {status === 'Driver Reached Pickup' && (
            <button
              onClick={() => setShowOtpModal(true)}
              disabled={actionLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
              Enter OTP & Start Ride
            </button>
          )}
          {status === 'Ride Started' && (
            <button
              onClick={() => handleAction('complete')}
              disabled={actionLoading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Complete Ride
            </button>
          )}
          {/* Chat & Call */}
          <div className="grid grid-cols-2 gap-3">
            {customer?.mobile && (
              <a
                href={`tel:${customer.mobile}`}
                className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 transition-all"
              >
                <Phone size={14} /> Call
              </a>
            )}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
            >
              <MessageCircle size={14} /> Chat
            </button>
          </div>
        </div>
      </div>
      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-[#0F1117] rounded-[2rem] p-8 w-full max-w-sm space-y-5 border border-white/10"
            >
              <div className="text-center">
                <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Verify OTP</p>
                <p className="text-xs text-gray-400 font-bold mt-1">Enter the 4-digit OTP from the customer</p>
              </div>
              <input
                type="number"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.slice(0, 4))}
                placeholder="_ _ _ _"
                className="w-full text-center text-3xl font-black tracking-[0.5em] bg-gray-100 dark:bg-white/10 border-2 border-transparent focus:border-blue-500 outline-none rounded-2xl py-4 text-gray-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setShowOtpModal(false); setOtpInput(''); }}
                  className="py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl font-black text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleAction('start', otpInput); setShowOtpModal(false); setOtpInput(''); }}
                  disabled={otpInput.length !== 4}
                  className="py-3 bg-blue-600 text-white rounded-xl font-black text-sm disabled:opacity-60"
                >
                  Start Ride
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// ─── Main Dashboard ───────────────────────────────────────────────────────────
const MainDashboard = ({
  user, ctx, isOnline, onToggleOnline, toggleLoading,
  pendingRide, onAccept, onDecline, acceptLoading,
  activeRide, onRideAction,
  rideHistory, onRefresh,
  showTripComplete, lastCompletedRide, onTripDone,
  isChatOpen, setIsChatOpen
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState('overview');
  const todayEarnings = ctx?.todayStats?.earnings || 0;
  const todayTrips    = ctx?.todayStats?.trips || 0;
  const totalRides    = ctx?.allTimeStats?.totalRides || 0;
  const rating        = ctx?.allTimeStats?.rating || 5.0;
  const driver        = ctx?.driver;
  const vehicle       = driver?.activeVehicle;
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-[#060811] text-white font-sans">
      {/* ── Header ── */}
      <div className="bg-[#0C0F1A] border-b border-white/5 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
            {user?.firstName?.[0] || 'D'}
          </div>
          <div>
            <p className="font-black text-white text-sm">{user?.firstName || 'Driver'} {user?.lastName || ''}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {driver?.driverType || 'Ride Partner'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <RefreshCw size={14} className="text-gray-400" />
          </button>
          {/* Online Toggle */}
          <button
            onClick={onToggleOnline}
            disabled={toggleLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-gray-800 border-white/10 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {toggleLoading ? <RefreshCw size={12} className="animate-spin" /> : <Power size={12} />}
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <button onClick={handleLogout} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
      {/* ── Online status alert ── */}
      {!isOnline && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center gap-2">
          <AlertTriangle size={12} className="text-yellow-400 shrink-0" />
          <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
            You are Offline — Go Online to receive ride requests
          </p>
        </div>
      )}
      {/* ── Nav Tabs ── */}
      <div className="flex bg-[#0C0F1A] border-b border-white/5 px-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'active', label: 'Active', icon: Navigation, badge: activeRide ? 1 : 0 },
          { id: 'history', label: 'History', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                view === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={12} />
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-blue-500 rounded-full text-[8px] font-black flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* ── Content ── */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        <AnimatePresence mode="wait">
          {view === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Today Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Today's Earnings", value: `₹${fmt(todayEarnings)}`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: "Today's Trips", value: todayTrips, icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Total Rides', value: totalRides, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Avg Rating', value: rating.toFixed(1), icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-[#0F1117] rounded-2xl p-4 border border-white/5"
                    >
                      <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon size={16} />
                      </div>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
              {/* Vehicle Info */}
              {vehicle && (
                <div className="bg-[#0F1117] rounded-2xl p-5 border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Active Vehicle</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                      {driver?.driverType === 'Bike' ? <Bike size={20} className="text-blue-400" /> :
                       driver?.driverType === 'Logistics Driver' ? <Truck size={20} className="text-blue-400" /> :
                       <Car size={20} className="text-blue-400" />}
                    </div>
                    <div>
                      <p className="font-black text-white">{vehicle.vehicleModel || 'Vehicle'}</p>
                      <p className="text-[10px] text-gray-400 font-bold font-mono">{vehicle.vehicleNumber || vehicle.registrationNumber || '—'}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {/* Active Ride shortcut */}
              {activeRide && (
                <div
                  onClick={() => setView('active')}
                  className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-600/20 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Navigation size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white">Active Ride In Progress</p>
                    <p className="text-[10px] text-blue-400 font-bold">{activeRide.status} · Tap to manage</p>
                  </div>
                  <ChevronRight size={16} className="text-blue-400 shrink-0" />
                </div>
              )}
              {/* High Demand Zones (mock) */}
              <div className="bg-[#0F1117] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={14} className="text-orange-400" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">High Demand Areas</p>
                </div>
                {[
                  { area: 'Airport Terminal', surge: '+₹50', dist: '3.2 km' },
                  { area: 'Railway Station', surge: '+₹30', dist: '1.5 km' },
                  { area: 'Tech Park', surge: '+₹20', dist: '2.8 km' },
                ].map((z) => (
                  <div key={z.area} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs font-black text-white">{z.area}</p>
                      <p className="text-[9px] text-gray-500 font-bold">{z.dist} away</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black rounded-lg border border-orange-500/20">
                      {z.surge}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {view === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {activeRide ? (
                <ActiveRideCard
                  ride={activeRide}
                  onAction={onRideAction}
                  isChatOpen={isChatOpen}
                  setIsChatOpen={setIsChatOpen}
                />
              ) : (
                <div className="bg-[#0F1117] rounded-2xl p-12 border border-white/5 text-center">
                  <Navigation size={40} className="mx-auto mb-4 text-gray-700" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Ride</p>
                  <p className="text-xs text-gray-600 font-bold mt-1">
                    {isOnline ? 'Waiting for a ride request...' : 'Go Online to start receiving rides'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {rideHistory.length === 0 ? (
                <div className="bg-[#0F1117] rounded-2xl p-12 border border-white/5 text-center">
                  <Clock size={40} className="mx-auto mb-4 text-gray-700" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No trips yet</p>
                  <p className="text-xs text-gray-600 font-bold mt-1">Go online to start earning!</p>
                </div>
              ) : (
                rideHistory.slice(0, 20).map(r => {
                  const commission = r.rideMetadata?.commission || r.totalPrice * 0.2;
                  const earned = r.totalPrice - commission;
                  const isCompleted = r.status === 'Completed';
                  return (
                    <div key={r._id} className="bg-[#0F1117] rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-emerald-500/10' : 'bg-red-500/10'
                      }`}>
                        {isCompleted
                          ? <CheckCircle2 size={18} className="text-emerald-400" />
                          : <X size={18} className="text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white line-clamp-1">
                          {r.pickupDetails?.location?.split(',')[0] || 'Pickup'} → {r.shippingAddress?.address?.split(',')[0] || 'Drop'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {r.serviceType || 'Ride'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {isCompleted && <p className="text-sm font-black text-emerald-400">+₹{fmt(Math.round(earned))}</p>}
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{r.status}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ── Trip Complete Overlay ── */}
      <AnimatePresence>
        {showTripComplete && lastCompletedRide && (
          <TripCompleteScreen ride={lastCompletedRide} onDone={onTripDone} />
        )}
      </AnimatePresence>
      {/* ── Pending Ride Popup ── */}
      <AnimatePresence>
        {pendingRide && !activeRide && (
          <PendingRidePopup
            ride={pendingRide}
            onAccept={onAccept}
            onDecline={onDecline}
            loading={acceptLoading}
          />
        )}
      </AnimatePresence>
      {/* ── InAppChat ── */}
      <InAppChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userRole="driver"
        receiverName={activeRide?.user?.firstName || 'Customer'}
        receiverPhone={activeRide?.user?.mobile || ''}
      />
    </div>
  );
};
// ─── Root Component ───────────────────────────────────────────────────────────
const RidePartnerDashboard = () => {
  const navigate = useNavigate();
  const [user]  = useState(() => JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const [ctx,   setCtx]   = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [pendingRide, setPendingRide] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [showTripComplete, setShowTripComplete] = useState(false);
  const [lastCompletedRide, setLastCompletedRide] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const socketRef = useRef(null);
  const pollRef  = useRef(null);
  // ── Bootstrap ──
  const bootstrap = useCallback(async () => {
    try {
      const res = await api.get('/rides/driver/context');
      const data = res.data;
      setCtx(data);
      if (data.hasProfile) {
        setIsOnline(data.driver?.shiftStatus === 'Online');
        // Load current active ride
        const ridesRes = await api.get('/rides/mine');
        const allRides = ridesRes.data || [];
        const active = allRides.find(r =>
          ['Driver Assigned', 'Driver Reached Pickup', 'Ride Started'].includes(r.status)
        );
        setActiveRide(active || null);
        setRideHistory(allRides.filter(r => ['Completed', 'Cancelled'].includes(r.status)));
      }
    } catch (err) {
      toast.error('Could not load dashboard');
    } finally {
      setScreenLoading(false);
    }
  }, []);
  useEffect(() => { bootstrap(); }, [bootstrap]);
  // ── Socket + Poll for pending rides ──
  useEffect(() => {
    if (!isOnline) {
      clearInterval(pollRef.current);
      setPendingRide(null);
      return;
    }
    const pollPending = async () => {
      try {
        const res = await api.get('/rides/pending');
        const rides = res.data || [];
        // Only show if no active ride and not already showing one
        if (rides.length > 0 && !activeRide) {
          setPendingRide(rides[0]);
        } else if (rides.length === 0) {
          setPendingRide(null);
        }
      } catch {}
    };
    pollPending();
    pollRef.current = setInterval(pollPending, 8000);
    return () => clearInterval(pollRef.current);
  }, [isOnline, activeRide]);
  // ── Toggle Online/Offline ──
  const handleToggleOnline = async () => {
    setToggleLoading(true);
    try {
      const newStatus = !isOnline;
      await api.put('/users/driver/status', { isOnline: newStatus });
      setIsOnline(newStatus);
      toast.success(newStatus ? '🟢 You are now Online!' : '🔴 You are now Offline');
      if (!newStatus) setPendingRide(null);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'NO_DRIVER_PROFILE') {
        toast.error('Complete your driver profile first');
        navigate('/driver/onboarding/profile');
      } else if (code === 'DOCS_PENDING') {
        toast.error('Documents pending verification');
      } else if (code === 'VEHICLE_UNASSIGNED') {
        toast.error('No active vehicle assigned');
      } else {
        toast.error(err.response?.data?.message || 'Could not update status');
      }
    }
    setToggleLoading(false);
  };
  // ── Accept Ride ──
  const handleAccept = async () => {
    if (!pendingRide) return;
    setAcceptLoading(true);
    try {
      const { data } = await api.put(`/rides/${pendingRide._id}/accept`);
      setActiveRide(data);
      setPendingRide(null);
      toast.success('Ride accepted! Head to the pickup location.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept ride');
      setPendingRide(null); // Clear stale ride
    }
    setAcceptLoading(false);
  };
  // ── Decline Ride ──
  const handleDecline = () => {
    setPendingRide(null);
  };
  // ── Ride Action (arrive / start / complete) ──
  const handleRideAction = async (rideId, action, otp) => {
    const statusMap = {
      arrive: 'Driver Reached Pickup',
      start: 'Ride Started',
      complete: 'Completed'
    };
    try {
      const { data } = await api.put(`/rides/${rideId}/status`, {
        status: statusMap[action],
        otp
      });
      if (action === 'complete') {
        setLastCompletedRide(data);
        setActiveRide(null);
        setShowTripComplete(true);
        // Refresh context
        const ctxRes = await api.get('/rides/driver/context');
        setCtx(ctxRes.data);
        // Refresh history
        const ridesRes = await api.get('/rides/mine');
        setRideHistory((ridesRes.data || []).filter(r => ['Completed', 'Cancelled'].includes(r.status)));
      } else {
        setActiveRide(data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update ride status');
    }
  };
  // ── Loading ──
  if (screenLoading) {
    return (
      <div className="min-h-screen bg-[#060811] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white font-black uppercase tracking-widest text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <MainDashboard
      user={user}
      ctx={ctx}
      isOnline={isOnline}
      onToggleOnline={handleToggleOnline}
      toggleLoading={toggleLoading}
      pendingRide={pendingRide}
      onAccept={handleAccept}
      onDecline={handleDecline}
      acceptLoading={acceptLoading}
      activeRide={activeRide}
      onRideAction={handleRideAction}
      rideHistory={rideHistory}
      onRefresh={bootstrap}
      showTripComplete={showTripComplete}
      lastCompletedRide={lastCompletedRide}
      onTripDone={() => setShowTripComplete(false)}
      isChatOpen={isChatOpen}
      setIsChatOpen={setIsChatOpen}
    />
  );
};
export default RidePartnerDashboard;
 Description:Full rebuild of RidePartnerDashboard with multi-screen state machine, real-time ride acceptance, active ride management, trip completion, and earnings. ArtifactMetadata:0x22358d290ac8}: json: cannot unmarshal string into Go struct field WriteToFileArgs.ArtifactMetadata of type code.artifactMetadata 
Guidance: You are trying to correct your previous tool call error, you must focus on fixing the failed tool call with sequential tool calls and try again. Do not do parallel tool calls and if you are fixing multiple tool calls, do them one at a time. Do not apologize. 
Retries remaining: 4.
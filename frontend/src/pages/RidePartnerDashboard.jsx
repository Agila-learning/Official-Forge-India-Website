import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, MapPin, Star, CheckCircle2, X, Phone, MessageCircle,
  Navigation, Wallet, Clock, BarChart2, Zap, Shield,
  ChevronRight, Bell, LogOut, RefreshCw, AlertTriangle,
  Check, Power, TrendingUp, User, FileText, CheckCircle, UploadCloud,
  Download, History, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import InAppChat from '../components/ui/InAppChat';

const SOCKET_URL = 'http://localhost:5001';
const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

// ─── Export to Excel helper ──────────────────────────────────────────────────
const exportToExcel = (data, filename) => {
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
};

// ─── Pending Ride Request Popup ───────────────────────────────────────────────
const PendingRidePopup = ({ ride, onAccept, onDecline }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  useEffect(() => {
    if (timeLeft <= 0) { onDecline(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onDecline]);

  const pickup = ride?.pickupDetails?.location || ride?.orderItems?.[0]?.name || 'Pickup';
  const drop   = ride?.shippingAddress?.address || 'Destination';
  const fare   = ride?.totalPrice || 0;
  const type   = ride?.serviceType || 'Ride';

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[300]"
    >
      <div className="bg-[#0F1117] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="h-1 bg-gray-800 relative">
          <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 30, ease: 'linear' }} />
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start text-white">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Request</p>
              <p className="text-xl font-black mt-0.5">{type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-400">₹{fmt(fare)}</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 space-y-2 text-white">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
              <p className="text-sm font-bold line-clamp-1">{pickup.split(',')[0]}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500 rotate-45 mt-1 shrink-0" />
              <p className="text-sm font-bold line-clamp-1">{drop.split(',')[0]}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onDecline} className="flex-1 py-3 bg-white/10 text-white font-black text-sm rounded-2xl">Decline</button>
            <button onClick={onAccept} className="flex-1 py-3 bg-emerald-500 text-white font-black text-sm rounded-2xl">Accept {timeLeft}s</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function RidePartnerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const [activeTab, setActiveTab]         = useState('overview');
  const [isOnline, setIsOnline]           = useState(user?.isOnline || false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [ctx, setCtx]                     = useState(null);
  const [loadingCtx, setLoadingCtx]       = useState(true);
  
  // Custom states
  const [waitingSeconds, setWaitingSeconds] = useState(0);
  const [showChat, setShowChat]           = useState(false);

  // Rides
  const [activeRide, setActiveRide]       = useState(null);
  const [pendingRide, setPendingRide]     = useState(null);
  const [rideHistory, setRideHistory]     = useState([]);

  const loadContext = useCallback(async () => {
    try {
      const { data } = await api.get('/rides/driver/context');
      setCtx(data);
      if (!data.hasProfile) { navigate('/driver/onboarding/1'); return; }
      setIsOnline(data.driver?.shiftStatus === 'Online');
    } catch {
      toast.error('Failed to load driver data');
    } finally {
      setLoadingCtx(false);
    }
  }, [navigate]);

  const loadRideHistory = useCallback(async () => {
    try {
      const { data } = await api.get('/rides/mine');
      const rides = Array.isArray(data) ? data : [];
      setRideHistory(rides.filter(r => r.deliveryPartner?.toString() === user._id?.toString() || r.deliveryPartner === user._id));
      const active = rides.find(r => ['Driver Assigned','Driver Reached Pickup','Ride Started'].includes(r.status));
      if (active) setActiveRide(active);
    } catch {}
  }, [user._id]);

  useEffect(() => { loadContext(); loadRideHistory(); }, [loadContext, loadRideHistory]);

  // Waiting Hours Timer & Pending Rides Polling
  useEffect(() => {
    let timerInterval;
    let pollingInterval;

    if (isOnline && !activeRide) {
      timerInterval = setInterval(() => setWaitingSeconds(s => s + 1), 1000);
      
      const fetchPending = async () => {
        try {
          const { data } = await api.get('/rides/pending');
          if (data && data.length > 0 && !pendingRide) {
            setPendingRide(data[0]);
          }
        } catch (e) {
          console.error("Error fetching pending rides:", e);
        }
      };

      fetchPending();
      pollingInterval = setInterval(fetchPending, 5000);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(pollingInterval);
    };
  }, [isOnline, activeRide, pendingRide]);

  const formatWaitingHours = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const handleToggleOnline = async () => {
    setTogglingOnline(true);
    try {
      if (!isOnline) {
        toast.loading('Fetching GPS Location...', { id: 'gps' });
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                await api.put('/rides/driver/location', { lat: pos.coords.latitude, lng: pos.coords.longitude });
                resolve();
              } catch(e) { reject(e); }
            },
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
        toast.dismiss('gps');
      }
      
      await api.put('/users/driver/status', { isOnline: !isOnline });
      setIsOnline(p => !p);
      toast.success(!isOnline ? '🟢 You are now Online!' : '🔴 Gone Offline');
    } catch (err) {
      toast.dismiss('gps');
      toast.error(err.message || 'Failed to go online/offline');
    } finally {
      setTogglingOnline(false);
    }
  };

  const handleAcceptRide = async () => {
    if (!pendingRide) return;
    try {
      const { data } = await api.put(`/rides/${pendingRide._id}/accept`);
      setActiveRide(data);
      setPendingRide(null);
      setActiveTab('taxi-trips');
      toast.success('🎉 Ride accepted! Head to pickup location.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept ride');
      setPendingRide(null);
    }
  };

  const [otpInput, setOtpInput] = useState('');
  const handleUpdateStatus = async (status) => {
    if (!activeRide) return;
    try {
      const payload = { status };
      if (status === 'Ride Started') {
        if (!otpInput || otpInput.length < 4) { toast.error('Enter the 4-digit OTP from the customer'); return; }
        payload.otp = otpInput;
      }
      const { data } = await api.put(`/rides/${activeRide._id}/status`, payload);
      setActiveRide(data);
      if (status === 'Completed') {
        setActiveRide(null);
        toast.success('Trip completed! Earnings updated.');
        loadContext();
        loadRideHistory();
      } else {
        toast.success(`Status updated: ${status}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const switchVehicle = async (vehicleId) => {
    try {
      await api.put('/users/driver/onboarding', { step: 'vehicle-switch', vehicleId });
      toast.success('Active vehicle switched successfully');
      loadContext();
    } catch {
      toast.error('Failed to switch vehicle');
    }
  };

  // ── Render Helpers ──
  const renderOverview = () => {
    const todayEarnings = ctx?.todayStats?.earnings || 0;
    const todayTrips    = ctx?.todayStats?.trips || 0;
    const completedAll  = rideHistory.filter(r => r.status === 'Completed').length;
    const rating        = ctx?.allTimeStats?.rating || 5.0;
    
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isOnline ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-gray-50 text-gray-900 border-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10'}`}>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">{isOnline ? 'You are Online' : 'You are Offline'}</h2>
            <p className="text-sm font-bold opacity-80 mt-1">
              {isOnline ? `Online Waiting Time: ${formatWaitingHours(waitingSeconds)}` : 'Toggle to start receiving rides and earning.'}
            </p>
          </div>
          <button
            onClick={handleToggleOnline}
            disabled={togglingOnline || !!activeRide}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isOnline ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-gray-800 text-white'}`}
          >
            <Power size={28} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Earnings", value: `₹${fmt(todayEarnings)}`, icon: Wallet, color: 'text-emerald-500' },
            { label: "Today's Trips",    value: todayTrips,              icon: Navigation, color: 'text-blue-500' },
            { label: "Total Completed",  value: completedAll,            icon: CheckCircle2, color: 'text-purple-500' },
            { label: 'Your Rating',      value: `${rating} ★`,          icon: Star, color: 'text-amber-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-2xl p-5">
              <s.icon size={24} className={s.color + " mb-3"} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderKYC = () => {
    const docs = ctx?.docs;
    const vehicles = ctx?.vehicles || [];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Multi-Vehicle Switcher & Docs</h2>
        </div>
        
        {/* Vehicles Section */}
        <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Select Active Vehicle (Ride / Cab / Taxi / Delivery / Parcel)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map(v => (
              <div key={v._id} className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${ctx?.driver?.activeVehicle?._id === v._id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-primary/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ctx?.driver?.activeVehicle?._id === v._id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                    <Car />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase">{v.vehicleModel}</p>
                    <p className="text-xs font-bold text-gray-500">{v.registrationNumber} • {v.vehicleType || 'Standard'}</p>
                  </div>
                </div>
                {ctx?.driver?.activeVehicle?._id === v._id ? (
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                ) : (
                  <button onClick={() => switchVehicle(v._id)} className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-colors">Switch</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">KYC Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Aadhaar Card', status: docs?.aadhaar?.status || 'Pending' },
              { label: 'PAN Card', status: docs?.pan?.status || 'Pending' },
              { label: 'Driving License', status: docs?.drivingLicense?.status || 'Pending' },
              { label: 'Vehicle RC', status: docs?.vehicleRC?.status || 'Pending' },
            ].map(d => (
              <div key={d.label} className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-gray-400" />
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{d.label}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${d.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-600'}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RIDE_STAGES = [
    { status: 'Driver Assigned',       label: 'En Route to Pickup',    color: 'blue' },
    { status: 'Driver Reached Pickup', label: 'Reached Pickup Point',  color: 'purple' },
    { status: 'Ride Started',          label: 'Ride In Progress',       color: 'orange' },
    { status: 'Completed',             label: 'Trip Completed',         color: 'green' },
  ];

  const renderTrips = () => {
    const stageIdx = activeRide ? RIDE_STAGES.findIndex(s => s.status === activeRide.status) : -1;
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-4">Active Trip Management</h2>
        {activeRide ? (
          <div className="space-y-4">
            {/* Progress Stepper */}
            <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Trip Progress</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-white/10" />
                {RIDE_STAGES.map((stage, i) => {
                  const isDone = i < stageIdx;
                  const isCurrent = i === stageIdx;
                  return (
                    <div key={stage.status} className="flex items-start gap-4 mb-6 last:mb-0 relative">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                        isCurrent ? 'bg-blue-600 border-blue-600 text-white animate-pulse' :
                        'bg-white dark:bg-[#0F1117] border-gray-200 dark:border-white/10 text-gray-400'
                      }`}>
                        {isDone ? <Check size={14}/> : <span className="text-[10px] font-black">{i+1}</span>}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className={`text-sm font-black ${
                          isCurrent ? 'text-blue-600' : isDone ? 'text-emerald-500' : 'text-gray-400'
                        }`}>{stage.label}</p>
                        {isCurrent && <p className="text-[10px] text-gray-400 font-bold mt-0.5">Current Stage</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                  {activeRide.user?.firstName?.[0] || 'C'}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 dark:text-white text-lg">{activeRide.user?.firstName} {activeRide.user?.lastName}</p>
                  <p className="text-xs text-gray-500 font-bold">{activeRide.user?.mobile}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowChat(!showChat)} className={`w-10 h-10 ${showChat?'bg-primary text-white':'bg-blue-500/10 text-blue-600'} rounded-xl flex items-center justify-center transition-colors`}>
                    <MessageCircle size={18}/>
                  </button>
                  {activeRide.user?.mobile && (
                    <a href={`tel:${activeRide.user.mobile}`} className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                      <Phone size={18}/>
                    </a>
                  )}
                </div>
              </div>
              {showChat && (
                <div className="mb-4 border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden h-[300px]">
                  <InAppChat rideId={activeRide._id} currentUserId={user._id} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{activeRide.pickupDetails?.location}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Drop</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{activeRide.shippingAddress?.address}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fare</p>
                  <p className="text-2xl font-black text-emerald-600">₹{fmt(activeRide.totalPrice)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{activeRide.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Stage Action Buttons */}
            <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Driver Actions</h3>
              
              {activeRide.status === 'Driver Assigned' && (
                <button
                  onClick={() => handleUpdateStatus('Driver Reached Pickup')}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={18}/> I've Reached the Pickup Point
                </button>
              )}

              {activeRide.status === 'Driver Reached Pickup' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500">Enter OTP from customer to start trip:</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value.replace(/\D/g,''))}
                      placeholder="_ _ _ _"
                      className="flex-1 px-4 py-3 text-center text-2xl font-black tracking-[0.5em] border-2 border-gray-200 dark:border-white/10 rounded-2xl bg-transparent text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleUpdateStatus('Ride Started')}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-colors"
                    >
                      Start Trip
                    </button>
                  </div>
                </div>
              )}

              {activeRide.status === 'Ride Started' && (
                <button
                  onClick={() => handleUpdateStatus('Completed')}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle size={18}/> Complete Trip & Collect Payment
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-16 text-center">
            <Navigation size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">No Active Trip</h3>
            <p className="text-gray-500 text-sm font-bold mt-2">Toggle online in the Dashboard to receive ride requests.</p>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Ride History & Excel Export</h2>
        <button 
          onClick={() => {
            const data = rideHistory.map(r => ({
              Date: new Date(r.createdAt).toLocaleString('en-IN'),
              Status: r.status,
              Pickup: r.pickupDetails?.location,
              Drop: r.shippingAddress?.address,
              Fare: r.totalPrice,
              PaymentMode: r.paymentMethod
            }));
            exportToExcel(data, `Ride_History_${new Date().toISOString().split('T')[0]}`);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          <Download size={16} /> Download Excel
        </button>
      </div>
      
      {rideHistory.length === 0 ? (
        <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-16 text-center">
          <History size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-black text-gray-900 dark:text-white">No Ride History</h3>
          <p className="text-gray-500 text-sm font-bold mt-2">Completed trips will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rideHistory.map(r => (
            <div key={r._id} className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {r.status === 'Completed' ? <CheckCircle2 size={24} /> : <X size={24} />}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">
                    {r.pickupDetails?.location?.split(',')[0]} → {r.shippingAddress?.address?.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">
                    {new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-base font-black ${r.status === 'Completed' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                  ₹{fmt(r.totalPrice)}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{r.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-4">Pocket Wallet (Cash Collections)</h2>
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <p className="text-sm font-black uppercase tracking-widest text-white/70 mb-2">Total Cash Collected</p>
          <h1 className="text-5xl font-black mb-6">₹{fmt(ctx?.todayStats?.earnings * 0.4 || 0)}</h1>
          <p className="text-xs font-bold text-white/80 max-w-sm">
            This represents the estimated cash (COD) payments you've collected from users. You must settle platform commissions from this wallet.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Recent Cash Settlements</h3>
        <div className="text-center py-10">
          <IndianRupee size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-black text-gray-900 dark:text-white">No Pending Settlements</h3>
          <p className="text-gray-500 text-sm font-bold mt-2">All platform fees have been deducted from your digital wallet balance.</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Generate dummy hour-wise data for the demo based on today's earnings
    const base = ctx?.todayStats?.earnings || 500;
    const hourWise = Array.from({length: 8}).map((_, i) => ({
      Hour: `${9 + i}:00`,
      Earnings: Math.floor((Math.random() * base) / 3)
    }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Earnings Analytics</h2>
          <button 
            onClick={() => exportToExcel(hourWise, `Hour_Wise_Earnings_${new Date().toISOString().split('T')[0]}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            <Download size={16} /> Export Analytics
          </button>
        </div>

        <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-6 mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Hour-Wise Earnings (Today)</h3>
          <div className="space-y-4">
            {hourWise.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <p className="font-black text-gray-900 dark:text-white uppercase">{h.Hour}</p>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (h.Earnings / (base/2)) * 100)}%` }}></div>
                  </div>
                </div>
                <p className="font-black text-emerald-500">₹{fmt(h.Earnings)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-4">Driver Profile</h2>
      <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 bg-gradient-to-tr from-primary to-secondary p-1 rounded-3xl shrink-0">
          <div className="w-full h-full bg-white dark:bg-[#0F1117] rounded-[22px] flex items-center justify-center text-4xl font-black text-primary">
            {user.firstName?.[0]}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{user.firstName} {user.lastName}</h1>
            <p className="text-primary font-bold text-sm tracking-widest uppercase mt-1">{ctx?.driver?.driverType || 'Driver'}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
              {user.mobile}
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <span className="px-4 py-2 bg-emerald-500/10 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-500">
              Verified Partner
            </span>
          </div>
        </div>
      </div>
    </div>
  );


  if (loadingCtx) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} role="Ride Partner" themeColor="primary" activeVehicleOverride={ctx?.driver?.driverType}>
      <AnimatePresence>
        {pendingRide && !activeRide && (
          <PendingRidePopup ride={pendingRide} onAccept={handleAcceptRide} onDecline={() => setPendingRide(null)} />
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto pb-24">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'kyc' && renderKYC()}
        {(activeTab === 'taxi-trips' || activeTab === 'bike-rides' || activeTab === 'auto-requests' || activeTab === 'parcel-delivery' || activeTab === 'food-orders' || activeTab === 'shipments' || activeTab === 'pod' || activeTab === 'food-delivery' || activeTab === 'parcel') && renderTrips()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'payouts' && renderWallet()}
        {(activeTab === 'analytics' || activeTab === 'Earnings Analytics') && renderAnalytics()}
        {activeTab === 'profile' && renderProfile()}
        
        {/* Placeholder for unhandled tabs */}
        {!['overview', 'kyc', 'taxi-trips', 'bike-rides', 'auto-requests', 'parcel-delivery', 'food-orders', 'history', 'payouts', 'analytics', 'profile', 'shipments', 'pod', 'food-delivery', 'parcel'].includes(activeTab) && (
          <div className="bg-white dark:bg-[#0F1117] border border-gray-100 dark:border-white/5 rounded-3xl p-16 text-center">
            <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h3>
            <p className="text-gray-500 text-sm font-bold mt-2">This section is currently under development.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

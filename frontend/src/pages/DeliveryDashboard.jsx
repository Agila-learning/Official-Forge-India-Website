import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle2, Clock, Package, Navigation, AlertTriangle, 
  TrendingUp, ShieldCheck, Phone, Navigation2, Zap, Battery, AlertCircle, 
  Wrench, LifeBuoy, MessageSquare, Award, Star, Wallet, Activity, Thermometer,
  ShieldAlert
} from 'lucide-react';
import api, { SOCKET_URL, SOCKET_PATH } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';
import { io } from 'socket.io-client';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || 'overview'); 
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const [dashboardStats, setDashboardStats] = useState({});
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  // Mock data for Recharts
  const performanceData = [
    { day: 'Mon', trips: 12 },
    { day: 'Tue', trips: 18 },
    { day: 'Wed', trips: 15 },
    { day: 'Thu', trips: 22 },
    { day: 'Fri', trips: 28 },
    { day: 'Sat', trips: 35 },
    { day: 'Sun', trips: 20 },
  ];

  useEffect(() => {
    fetchOrders();
    
    // Real-time connection
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      path: SOCKET_PATH,
      transports: ['polling', 'websocket'],
    });
    
    socket.on('notification', ({ userId, notification }) => {
      if (userId === userInfo?._id) {
        fetchOrders();
        toast.success(`Priority Alert: ${notification.title}`);
      }
    });

    return () => socket.disconnect();
  }, [userInfo?._id]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      const data = Array.isArray(res.data) ? res.data : [];
      const myOrders = data.filter(o => (o.deliveryPartner?._id || o.deliveryPartner) === userInfo?._id);
      setOrders(myOrders);
      setLoading(false);
    } catch (err) {
      console.warn('Orders fetch failed');
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length >= 0) {
      const completed = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
      setDashboardStats({
        routes: completed,
        avgTime: '38 min',
        fleetStatus: 'Operational',
        rating: '4.9/5'
      });
    }
  }, [orders]);

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profileData = Object.fromEntries(formData.entries());
    try {
      const { data } = await api.put('/users/profile', profileData);
      const updatedInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      toast.success('Identity sync successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed');
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Delivered');
  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered');
  
  const stats = {
    total: orders.length,
    delivered: completedOrders.length,
    pending: activeOrders.length,
    earnings: completedOrders.length * 45 // Mock logic
  };

  const successRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 100;
  const aiScore = Math.min(99, Math.max(80, parseInt(successRate) - 2));

  return (
    <DashboardLayout activeTab={view} setActiveTab={setView} stats={dashboardStats} themeColor="orange-500">
      
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-[#15171A] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">
            {isOnline ? 'Online & Receiving Missions' : 'Offline'}
          </span>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isOnline ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="space-y-10">
        <AnimatePresence mode="wait">
          
          {/* 1. OVERVIEW VIEW */}
          {view === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Earnings Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Today's Earnings</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-4">₹{stats.earnings}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-lg">
                      <TrendingUp size={14} /> +12% vs yesterday
                    </div>
                  </div>
                </div>

                {/* Completed Counter */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Completed</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.delivered} <span className="text-sm text-gray-400 font-bold">missions</span></h3>
                </div>

                {/* Active Orders */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Active Queue</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.pending} <span className="text-sm text-gray-400 font-bold">pending</span></h3>
                </div>

                {/* AI Productivity Score */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                    <Zap size={100} />
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">AI Productivity</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{aiScore}<span className="text-sm text-purple-500 font-bold">/100</span></h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#15171A] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-2">
                    <Activity size={16} className="text-orange-500" /> Weekly Performance
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="trips" stroke="#f97316" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8, fill: '#f97316', stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-white/5" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * successRate) / 100} className="text-green-500 transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black">{successRate}%</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Success</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Delivery Success Rate</h3>
                  <p className="text-xs text-gray-500 font-medium mt-2">You are in the top 5% of fleet operators this week.</p>
                </div>
              </div>

            </motion.div>
          )}

          {/* 2. MISSIONS VIEW */}
          {view === 'missions' && (
            <motion.div key="missions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-orange-500/5 p-6 rounded-[2rem] border border-orange-500/10">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-orange-600 dark:text-orange-400">Active Missions</h3>
                  <p className="text-xs font-bold text-gray-500 mt-1">Real-time tracking enabled</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-[#15171A] px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Live Sync</span>
                </div>
              </div>

              {activeOrders.length > 0 ? activeOrders.map(order => (
                <div key={order._id} className="bg-white dark:bg-[#15171A] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-orange-500/5 transition-all relative overflow-hidden group">
                  {/* Priority Label */}
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-xl z-10">
                    High Priority
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
                          <Package size={24} />
                        </div>
                        <div>
                          <p className="font-black text-lg uppercase tracking-tight">Mission #{order._id.slice(-6)}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Customer: {order.user?.firstName} {order.user?.lastName}</p>
                        </div>
                      </div>

                      {/* Animated Progress Tracker */}
                      <div className="relative pt-4 pl-4 ml-2 border-l-2 border-dashed border-gray-200 dark:border-white/10 space-y-8">
                        <div className="relative">
                          <div className="absolute -left-[23px] w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-[#15171A]"></div>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Pickup Point</p>
                          <p className="text-xs text-gray-500 font-medium mt-1">Vendor Warehouse Hub</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[23px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white dark:border-[#15171A] shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse"></div>
                          <p className="text-xs font-black uppercase tracking-widest text-orange-500">Drop Point</p>
                          <p className="text-xs text-gray-500 font-medium mt-1 max-w-sm">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-72 bg-gray-50 dark:bg-[#1A1D21] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2"><Clock size={14}/> AI Estimated Time</p>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">14 Min</h4>
                        <p className="text-xs font-bold text-gray-500">Distance: 4.2 KM</p>
                      </div>

                      <div className="mt-8 space-y-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(`tel:${order.shippingAddress?.phone || '9999999999'}`)}
                            className="flex-1 py-3 bg-white dark:bg-[#15171A] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors"
                          >
                            <Phone size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                          </button>
                          <button 
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.shippingAddress?.address + ', ' + order.shippingAddress?.city)}`)}
                            className="flex-1 py-3 bg-white dark:bg-[#15171A] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                          >
                            <Navigation2 size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Navigate</span>
                          </button>
                        </div>
                        
                        {/* OTP Section */}
                        <div className="bg-white dark:bg-[#15171A] border border-orange-500/20 rounded-xl p-3 flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Delivery PIN</span>
                          <span className="font-mono font-black text-sm tracking-[0.3em]">4821</span>
                        </div>

                        <button 
                          onClick={async () => {
                            try {
                              await api.put(`/orders/${order._id}/status`, { status: 'Delivered' });
                              toast.success('Mission Accomplished!');
                              fetchOrders();
                            } catch (err) { toast.error('Sync failed'); }
                          }}
                          className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-[0.1em] text-[10px] shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={16} /> Mark Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-24 bg-white dark:bg-[#15171A] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-[#1A1D21] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="text-gray-300 dark:text-gray-600" size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">Fleet Idle</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Awaiting deployment signals</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. FLEET STATUS VIEW */}
          {view === 'fleet' && (
            <motion.div key="fleet" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Fleet <span className="text-orange-500">Diagnostics</span></h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Vehicle Status */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1D21] to-[#0A0B0D] text-white p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-10 right-10 opacity-10">
                    <Truck size={150} />
                  </div>
                  <div className="relative z-10">
                    <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">System Healthy</span>
                    <h2 className="text-4xl font-black tracking-tighter mt-6 mb-2">{userInfo?.vehicleDetails || 'Registered Vehicle'}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">{userInfo?.licenseNumber || 'TN-XX-XXXX'}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Battery className="text-green-400 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Fuel / Charge</p>
                        <p className="text-lg font-black">84%</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Thermometer className="text-orange-400 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Engine Temp</p>
                        <p className="text-lg font-black">Optimal</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Activity className="text-blue-400 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Tire Pressure</p>
                        <p className="text-lg font-black">32 PSI</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Navigation2 className="text-purple-400 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">GPS Signal</p>
                        <p className="text-lg font-black">Strong</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts & Maintenance */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-[#15171A] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2"><AlertCircle size={16}/> Maintenance Alerts</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                        <Wrench className="text-orange-500 shrink-0" size={18} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Scheduled Service</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-bold">Due in 450 KM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <ShieldAlert className="text-red-500 shrink-0" size={18} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400">Insurance Renewal</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-bold">Expires in 12 Days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. SUPPORT (TICKETS) VIEW */}
          {view === 'tickets' && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
              <div className="bg-red-500 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/20 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Emergency SOS</h3>
                  <p className="text-xs font-medium opacity-80">Only use in case of accident or emergency.</p>
                </div>
                <button 
                  onClick={() => toast.error('🚨 SOS Dispatched! Emergency units and fleet managers have been notified.')}
                  className="w-16 h-16 bg-white text-red-500 rounded-full flex items-center justify-center font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl shrink-0"
                >
                  SOS
                </button>
              </div>

              <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm text-center">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Partner Support</h3>
                <p className="text-sm text-gray-500 font-medium mb-8">AI Assistant is online and ready to help.</p>
                
                <button 
                  onClick={() => toast.success('Connecting to Live Dispatch Agent... Please wait.')}
                  className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Start Live Chat
                </button>
              </div>
            </motion.div>
          )}

          {/* 5. PROFILE VIEW */}
          {view === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden bg-white dark:bg-[#15171A]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="flex items-start justify-between relative z-10 mb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-3xl p-1 shadow-xl shadow-orange-500/20">
                        <div className="w-full h-full bg-white dark:bg-[#1A1D21] rounded-[20px] flex items-center justify-center font-black text-3xl text-orange-500 uppercase">
                          {userInfo?.firstName?.[0]}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">{userInfo?.firstName} {userInfo?.lastName}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{userInfo?.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                            <ShieldCheck size={12}/> KYC Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={updateProfile} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                        <input name="firstName" defaultValue={userInfo?.firstName} className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input name="lastName" defaultValue={userInfo?.lastName} className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none font-bold text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                      <input name="mobile" defaultValue={userInfo?.mobile} className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none font-bold text-sm" />
                    </div>
                    <button type="submit" className="px-8 py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all text-xs">Sync Profile Data</button>
                  </form>
                </div>

                <div className="space-y-6">
                  {/* Rating Badge */}
                  <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      <Star fill="currentColor" size={24} />
                      <Star fill="currentColor" size={24} />
                      <Star fill="currentColor" size={24} />
                      <Star fill="currentColor" size={24} />
                      <Star fill="currentColor" size={24} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-1">4.9</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner Rating</p>
                  </div>

                  {/* Wallet */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                    <Wallet className="absolute top-8 right-8 opacity-20" size={64} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Wallet Balance</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6">₹1,240</h3>
                    <button 
                      onClick={() => toast.success('💸 Settlement request of ₹1,240 submitted! Funds will arrive in your registered bank account in 2-4 hours.')}
                      className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/20"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryDashboard;

import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle2, Clock, Package, Navigation, AlertTriangle, Info,
  TrendingUp, ShieldCheck, Phone, Navigation2, Zap, Battery, AlertCircle, 
  Wrench, LifeBuoy, MessageSquare, Award, Star, Wallet, Activity, Thermometer,
  ShieldAlert, Target
} from 'lucide-react';
import api, { SOCKET_URL, SOCKET_PATH } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';
import { io } from 'socket.io-client';
import MembershipUpgradeWidget from '../components/ui/MembershipUpgradeWidget';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import ServiceModeToggle from '../components/driver/ServiceModeToggle';
import DriverCalendar from '../components/driver/DriverCalendar';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [openPool, setOpenPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || 'overview'); 
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const [dashboardStats, setDashboardStats] = useState({});
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [deliveryOtp, setDeliveryOtp] = useState({});
  const [serviceMode, setServiceMode] = useState('Deliveries');

  const handleStatusUpdate = async (orderId, currentStatus) => {
    let nextStatus = '';
    let payload = {};
    if (currentStatus === 'Partner Assigned' || !currentStatus) nextStatus = 'Reached Hub';
    else if (currentStatus === 'Reached Hub') nextStatus = 'Picked Up';
    else if (currentStatus === 'Picked Up') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') {
       if (!deliveryOtp[orderId] || deliveryOtp[orderId].length < 4) return toast.error('Please enter the 4-digit Delivery PIN');
       nextStatus = 'Delivered';
       payload.otp = deliveryOtp[orderId];
    }
    
    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus, ...payload });
      toast.success(`Mission Updated: ${nextStatus}`);
      fetchOrders();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

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

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await api.put('/users/profile', { isOnline: newStatus });
      setIsOnline(newStatus);
      const profileInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      profileInfo.isOnline = newStatus;
      localStorage.setItem('userInfo', JSON.stringify(profileInfo));
      if (newStatus) {
        fetchOrders();
      } else {
        setOpenPool([]); // Clear pool if offline
      }
      toast.success(newStatus ? 'You are now Online' : 'You are now Offline');
    } catch {
      toast.error('Failed to update status');
    }
  };

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
      const [res, profileRes] = await Promise.all([
        api.get('/orders'),
        api.get('/users/profile').catch(() => ({ data: {} }))
      ]);
      const data = Array.isArray(res.data) ? res.data : [];
      setWalletBalance(profileRes.data?.walletBalance || 0);
      const myOrders = data.filter(o => (o.deliveryPartner?._id || o.deliveryPartner) === userInfo?._id);
      const unassigned = data.filter(o => !o.deliveryPartner && (o.fulfillmentType === 'Delivery Partner' || o.orderItems?.some(i => i.category === 'Logistics' || i.name?.includes('Delivery'))));
      
      setOrders(myOrders);
      setOpenPool(unassigned);
      setLoading(false);
    } catch (err) {
      console.warn('Orders fetch failed');
      setOrders([]);
      setOpenPool([]);
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/assign`, { partnerId: userInfo._id });
      toast.success('Mission Accepted!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to accept mission');
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

  const rechargePocket = async () => {
    try {
      const { data } = await api.put('/users/profile', { walletBalance: walletBalance + 500 });
      setWalletBalance(data.walletBalance);
      
      const updatedInfo = { ...userInfo, walletBalance: data.walletBalance };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      
      toast.success('₹500 added to your pocket via demo recharge!');
    } catch (e) {
      toast.error('Recharge failed');
    }
  };

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
      {view === 'profile' && <RoleDashboardProfile user={userInfo} stats={dashboardStats} />}
      
      {view === 'history' && (
        <div className="mt-8">
          <DriverCalendar deliveries={orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status))} rides={[]} />
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <ServiceModeToggle currentMode={serviceMode} onToggle={(mode) => {
          setServiceMode(mode);
          if (mode === 'Rides') window.location.href = '/driver-dashboard';
        }} />
      </div>
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
          onClick={toggleStatus}
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
                {/* Total Deliveries Card */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1">Total Deliveries</p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.delivered}</h3>
                      <span className="text-[10px] font-bold text-green-500 mb-1">+12% &uarr;</span>
                    </div>
                  </div>
                </div>

                {/* Today's Earnings */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-6">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1">Today's Earnings</p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{stats.earnings}</h3>
                      <span className="text-[10px] font-bold text-green-500 mb-1">+8% &uarr;</span>
                    </div>
                  </div>
                </div>

                {/* Customer Rating */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-lg flex items-center justify-center mb-6">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1">Customer Rating</p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white">4.92 <span className="text-sm text-gray-400 font-medium">/ 5.0</span></h3>
                    </div>
                  </div>
                </div>

                {/* On-duty Hours */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm flex flex-col justify-between relative">
                  <div className="absolute top-6 right-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1">On-duty Hours</p>
                    <div className="flex items-end justify-between w-full">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white">6h <span className="text-2xl">45m</span></h3>
                      <span className="text-[10px] font-bold text-gray-400 mb-1">Session</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Delivery Active */}
                <div className="lg:col-span-2 bg-white dark:bg-[#15171A] rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  {activeOrders.length > 0 ? (
                    <>
                      <div className="bg-blue-600 p-4 px-6 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-[11px] font-bold tracking-widest uppercase">Live Delivery Active</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase">Order #{activeOrders[0]._id.slice(-6)}</span>
                      </div>
                      <div className="flex flex-col md:flex-row flex-1">
                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                          <div className="relative pl-6 space-y-8 mt-2">
                            {/* Vertical Line */}
                            <div className="absolute left-1.5 top-2 bottom-6 w-0.5 border-l-2 border-dashed border-gray-200 dark:border-gray-700"></div>
                            
                            <div className="relative">
                              <div className="absolute -left-[27px] top-1 w-4 h-4 bg-white border-2 border-blue-600 rounded-full z-10"></div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pickup</p>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{activeOrders[0].orderItems?.[0]?.product?.vendorId?.businessName || 'Hub / Vendor'}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{activeOrders[0].pickupDetails?.location || activeOrders[0].orderItems?.[0]?.product?.vendorId?.exactLocation || 'N/A'}</p>
                            </div>
                            <div className="relative">
                              <div className="absolute -left-[27px] top-1 w-4 h-4 bg-blue-600 border-2 border-white shadow-sm rounded-full z-10"></div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Drop Off</p>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{activeOrders[0].user?.firstName || 'Customer'}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{activeOrders[0].shippingAddress?.address || activeOrders[0].shippingAddress?.city || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 mt-8">
                            <a href={`tel:${activeOrders[0].shippingAddress?.phone || activeOrders[0].user?.mobile}`} className="flex-1 py-3 text-center bg-blue-50 text-blue-600 rounded-xl font-bold text-[11px] hover:bg-blue-100 transition-colors">
                              Contact Customer
                            </a>
                            <button onClick={() => handleStatusUpdate(activeOrders[0]._id, activeOrders[0].status)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-[11px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                              Update Status
                            </button>
                          </div>
                          {activeOrders[0].status === 'Out for Delivery' && (
                            <div className="mt-4">
                              <input 
                                type="text" 
                                placeholder="Enter 4-digit Delivery PIN" 
                                value={deliveryOtp[activeOrders[0]._id] || ''}
                                onChange={(e) => setDeliveryOtp({...deliveryOtp, [activeOrders[0]._id]: e.target.value})}
                                className="w-full text-center p-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold tracking-[0.5em]"
                                maxLength={4}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 relative min-h-[200px]">
                          {/* Map Background Simulation */}
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                          
                          {/* Route Path overlay */}
                          <svg className="absolute inset-0 w-full h-full p-4" style={{ zIndex: 1 }}>
                            <path d="M 40 180 L 80 120 L 140 80 L 190 40" fill="transparent" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 6" />
                            <circle cx="40" cy="180" r="6" fill="white" stroke="#2563eb" strokeWidth="2" />
                            <circle cx="190" cy="40" r="8" fill="#2563eb" />
                            
                            <rect x="130" y="160" width="80" height="30" rx="8" fill="white" />
                            <text x="140" y="174" fill="#64748b" fontSize="8" fontWeight="bold">STATUS</text>
                            <text x="140" y="186" fill="#2563eb" fontSize="10" fontWeight="bold">{activeOrders[0].status}</text>
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 p-10 text-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <Truck size={32} />
                      </div>
                      <h4 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Active Missions</h4>
                      <p className="text-sm text-gray-500 mt-2">You are currently on standby. Pick up orders from the pool below to begin a mission.</p>
                    </div>
                  )}
                </div>

                {/* Weekly Earnings Chart */}
                <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm flex flex-col relative h-full min-h-[350px]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Weekly<br/>Earnings</h3>
                      <p className="text-xs text-gray-500 mt-1">Performance this week</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-center">This<br/>Week</span>
                  </div>
                  
                  {/* Custom CSS Bar Chart */}
                  <div className="flex-1 flex items-end justify-between pt-4 pb-2 relative z-10 px-2 mt-4">
                    {/* Tooltip for today */}
                    <div className="absolute top-0 right-10 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">$185</div>
                    
                    <div className="w-6 h-[60%] bg-blue-100 rounded-t-full"></div>
                    <div className="w-6 h-[40%] bg-blue-100 rounded-t-full"></div>
                    <div className="w-6 h-[70%] bg-blue-100 rounded-t-full"></div>
                    <div className="w-6 h-[50%] bg-blue-100 rounded-t-full"></div>
                    <div className="w-6 h-[90%] bg-blue-600 rounded-t-full"></div> {/* Today */}
                    <div className="w-6 h-[10%] bg-gray-100 rounded-t-full"></div>
                    <div className="w-6 h-[10%] bg-gray-100 rounded-t-full"></div>
                  </div>
                  
                  <div className="flex justify-between px-3 pb-4">
                     <span className="text-[9px] font-bold text-gray-400">MON</span>
                     <span className="text-[9px] font-bold text-gray-400">TUE</span>
                     <span className="text-[9px] font-bold text-gray-400">WED</span>
                     <span className="text-[9px] font-bold text-gray-400">THU</span>
                     <span className="text-[9px] font-bold text-blue-600">FRI</span>
                     <span className="text-[9px] font-bold text-gray-300">SAT</span>
                     <span className="text-[9px] font-bold text-gray-300">SUN</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                           <TrendingUp size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-green-500">+15% <span className="text-gray-400 font-normal">vs last week</span></span>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Target</p>
                       <p className="text-sm font-black text-gray-900 dark:text-white">$800.00</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Recent Deliveries List */}
              <div className="bg-white dark:bg-[#15171A] rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Deliveries</h3>
                  <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700">View All</button>
                </div>
                
                <div className="space-y-4">
                  {completedOrders.slice(0, 4).map(order => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{order.orderItems?.[0]?.name || 'Logistics Mission'}</h4>
                          <p className="text-[11px] text-gray-500">2.4 km • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-black text-gray-900 dark:text-white">₹{order.totalPrice}</p>
                          <p className="text-[10px] text-gray-500">+₹0 Tip</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                  {completedOrders.length === 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center">
                          <Info size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">No recent deliveries</h4>
                        </div>
                      </div>
                    </div>
                  )}
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
              
              {activeOrders.length > 0 ? activeOrders.map(order => {
                
                // Determine the correct CTA button text based on status
                let ctaText = 'Confirm Arrival at Hub';
                let btnColor = 'bg-blue-600 hover:bg-blue-700';
                if (order.status === 'Reached Hub') { ctaText = 'Confirm Pickup'; btnColor = 'bg-orange-500 hover:bg-orange-600'; }
                if (order.status === 'Picked Up') { ctaText = 'Start Route to Customer'; btnColor = 'bg-indigo-600 hover:bg-indigo-700'; }
                if (order.status === 'Out for Delivery') { ctaText = 'Finalize Delivery'; btnColor = 'bg-green-600 hover:bg-green-700'; }

                return (
                  <div key={order._id} className="flex flex-col lg:flex-row bg-white dark:bg-[#15171A] rounded-[3rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 mb-8">
                    
                    {/* Mission Details (Left Side) */}
                    <div className="w-full lg:w-1/3 p-8 flex flex-col justify-between">
                      <div>
                        {/* Status Pill */}
                        <div className="flex justify-between items-start mb-8">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                             order.status === 'Picked Up' || order.status === 'Out for Delivery' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {order.status || 'Assigned'}
                          </span>
                          <span className="text-2xl font-black text-gray-900 dark:text-white">₹{order.totalPrice || 0}</span>
                        </div>
                        
                        {/* Customer Info Box */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1A1D21] rounded-2xl mb-8 border border-gray-100 dark:border-gray-800">
                           <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shrink-0">
                             <span className="text-white font-black text-xl">{order.shippingAddress?.fullName?.[0] || 'C'}</span>
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="text-lg font-black text-gray-900 dark:text-white truncate">{order.shippingAddress?.fullName || 'Customer'}</h4>
                             <div className="flex items-center gap-1 text-gray-400 mt-1">
                                <MapPin size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">{order.shippingAddress?.city || 'City'}</span>
                             </div>
                           </div>
                           <button onClick={() => window.open(`tel:${order.shippingAddress?.phone || '9999999999'}`)} className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shrink-0">
                             <Phone size={18} />
                           </button>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-6 space-y-8 border-l-2 border-gray-100 dark:border-gray-800 mb-8 ml-2">
                          <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-[#15171A]"></div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup (Hub)</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white">Central Logistics Hub</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-4 h-4 bg-orange-500 rounded-full border-4 border-white dark:border-[#15171A]"></div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Drop-off</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{order.shippingAddress?.address || 'Destination'}</p>
                          </div>
                        </div>

                        {/* OTP Input for Delivery */}
                        {order.status === 'Out for Delivery' && (
                          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-3">Customer PIN Required</span>
                            <input 
                              type="text" 
                              maxLength="4"
                              placeholder="----"
                              className="w-32 bg-white dark:bg-[#1A1D21] border border-gray-200 dark:border-gray-700 rounded-xl text-center font-mono font-black text-2xl py-3 outline-none focus:border-blue-500 shadow-inner mx-auto block"
                              value={deliveryOtp[order._id] || ''}
                              onChange={(e) => setDeliveryOtp({...deliveryOtp, [order._id]: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="space-y-4">
                         <button 
                           onClick={() => handleStatusUpdate(order._id, order.status)}
                           className={`w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 ${btnColor}`}
                         >
                           {ctaText} <Navigation size={16} />
                         </button>
                      </div>
                    </div>

                    {/* Interactive Google Map Embed (Right Side) */}
                    <div className="w-full lg:w-2/3 h-[400px] lg:h-auto relative bg-[#F8FAFC] dark:bg-[#1A1D21]">
                      {order.shippingAddress ? (
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(order.shippingAddress.address + ', ' + order.shippingAddress.city)}&output=embed`}
                          allowFullScreen
                          title="Delivery Location"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Map Data Unavailable</p>
                        </div>
                      )}
                      
                      {/* ETA Floating Box */}
                      <div className="absolute top-6 left-6 right-6 lg:right-auto flex">
                         <div className="bg-white/95 dark:bg-black/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-5 border border-gray-100 dark:border-gray-800">
                           <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                              <Navigation2 size={24} color="white" />
                           </div>
                           <div>
                              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">24 min</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">7.2 km remaining</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-24 bg-white dark:bg-[#15171A] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-[#1A1D21] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="text-gray-300 dark:text-gray-600" size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">Fleet Idle</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Awaiting deployment signals</p>
                </div>
              )}

              {/* OPEN POOL */}
              <div className="flex justify-between items-center bg-primary/5 p-6 rounded-[2rem] border border-primary/10 mt-12">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-primary dark:text-primary">Open Pool</h3>
                  <p className="text-xs font-bold text-gray-500 mt-1">Available logistics missions for self-assignment</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-[#15171A] px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                  <Package size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{openPool?.length || 0} Available</span>
                </div>
              </div>

              {openPool && openPool.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openPool.map(poolOrder => (
                    <div key={poolOrder._id} className="bg-white dark:bg-[#15171A] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order #{poolOrder._id.slice(-6).toUpperCase()}</p>
                          <h4 className="text-lg font-black text-gray-900 dark:text-white mt-1">
                            {poolOrder.orderItems[0]?.name || 'Logistics Mission'}
                          </h4>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          ₹{poolOrder.totalPrice}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {poolOrder.shippingAddress?.address}, {poolOrder.shippingAddress?.city}
                          </p>
                        </div>
                        {poolOrder.instructions && (
                          <div className="flex items-start gap-3">
                            <Info size={16} className="text-gray-400 mt-0.5" />
                            <p className="text-xs font-medium text-gray-500 italic">
                              {poolOrder.instructions}
                            </p>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => acceptOrder(poolOrder._id)}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 transition-colors"
                      >
                        Accept Mission
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white/50 dark:bg-[#15171A]/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 font-medium">No open missions available right now.</p>
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

          {view === 'subscription' && (
            <motion.div key="subscription" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                 <MembershipUpgradeWidget userInfo={userInfo} />
              </div>
            </motion.div>
          )}

          {view === 'kyc' && (
            <motion.div key="kyc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="bg-white dark:bg-[#15171A] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Document <span className="text-orange-500">Verification</span></h3>
                <p className="text-sm text-gray-500 font-bold mb-8">Upload your KYC documents to activate your delivery account fully.</p>
                
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-[#0A0B0D] rounded-2xl border border-gray-100 dark:border-white/5">
                  <ShieldCheck className={userInfo?.kycStatus === 'Verified' ? "text-green-500" : "text-amber-500"} size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</p>
                    <p className={`text-sm font-black uppercase tracking-tighter ${userInfo?.kycStatus === 'Verified' ? 'text-green-600' : 'text-amber-600'}`}>
                      {userInfo?.kycStatus || 'Not Started'}
                    </p>
                  </div>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const docs = [];
                  if (fd.get('panCard')) docs.push({ name: 'PAN Card', url: fd.get('panCard'), type: 'credential' });
                  if (fd.get('drivingLicense')) docs.push({ name: 'Driving License', url: fd.get('drivingLicense'), type: 'credential' });
                  if (fd.get('vehicleRC')) docs.push({ name: 'Vehicle RC', url: fd.get('vehicleRC'), type: 'credential' });
                  if (fd.get('vehicleInsurance')) docs.push({ name: 'Vehicle Insurance', url: fd.get('vehicleInsurance'), type: 'credential' });
                  
                  try {
                    const { data } = await api.put('/users/profile', {
                      profileDocuments: docs,
                      kycStatus: 'Pending',
                      drivingLicense: fd.get('drivingLicense'),
                      vehicleRC: fd.get('vehicleRC'),
                      vehicleInsurance: fd.get('vehicleInsurance')
                    });
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    toast.success('Documents submitted for verification');
                    window.location.reload();
                  } catch(err) {
                    toast.error('Failed to submit documents');
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PAN Card (URL)</label>
                      <input name="panCard" defaultValue={userInfo?.profileDocuments?.find(d => d.name === 'PAN Card')?.url} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Driving License (URL)</label>
                      <input name="drivingLicense" defaultValue={userInfo?.drivingLicense || userInfo?.profileDocuments?.find(d => d.name === 'Driving License')?.url} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle RC (URL)</label>
                      <input name="vehicleRC" defaultValue={userInfo?.vehicleRC || userInfo?.profileDocuments?.find(d => d.name === 'Vehicle RC')?.url} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Insurance (URL)</label>
                      <input name="vehicleInsurance" defaultValue={userInfo?.vehicleInsurance || userInfo?.profileDocuments?.find(d => d.name === 'Vehicle Insurance')?.url} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0B0D] outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all">Submit Documents</button>
                </form>
              </div>
            </motion.div>
          )}

          {/* 7. POCKET VIEW */}
          {view === 'pocket' && (
            <motion.div key="pocket" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-5xl mx-auto">
              
              {/* Pocket Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                  <div className="mb-6 md:mb-0 text-center md:text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Available Balance</p>
                    <h3 className="text-5xl font-black tracking-tighter text-white mb-4">
                      ₹{walletBalance.toFixed(2)}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp size={12}/> {walletBalance >= 0 ? 'Positive Balance' : 'Negative Balance'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button 
                      onClick={rechargePocket}
                      className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      <Wallet size={16} /> Recharge Pocket
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-2 tracking-tight">Online Missions</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    For prepaid missions, 80% of the total order value is instantly credited to your pocket.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-[#15171A] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <Target size={24} />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-2 tracking-tight">Cash Missions</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    For COD missions, you keep 100% of the cash. We deduct our 20% platform fee from your pocket balance. Keep your balance positive to accept cash missions!
                  </p>
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

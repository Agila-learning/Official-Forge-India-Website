import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import EarningsCounter from '../components/driver-modules/EarningsCounter';
import RideRequestCard from '../components/driver-modules/RideRequestCard';
import DriverAchievements from '../components/driver-modules/DriverAchievements';
import OTPVerification from '../components/driver-modules/OTPVerification';
import QuickActionHub from '../components/driver-modules/QuickActionHub';
import DeliveryRoute from '../components/driver-modules/DeliveryRoute';
import EarningsAnalytics from '../components/driver-modules/EarningsAnalytics';
import DriverWallet from '../components/driver-modules/DriverWallet';
import DocumentCenter from '../components/driver-modules/DocumentCenter';
import AIDriverAssistant from '../components/driver-modules/AIDriverAssistant';
import VehicleManagement from '../components/driver-modules/VehicleManagement';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import { io } from 'socket.io-client';
import { SOCKET_PATH } from '../services/api';

const UnifiedDriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ todayEarnings: 0, activeOrders: 0, pendingRequests: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  
  const [mockRequest, setMockRequest] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Ref to always have up-to-date isOnline value inside socket callbacks (avoids stale closure)
  const isOnlineRef = useRef(isOnline);
  useEffect(() => { isOnlineRef.current = isOnline; }, [isOnline]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleToggleOnline = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      await api.put('/rides/driver/status', { isOnline: newStatus });
      toast.success(newStatus ? 'You are now Online!' : 'You went Offline.');
      if (socket) {
        socket.emit('driver_status_change', { driverId: userInfo._id, isOnline: newStatus });
      }
    } catch (err) {
      setIsOnline(!isOnline); // revert
      toast.error('Failed to change status');
    }
  };

  
  const handleSimulateOrder = async () => {
    if (!activeVehicle) {
      toast.error('Select an active vehicle first!');
      return;
    }
    if (!isOnline) {
      toast.error('You must go Online to receive orders!');
      return;
    }
    
    try {
      const toastId = toast.loading('Simulating customer request...');
      await api.post('/rides/request', {
        pickup: '12.9716, 77.5946 (MG Road)',
        drop: '12.9850, 77.6000 (Indiranagar)',
        vehicleType: activeVehicle.vehicleCategory,
        fare: Math.floor(Math.random() * 500) + 100,
        paymentMethod: 'Cash',
        womenSafetyMode: false
      });
      toast.success('Customer requested a ride! Check your socket...', { id: toastId });
    } catch (err) {
      toast.error('Simulation failed: ' + (err.response?.data?.message || err.message));
    }
  };


  const handleSwitchVehicle = async (vehicleId) => {
    try {
      const v = vehicles.find(v => v._id === vehicleId);
      if (v) {
        setActiveVehicle(v);
        await api.put('/rides/driver/status', { activeVehicle: vehicleId });
        toast.success(`Switched to ${v.model} (${v.vehicleCategory})`);
      }
    } catch (err) {
      toast.error('Failed to switch vehicle');
    }
  };


  // Socket & Live GPS Sync Setup
  useEffect(() => {
    if (!userInfo._id) return;
    
    // Connect via Vite proxy (same origin) — avoids CORS block
    const socketOrigin = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketOrigin, {
      path: SOCKET_PATH,
      query: { userId: userInfo._id, role: 'driver' },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Driver Dashboard Connected to Live WebSocket Server');
      newSocket.emit('user-online', userInfo._id);
    });

    newSocket.on('new_ride_request', (reqData) => {
      // Use ref to get live isOnline value — avoids stale closure bug
      if (!isOnlineRef.current) return;
      toast('🚖 Incoming Ride Request!', { icon: '🚖', duration: 6000 });
      setMockRequest(reqData);
    });

    // Simulate real GPS location tracking (Bangalore as base)
    const baseLat = 12.9716;
    const baseLng = 77.5946;
    let currentLat = baseLat;
    let currentLng = baseLng;
    
    setDriverLocation([currentLat, currentLng]);

    const locationInterval = setInterval(() => {
      // Small random drift for "live" GPS simulation
      currentLat += (Math.random() - 0.5) * 0.001;
      currentLng += (Math.random() - 0.5) * 0.001;
      setDriverLocation([currentLat, currentLng]);
      
      // Sync with backend DB
      if (activeVehicle) {
        api.put('/rides/driver/location', { lat: currentLat, lng: currentLng, heading: 90 })
          .catch(err => console.log('Location sync error:', err));
        
        // Also emit via socket
        newSocket.emit('location_update', { driverId: userInfo._id, lat: currentLat, lng: currentLng });
      }
    }, 5000);

    return () => {
      clearInterval(locationInterval);
      newSocket.disconnect();
    };
  }, [userInfo._id, activeVehicle, isOnline]);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const { data } = await api.get('/rides/driver/context');
        if (data.hasProfile) {
          setStats({
            todayEarnings: data.todayStats?.earnings || 0,
            activeOrders: data.todayStats?.trips || 0,
            pendingRequests: 0,
            allTimeStats: data.allTimeStats || {}
          });
          if (data.vehicles && data.vehicles.length > 0) {
            setVehicles(data.vehicles);
            setActiveVehicle(data.vehicles[0]);
          }
          if (data.driver && data.driver.isOnline !== undefined) {
            setIsOnline(data.driver.isOnline);
          } else {
            setVehicles([]);
          }
        }
      } catch (err) {
        console.error('Failed to load driver context:', err);
        // Fallback for UI testing if DB is completely empty
        setStats({ todayEarnings: 0, activeOrders: 0, pendingRequests: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchContext();
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      if (data && data.length > 0) {
        setVehicles(data);
      }
    } catch (err) {
      console.log('Vehicles fetch skipped:', err.message);
    }
  };

  const triggerMockRequest = () => {
    setMockRequest({
      _id: `local_${Date.now()}`,
      pickup: 'Hosur Bus Stand, Bangalore',
      dropoff: 'Electronic City Phase 1',
      fare: 350,
      serviceType: activeVehicle?.vehicleCategory || 'Mini'
    });
  };

  const handleQuickAction = (actionId) => {
    if(actionId === 'ai-assistant') {
      setActiveTab('ai-assistant');
    } else {
      setActiveTab(actionId);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <QuickActionHub onNavigate={handleQuickAction} />
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowOTP(true)} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                Simulate Delivery Drop-off
              </button>
              <button onClick={triggerMockRequest} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                Simulate Ride Request
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EarningsCounter value={stats.todayEarnings} label="Today's Earnings" loading={isLoadingStats} />
              <EarningsCounter value={stats.allTimeStats?.totalEarnings || 0} label="Total Earnings" loading={isLoadingStats} />
            </div>
            
            <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-widest">Active Mission Tracking</h2>
                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live GPS
                </span>
              </div>
              <div className="h-[400px] w-full rounded-2xl overflow-hidden relative border border-gray-200 dark:border-gray-700 shadow-inner">
                <DeliveryRoute currentLoc={driverLocation} />
              </div>
            </div>

            <DriverAchievements />
          </div>
        );
      case 'delivery-route':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto h-[600px]">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-gray-900 dark:text-white">
              Active Navigation
            </h2>
            <DeliveryRoute currentLoc={driverLocation} />
          </div>
        );
      case 'earnings':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-gray-900 dark:text-white">
              Earnings Analytics
            </h2>
            <EarningsAnalytics todayEarnings={stats.todayEarnings} />
          </div>
        );
      case 'wallet':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-gray-900 dark:text-white">
              Driver Wallet
            </h2>
            <DriverWallet stats={stats} />
          </div>
        );
      case 'documents':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <DocumentCenter />
          </div>
        );
      case 'ride-requests':
      case 'delivery-requests':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-gray-900 dark:text-white">
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 font-bold uppercase tracking-widest">Searching for requests...</p>
              <button onClick={triggerMockRequest} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                Simulate Incoming Request
              </button>
            </div>
          </div>
        );
      case 'vehicle':
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <VehicleManagement
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onSwitch={handleSwitchVehicle}
              onVehicleAdded={(v) => {
                setVehicles(prev => [...prev, v]);
                if (!activeVehicle) setActiveVehicle(v);
              }}
            />
          </div>
        );
      default:
        return (
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 font-bold uppercase tracking-widest">{activeTab.replace('-', ' ')} module under construction.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      stats={stats}
      themeColor="primary"
      activeVehicleOverride={activeVehicle?.vehicleCategory}
      isOnline={isOnline}
      onToggleOnline={handleToggleOnline}
      vehicles={vehicles}
      activeVehicle={activeVehicle}
      onSwitchVehicle={handleSwitchVehicle}
    >
      <div className="relative min-h-screen pb-32">
        {/* Animated Welcome Header */}
        <div className="px-6 md:px-10 pt-8 pb-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-300">
            {getGreeting()}, <span className="text-blue-600">{userInfo.firstName || 'Partner'}</span> 👋
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-gray-400'}`}></span>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              {isOnline ? 'You are ONLINE and receiving requests' : 'You are currently OFFLINE'}
            </p>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1 ml-6">
            {activeVehicle ? `Operating ${activeVehicle.vehicleCategory} - ${activeVehicle.model}` : 'Standby Mode'}
          </p>
        </div>

        {renderContent()}

        {mockRequest && (
          <RideRequestCard 
            request={mockRequest} 
            onAccept={(req) => {
              toast.success('Mission Accepted!');
              setMockRequest(null);
            }} 
            onDecline={(req) => {
              toast.error('Mission Declined.');
              setMockRequest(null);
            }} 
          />
        )}

        {/* OTP Modal Overlay */}
        <AnimatePresence>
          {showOTP && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowOTP(false)}
              />
              <div className="relative z-10 w-full max-w-sm">
                <OTPVerification 
                  onVerify={() => {
                    setShowOTP(false);
                  }}
                  onCancel={() => setShowOTP(false)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
    
        {/* Development Tool: Simulate Order */}
        {isOnline && (
          <button 
            onClick={handleSimulateOrder}
            className="fixed bottom-24 right-6 z-[9000] bg-indigo-600 text-white px-4 py-2 rounded-full font-black text-xs shadow-xl hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span>📡 Test Real Order</span>
          </button>
        )}

    <AIDriverAssistant />
    </>
  );
};

export default UnifiedDriverDashboard;

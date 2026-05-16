import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageSquare, Star, Shield, 
  Share2, AlertTriangle, Headset, ArrowLeft,
  Navigation, CheckCircle, Clock, Zap, MapPin, 
  Info, CreditCard, ChevronRight, UserCheck
} from 'lucide-react';
import MissionMap from './MissionMap';

const RideTrackingDashboard = ({ order, onBack }) => {
  // Enhanced simulation data if order is incomplete
  const driver = order.deliveryPartner || {
    firstName: 'Arjun',
    lastName: 'Sharma',
    driverStats: { averageRating: 4.9, totalRides: 1240 },
    mobile: '+91 98765 43210',
    vehicleNumber: 'TN 37 BZ 4455',
    vehicleModel: 'White Honda Amaze'
  };

  const stages = [
    { id: 'Driver Assigned', label: 'Authorized', icon: <UserCheck size={18} />, time: '10:30 AM' },
    { id: 'Driver Arriving', label: 'Arriving', icon: <Navigation size={18} />, time: '10:35 AM' },
    { id: 'Ride Started', label: 'In Transit', icon: <Zap size={18} />, time: '10:42 AM' },
    { id: 'Reached Destination', label: 'Objective', icon: <CheckCircle size={18} />, time: 'ETA 11:15 AM' }
  ];

  const currentStatusIndex = stages.findIndex(s => s.id === order.status);
  const activeIndex = currentStatusIndex === -1 ? 1 : currentStatusIndex;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT SECTION: LIVE TACTICAL MAP */}
      <div className="flex-1 relative min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 z-0">
          <MissionMap destination={order.shippingAddress} />
        </div>

        {/* OVERLAYS */}
        <div className="absolute top-8 left-8 z-20">
          <button 
            onClick={onBack}
            className="p-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 hover:scale-105 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Abort View</span>
          </button>
        </div>

        <div className="absolute bottom-8 left-8 z-20">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-premium p-6 rounded-[2.5rem] shadow-2xl border border-white/20 flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
              <Clock className="text-white" size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Time to Objective</p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">14 <span className="text-sm">MINS</span></h4>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SECTION: COMMAND CENTER */}
      <div className="w-full lg:w-[450px] bg-white dark:bg-dark-card border-l border-gray-100 dark:border-gray-800 overflow-y-auto custom-scrollbar p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Ride <span className="text-primary">Intelligence</span></h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Order Ref: #{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center font-black">OTP: 4492</div>
        </div>

        {/* DRIVER CARD */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[3rem] border border-gray-100 dark:border-gray-800 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-200 rounded-3xl overflow-hidden shadow-inner">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.firstName}`} alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black uppercase tracking-tight">{driver.firstName} {driver.lastName}</h4>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                <Star size={12} className="text-orange-500 fill-orange-500" /> {driver.driverStats?.averageRating} · {driver.driverStats?.totalRides} Rides
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${driver.mobile}`} className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 hover:text-primary transition-colors shadow-sm"><Phone size={18} /></a>
                <button className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 hover:text-primary transition-colors shadow-sm"><MessageSquare size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Platform</p>
              <h5 className="font-black text-sm uppercase">{driver.vehicleModel || 'Silver Maruti Swift'}</h5>
            </div>
            <div className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black tracking-widest">{driver.vehicleNumber || 'TN 01 AB 1234'}</div>
          </div>
        </motion.div>

        {/* MISSION TIMELINE */}
        <div className="space-y-6 mb-10">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Operational Status</h5>
          {stages.map((stage, idx) => (
            <div key={idx} className="relative flex items-center gap-6 group">
              {idx < stages.length - 1 && (
                <div className={`absolute left-[22px] top-10 w-[2px] h-12 ${idx < activeIndex ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`} />
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${idx <= activeIndex ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-gray-50 dark:bg-dark-bg text-gray-300'}`}>
                {stage.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-black uppercase tracking-tight transition-colors ${idx <= activeIndex ? 'text-gray-900 dark:text-white' : 'text-gray-300'}`}>{stage.label}</p>
                  <span className="text-[9px] font-bold text-gray-400">{stage.time}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{stage.id}</p>
              </div>
              {idx === activeIndex && (
                <motion.div layoutId="active-glow" className="absolute -inset-2 bg-primary/5 rounded-3xl -z-10 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* FARE & SAFETY */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={18} className="text-primary" />
              <h5 className="text-xs font-black uppercase tracking-widest">Transaction</h5>
            </div>
            <p className="text-2xl font-black">₹{order.totalPrice}</p>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Payment: {order.paymentMethod}</p>
          </div>
          <div className="p-6 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-600/20 cursor-pointer active:scale-95 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={18} />
              <h5 className="text-xs font-black uppercase tracking-widest">Security</h5>
            </div>
            <p className="text-lg font-black uppercase leading-tight">Emergency<br/>SOS Hub</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all">
            <Share2 size={16} /> Share Link
          </button>
          <button className="flex-1 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all">
            <Headset size={16} /> Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideTrackingDashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Car, Bike, MapPin, Navigation, TrendingUp, Settings, 
 Bell, LogOut, Plus, Search, Filter, Clock, 
 ShieldCheck, Star, ChevronRight, LayoutDashboard,
 Zap, Wallet, Activity, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

const RidePartnerDashboard = () => {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('overview');
 const [loading, setLoading] = useState(true);
 const [vehicles, setVehicles] = useState([]);
 const [missions, setMissions] = useState([]);
 const [stats, setStats] = useState({
 trips: 0,
 earnings: '₹0',
 rating: 4.9,
 onlineHours: '128h'
 });

 const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));

 useEffect(() => {
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 const orderRes = await api.get('/orders/partner/me');
 setMissions(orderRes.data);

 // Simulated data for vehicles
 setVehicles([
 { id: '1', name: 'Tesla Model 3', type: 'Car', plate: 'KA-01-FIC-1', status: 'Online', battery: '85%' },
 { id: '2', name: 'Ather 450X', type: 'Bike', plate: 'KA-01-FIC-2', status: 'Charging', battery: '42%' },
 ]);

 setStats({
   trips: orderRes.data.length,
   earnings: '₹' + orderRes.data.filter(o => o.isDelivered).reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString(),
   rating: 4.9,
   onlineHours: '128h'
 });

 setLoading(false);
 } catch (err) {
 toast.error('Failed to sync with ride network');
 setLoading(false);
 }
 };

 return (
 <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} role="Ride Partner">
 <div className="space-y-12">
 
 {/* --- 🛸 MISSION CONTROL HEADER --- */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 border border-orange-500/20"
 >
 <Compass size={14} /> Ride Mission Control
 </motion.div>
 <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
 Ride <span className="text-orange-500">Dynamics.</span>
 </h1>
 </div>
 <div className="flex items-center gap-4">
 <button className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2">
 <Plus size={16} /> Deploy New Vehicle
 </button>
 </div>
 </div>

 {/* --- 📊 TELEMETRY STATS --- */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Total Missions', value: stats.trips, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
 { label: 'Fleet Earnings', value: stats.earnings, icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10' },
 { label: 'Pilot Rating', value: stats.rating, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
 { label: 'Duty Cycle', value: stats.onlineHours, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 ].map((stat, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-orange-500/30 transition-all"
 >
 <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
 <stat.icon size={24} />
 </div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</h3>
 </motion.div>
 ))}
 </div>

 {/* --- 🚗 FLEET COMMAND --- */}
 <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
 <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Fleet Synchronization</h3>
 <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
 <ShieldCheck size={14} /> Fleet Verified
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 dark:bg-dark-bg/50">
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle Unit</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identification</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Telemetry</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
 {vehicles.map((v) => (
 <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
 <td className="px-10 py-8">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 font-black">
 {v.type === 'Car' ? <Car size={24} /> : <Bike size={24} />}
 </div>
 <div>
 <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{v.name}</p>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
 {v.type} Unit
 </p>
 </div>
 </div>
 </td>
 <td className="px-10 py-8 font-mono font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">{v.plate}</td>
 <td className="px-10 py-8">
 <div className="flex flex-col">
 <p className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
 <Zap size={14} className="text-yellow-500" /> {v.battery}
 </p>
 <div className="w-24 h-1.5 bg-gray-100 dark:bg-dark-bg rounded-full mt-2 overflow-hidden">
 <div className={`h-full ${parseInt(v.battery) > 50 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: v.battery }} />
 </div>
 </div>
 </td>
 <td className="px-10 py-8">
 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
 v.status === 'Online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
 }`}>
 {v.status}
 </span>
 </td>
 <td className="px-10 py-8 text-right">
 <button className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-gray-400 hover:text-orange-500 transition-all border border-transparent hover:border-orange-500/20">
 <Navigation size={18} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* --- 🗺️ MISSION TRACKER & ANALYTICS --- */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Active Mission Pipeline</h4>
 <div className="space-y-6">
 {missions.map(mission => (
 <div key={mission._id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-orange-500/20 transition-all">
 <div className="flex items-center gap-4 text-left">
 <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 font-black text-orange-500 uppercase">
 <MapPin size={20} />
 </div>
 <div>
 <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{mission.orderItems?.[0]?.name}</p>
 <p className="text-[10px] font-bold text-gray-400 uppercase">#{mission._id.slice(-6).toUpperCase()} • {new Date(mission.createdAt).toLocaleDateString()}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-sm font-black text-orange-500 tracking-tighter">₹{mission.totalPrice?.toLocaleString()}</p>
 <p className={`text-[8px] font-black uppercase mt-1 ${mission.isDelivered ? 'text-green-500' : 'text-orange-500'}`}>
   {mission.isDelivered ? 'Completed' : 'Active'}
 </p>
 </div>
 </div>
 ))}
 {missions.length === 0 && (
   <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No active missions assigned</div>
 )}
 </div>
 </div>
 
 <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
 <div className="relative z-10 flex flex-col h-full justify-between">
 <div>
 <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Pilot <br/>Optimization.</h4>
 <p className="text-white/70 text-sm font-medium leading-relaxed max-w-xs">Maximize your duty cycles with our AI-powered heatmaps. Deploy your units where demand is highest.</p>
 </div>
 <div className="mt-12 flex gap-4">
 <button className="flex-1 py-4 bg-white text-orange-600 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl active:scale-95 transition-all">View Heatmaps</button>
 <button className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/20 active:scale-95 transition-all">Earnings Report</button>
 </div>
 </div>
 </div>
 </div>

 </div>
 </DashboardLayout>
 );
};

export default RidePartnerDashboard;

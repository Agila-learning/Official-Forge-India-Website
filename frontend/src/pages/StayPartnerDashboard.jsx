import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Home, Bed, Users, Calendar, TrendingUp, Settings, 
 Bell, LogOut, Plus, Search, Filter, MapPin, 
 ShieldCheck, Star, Clock, ChevronRight, LayoutDashboard,
 Building, UserCheck, MessageSquare, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

const StayPartnerDashboard = () => {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('overview');
 const [loading, setLoading] = useState(true);
 const [properties, setProperties] = useState([]);
 const [stats, setStats] = useState({
 occupancy: '85%',
 revenue: '₹1.2L',
 activeBookings: 12,
 rating: 4.8
 });

 const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));

 useEffect(() => {
 if (user.role !== 'StayPartner' && user.role !== 'Vendor') {
 // Allow Vendors to see this too if they are multi-service
 }
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 // Simulated data for now, would fetch from /stay/my-properties
 setProperties([
 { id: '1', name: 'Ocean View Hotel', type: 'Hotel', rooms: 20, available: 5, price: '₹2,500', status: 'Live', location: 'Goa, India' },
 { id: '2', name: 'Green Valley PG', type: 'PG', rooms: 15, available: 2, price: '₹8,000', status: 'Live', location: 'Bangalore, India' },
 ]);
 setLoading(false);
 } catch (err) {
 toast.error('Failed to sync with stay network');
 setLoading(false);
 }
 };

 return (
 <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} role="Stay Partner">
 <div className="space-y-12">
 
 {/* --- 🚁 MISSION HEADER --- */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 border border-blue-500/20"
 >
 <Building size={14} /> Hospitality Command
 </motion.div>
 <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
 Stay <span className="text-blue-600">Intelligence.</span>
 </h1>
 </div>
 <div className="flex items-center gap-4">
 <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-2">
 <Plus size={16} /> List New Property
 </button>
 </div>
 </div>

 {/* --- 📊 REAL-TIME ANALYTICS --- */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Avg Occupancy', value: stats.occupancy, icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { label: 'Monthly Revenue', value: stats.revenue, icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10' },
 { label: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
 { label: 'Guest Rating', value: stats.rating, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
 ].map((stat, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-blue-500/30 transition-all"
 >
 <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
 <stat.icon size={24} />
 </div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</h3>
 </motion.div>
 ))}
 </div>

 {/* --- 🏨 PROPERTY MANAGEMENT --- */}
 <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
 <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Portfolios</h3>
 <div className="flex gap-2">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input type="text" placeholder="Search property..." className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-dark-bg rounded-xl border border-transparent focus:border-blue-500/30 outline-none text-xs font-bold w-64" />
 </div>
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 dark:bg-dark-bg/50">
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Property Details</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price Point</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
 {properties.map((prop) => (
 <tr key={prop.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
 <td className="px-10 py-8">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 font-black">
 {prop.type === 'Hotel' ? <Building size={24} /> : <Home size={24} />}
 </div>
 <div>
 <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{prop.name}</p>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
 <MapPin size={10} /> {prop.location}
 </p>
 </div>
 </div>
 </td>
 <td className="px-10 py-8">
 <div className="flex flex-col">
 <p className="text-sm font-black text-gray-900 dark:text-white">{prop.rooms - prop.available} / {prop.rooms} Occupied</p>
 <div className="w-32 h-1.5 bg-gray-100 dark:bg-dark-bg rounded-full mt-2 overflow-hidden">
 <div className="h-full bg-blue-600" style={{ width: `${((prop.rooms - prop.available) / prop.rooms) * 100}%` }} />
 </div>
 </div>
 </td>
 <td className="px-10 py-8 font-black text-gray-900 dark:text-white">{prop.price}<span className="text-[10px] text-gray-400 ml-1">/ Night</span></td>
 <td className="px-10 py-8">
 <span className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
 {prop.status}
 </span>
 </td>
 <td className="px-10 py-8 text-right">
 <button className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-500/20">
 <ChevronRight size={18} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* --- 📅 BOOKING CALENDAR PREVIEW --- */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Recent Check-ins</h4>
 <div className="space-y-6">
 {[1, 2, 3].map(i => (
 <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-blue-500/20 transition-all">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 font-black text-primary uppercase">SJ</div>
 <div>
 <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">Sam J.</p>
 <p className="text-[10px] font-bold text-gray-400 uppercase">Premium Suite · Check-out 28 May</p>
 </div>
 </div>
 <button className="px-6 py-2 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all">Manage</button>
 </div>
 ))}
 </div>
 </div>
 
 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
 <div className="relative z-10 flex flex-col h-full justify-between">
 <div>
 <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Strategic <br/>Growth.</h4>
 <p className="text-white/70 text-sm font-medium leading-relaxed max-w-xs">Deploy your property on the global Forge India network and reach 50,000+ verified guests monthly.</p>
 </div>
 <div className="mt-12 flex gap-4">
 <button className="flex-1 py-4 bg-white text-blue-600 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl active:scale-95 transition-all">Optimization Guide</button>
 <button className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/20 active:scale-95 transition-all">Analytics Hub</button>
 </div>
 </div>
 </div>
 </div>

 </div>
 </DashboardLayout>
 );
};

export default StayPartnerDashboard;

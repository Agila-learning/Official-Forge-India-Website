import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Navigation, Clock, ShieldCheck, MapPin, Wallet, Zap, User, Settings, Bell, CheckCircle2, XCircle, ArrowRight, Loader2, Phone } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ServiceProviderDashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
    const [activeTab, setActiveTab] = useState('Overview');
    const [isOnline, setIsOnline] = useState(user.isOnline || false);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking some ride data for now
        setRides([
            { id: '1', user: 'Amit Kumar', from: 'Marthahalli', to: 'Indiranagar', fare: 150, status: 'Completed', time: '2 mins ago' },
            { id: '2', user: 'Priya S', from: 'Koramangala', to: 'HSR Layout', fare: 80, status: 'Pending', time: 'Just now' }
        ]);
        setLoading(false);
    }, []);

    const toggleOnline = async () => {
        try {
            const newStatus = !isOnline;
            await api.put('/users/profile', { isOnline: newStatus });
            setIsOnline(newStatus);
            toast.success(newStatus ? "You are now ONLINE. Searching for rides..." : "You are now OFFLINE.");
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                            Welcome Back, <span className="text-primary italic">{user.firstName}!</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Managing your {user.vehicleType || 'Service'} operations.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-2 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all ${isOnline ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-100 dark:bg-dark-bg text-slate-400'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                        <button 
                            onClick={toggleOnline}
                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                        >
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Today\'s Earnings', value: '₹1,240', icon: Wallet, color: 'text-green-500' },
                        { label: 'Completed Rides', value: '12', icon: Navigation, color: 'text-blue-500' },
                        { label: 'Hours Online', value: '5.2h', icon: Clock, color: 'text-yellow-500' },
                        { label: 'Rating', value: '4.95', icon: ShieldCheck, color: 'text-primary' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl group hover:border-primary transition-all">
                            <stat.icon size={24} className={`${stat.color} mb-4`} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr,2.5fr] gap-10">
                    {/* Sidebar Nav */}
                    <div className="space-y-4">
                        {['Overview', 'Rides', 'Earnings', 'Profile', 'Settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full flex items-center justify-between px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-2xl shadow-primary/30' : 'bg-white dark:bg-dark-card text-slate-400 hover:text-slate-600 dark:hover:text-white border border-slate-100 dark:border-slate-800'}`}
                            >
                                {tab} <ArrowRight size={14} className={activeTab === tab ? 'opacity-100' : 'opacity-0'} />
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="bg-white dark:bg-dark-card rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Overview' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="overview" className="space-y-10">
                                    <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-8">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Recent <span className="text-primary">Activity</span></h2>
                                        <Bell size={20} className="text-slate-400" />
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                                    ) : (
                                        <div className="space-y-6">
                                            {rides.map(ride => (
                                                <div key={ride.id} className="p-8 bg-slate-50 dark:bg-dark-bg rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center shadow-lg">
                                                            <Navigation size={24} className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{ride.user}</h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                <MapPin size={10} /> {ride.from} → {ride.to}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-primary mb-1">₹{ride.fare}</p>
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${ride.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600 animate-pulse'}`}>
                                                            {ride.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'Rides' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="rides" className="text-center py-20">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                        <Navigation size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Ride History</h3>
                                    <p className="text-slate-500 font-medium text-sm">You haven't completed any rides today.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceProviderDashboard;

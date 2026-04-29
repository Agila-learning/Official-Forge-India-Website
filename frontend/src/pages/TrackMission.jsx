import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    CheckCircle, Package, Truck, MapPin, 
    ChevronRight, Clock, ShieldCheck, Star, 
    ArrowLeft, HelpCircle, PhoneCall, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MissionMap from '../components/ui/MissionMap';

const TrackMission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const stages = [
        { id: 'Order Confirmed', label: 'Confirmed', icon: <CheckCircle />, desc: 'Mission authorized' },
        { id: 'Packed', label: 'Packed', icon: <Package />, desc: 'Payload secured' },
        { id: 'In Transit', label: 'In Transit', icon: <Truck />, desc: 'Moving to objective' },
        { id: 'Out for Delivery', label: 'On Approach', icon: <MapPin />, desc: 'Arriving at destination' },
        { id: 'Completed', label: 'Accomplished', icon: <ShieldCheck />, desc: 'Mission successful' }
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                toast.error('Tactical Link Failed: Order status unreachable');
                setLoading(false);
            }
        };
        fetchOrder();
        const interval = setInterval(fetchOrder, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [id]);

    const handleReviewSubmit = async () => {
        try {
            await api.post('/reviews', {
                orderId: order._id,
                productId: order.orderItems[0].product._id, // Simplification: review primary product
                rating,
                comment
            });
            toast.success('Review transmitted to Forge India Hub!');
            setShowReviewModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Review transmission failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <div className="text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Synchronizing Satellite Link...</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-8 text-center">
            <HelpCircle size={64} className="text-gray-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Mission Absent</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Check your credentials or return to hub.</p>
            <button onClick={() => navigate('/candidate/dashboard')} className="mt-10 px-10 py-5 bg-primary text-white font-black rounded-2xl uppercase text-[10px] tracking-widest">Command Dashboard</button>
        </div>
    );

    const currentStageIndex = stages.findIndex(s => s.id === order.status);
    const displayIndex = currentStageIndex === -1 ? (order.isDelivered || order.status === 'Completed' ? 4 : 0) : currentStageIndex;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button onClick={() => navigate(-1)} className="text-primary font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 mb-4 hover:gap-3 transition-all">
                            <ArrowLeft size={14} /> Back to Operations
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic leading-none">Mission <span className="text-primary">Tracker</span></h1>
                        <p className="text-gray-500 font-bold mt-4 uppercase tracking-[0.3em] text-[9px] flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                             Live Status: #{order._id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-card px-8 py-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-5">
                        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Arrival</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {order.orderItems[0]?.slot?.date ? `${order.orderItems[0].slot.date} • ${order.orderItems[0].slot.time.split(' - ')[0]}` : 'Real-time Syncing...'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Progress & Items */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Map View Integration */}
                        {(order.status === 'In Transit' || order.status === 'Out for Delivery') && (
                            <div className="relative group">
                                <MissionMap mission={order} />
                                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl pointer-events-none">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span> Live Satellite Feed
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-dark-card p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-primary/10"></div>
                             
                             <div className="relative">
                                {/* Vertical Progress Bar for Mobile, Horizontal for Desktop? No, vertical is clearer with labels */}
                                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 dark:bg-gray-800 -translate-x-1/2">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(displayIndex / (stages.length - 1)) * 100}%` }}
                                        className="w-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                    />
                                </div>

                                <div className="space-y-12 relative z-10">
                                    {stages.map((stage, index) => {
                                        const isCompleted = index <= displayIndex;
                                        const isCurrent = index === displayIndex;

                                        return (
                                            <div key={stage.id} className="flex gap-10 items-start group">
                                                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 border-4 ${isCompleted ? 'bg-primary text-white border-white dark:border-dark-card shadow-2xl shadow-primary/30 scale-110' : 'bg-white dark:bg-dark-bg text-gray-200 border-gray-50 dark:border-gray-800'}`}>
                                                    {React.cloneElement(stage.icon, { size: 24 })}
                                                </div>
                                                <div className="pt-2">
                                                    <h3 className={`text-base font-black uppercase tracking-tight transition-all duration-500 ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-300'}`}>
                                                        {stage.label}
                                                    </h3>
                                                    <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-1 transition-all duration-500 ${isCurrent ? 'text-primary' : 'text-gray-400 opacity-60'}`}>
                                                        {isCurrent ? 'Active Objective' : stage.desc}
                                                    </p>
                                                    {isCompleted && !isCurrent && (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-xl text-[9px] font-black uppercase tracking-widest"
                                                        >
                                                            <CheckCircle size={12} /> Verified
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                             </div>
                        </div>

                        {/* Order Inventory */}
                        <div className="bg-white dark:bg-dark-card p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Mission <span className="text-primary">Inventory</span></h3>
                                <span className="px-4 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">{order.orderItems.length} Identifiers</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 p-6 bg-gray-50/50 dark:bg-dark-bg/50 rounded-3xl border border-gray-100/50 dark:border-gray-800/50 group hover:border-primary/20 transition-all">
                                        <div className="w-20 h-20 shrink-0 relative overflow-hidden rounded-2xl border-2 border-white dark:border-dark-card shadow-lg">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Unit Value: ₹{item.price}</p>
                                            <div className="mt-3 flex items-center gap-3">
                                                <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-lg">x{item.qty}</span>
                                                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">Total: ₹{item.price * item.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tactical Summary */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Fulfillment Summary */}
                        <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10 space-y-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4 flex items-center gap-2">
                                        <MapPin size={12}/> Target Hub
                                    </p>
                                    <p className="text-sm font-black leading-relaxed uppercase tracking-tight italic">
                                        {order.shippingAddress.address},<br/>
                                        {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Logistics Mode</p>
                                            <p className="text-xs font-black uppercase tracking-tight italic">{order.fulfillmentType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Security Protocol</p>
                                            <p className="text-xs font-black uppercase tracking-tight italic">{order.paymentMethod} Authorized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partner/Support Details */}
                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                    <PhoneCall size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Operational Support</p>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Forge Hotline</h4>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose mb-10">
                                Requesting tactical override or delivery scheduling adjustment? Our command center is active 24/7.
                            </p>
                            <a href="tel:+919363024874" className="w-full py-5 bg-secondary text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 hover:scale-105 transition-all">
                                Establish Link
                            </a>
                        </div>

                        {/* Order Summary & Review Trigger */}
                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                                    <span>Base Value</span>
                                    <span className="text-gray-900 dark:text-white">₹{(order.totalPrice * 0.82).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                                    <span>Tactical Tax (18%)</span>
                                    <span className="text-gray-900 dark:text-white">₹{(order.totalPrice * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-black uppercase text-gray-900 dark:text-white">Mission Total</span>
                                    <span className="text-2xl font-black text-primary tracking-tighter">₹{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Review Section */}
                            {(order.status === 'Completed' || order.status === 'Delivered' || order.isDelivered) ? (
                                <motion.button 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    onClick={() => setShowReviewModal(true)}
                                    className="w-full p-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-[2.5rem] shadow-2xl shadow-amber-500/20 flex items-center justify-between group"
                                >
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-80">Mission Accomplished</p>
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">Rate Your <br/>Experience</h4>
                                    </div>
                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <Star size={32} fill="currentColor" />
                                    </div>
                                </motion.button>
                            ) : (
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                                    <Info className="text-blue-500 shrink-0" size={20} />
                                    <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-relaxed">
                                        Review interface will activate automatically upon successful mission deployment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[4rem] p-12 border border-gray-100 dark:border-gray-800 relative shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
                        >
                            <button onClick={() => setShowReviewModal(false)} className="absolute top-10 right-10 text-gray-400 hover:text-red-500 transition-colors uppercase font-black text-[10px] tracking-widest">Abort Review</button>
                            
                            <div className="text-center">
                                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Star size={48} fill="currentColor" />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">Share Your <span className="text-primary">Intelligence</span></h3>
                                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-12 leading-relaxed">
                                    Your tactical feedback helps refine our service and product protocols.
                                </p>
                                
                                <div className="flex justify-center gap-4 mb-12">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => setRating(s)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${rating >= s ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' : 'bg-gray-50 dark:bg-dark-bg text-gray-300 border border-gray-100 dark:border-gray-800'}`}
                                        >
                                            <Star size={28} fill={rating >= s ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>

                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-8 bg-gray-50 dark:bg-dark-bg border-none rounded-[2rem] font-bold text-sm outline-none mb-10 resize-none shadow-inner min-h-[150px]"
                                    placeholder="Briefly summarize the execution quality and product satisfaction..."
                                />

                                <button 
                                    onClick={handleReviewSubmit}
                                    className="w-full py-6 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Transmit to Hub
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackMission;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
    CheckCircle, Package, Truck, MapPin, 
    ChevronRight, Clock, ShieldCheck, Star, 
    ArrowLeft, HelpCircle, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const stages = [
        { id: 'Placed', label: 'Order Confirmed', icon: <CheckCircle />, desc: 'Order received and verified' },
        { id: 'Packed', label: 'Packed & Ready', icon: <Package />, desc: 'Vendor has secured the items' },
        { id: 'Shipped', label: 'In Transit', icon: <Truck />, desc: 'Package is moving to destination' },
        { id: 'Out for Delivery', label: 'Out for Delivery', icon: <MapPin />, desc: 'Partner is arriving soon' },
        { id: 'Completed', label: 'Delivered', icon: <ShieldCheck />, desc: 'Mission accomplished' }
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                toast.error('Failed to retrieve mission status');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-8 text-center">
            <HelpCircle size={64} className="text-gray-300 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Mission Not Found</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Invalid order sequence identified.</p>
            <Link to="/candidate/dashboard" className="mt-10 px-8 py-4 bg-primary text-white font-black rounded-xl uppercase text-[10px] tracking-widest">Return to Base</Link>
        </div>
    );

    const currentStageIndex = stages.findIndex(s => s.id === order.status) === -1 
        ? (order.status === 'Delivered' ? 4 : 0) 
        : stages.findIndex(s => s.id === order.status);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link to="/candidate/dashboard" className="text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4 hover:gap-3 transition-all">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic">Track <span className="text-primary">Mission</span></h1>
                        <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Completion</p>
                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {order.orderItems[0]?.slot?.date ? `${order.orderItems[0].slot.date} @ ${order.orderItems[0].slot.time.split(' - ')[0]}` : 'Calculating...'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Progress Bar Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                            <div className="relative">
                                {/* Vertical Progress Line */}
                                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 dark:bg-gray-800 -translate-x-1/2">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                                        className="w-full bg-primary"
                                    />
                                </div>

                                <div className="space-y-12 relative z-10">
                                    {stages.map((stage, index) => {
                                        const isCompleted = index <= currentStageIndex;
                                        const isCurrent = index === currentStageIndex;

                                        return (
                                            <div key={stage.id} className="flex gap-10 group">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${isCompleted ? 'bg-primary text-white border-white dark:border-dark-card shadow-xl shadow-primary/20 scale-110' : 'bg-white dark:bg-dark-bg text-gray-300 border-gray-100 dark:border-gray-800 group-hover:border-primary/30'}`}>
                                                    {React.cloneElement(stage.icon, { size: 20 })}
                                                </div>
                                                <div className="pt-1">
                                                    <h3 className={`text-sm font-black uppercase tracking-tight transition-all ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {stage.label}
                                                    </h3>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isCurrent ? 'text-primary' : 'text-gray-500'}`}>
                                                        {isCurrent ? 'Operational Priority' : stage.desc}
                                                    </p>
                                                    {isCompleted && (
                                                        <motion.div 
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                            className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase tracking-widest"
                                                        >
                                                            <CheckCircle size={10} /> Verified
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <h3 className="text-lg font-black uppercase tracking-tighter italic mb-8">Inventory <span className="text-primary">Payload</span></h3>
                            <div className="space-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-white dark:border-dark-card shadow-sm" />
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">QTY: {item.qty} • ₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-8">
                        {/* Fulfillment Info */}
                        <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                            <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Execution <span className="text-white/60">Details</span></h3>
                            
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Destination Hub</p>
                                    <p className="text-xs font-bold leading-relaxed uppercase">
                                        {order.shippingAddress.address},<br/>
                                        {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Fulfillment Mode</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Truck size={14} />
                                        </div>
                                        <p className="text-xs font-black uppercase italic tracking-widest">{order.fulfillmentType}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Payment Authorized</p>
                                    <p className="text-xs font-black uppercase italic tracking-widest">{order.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Partner Support */}
                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Strategic <span className="text-secondary">Support</span></h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                        <PhoneCall size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Handler Hotline</p>
                                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase">+91 93630 24874</p>
                                    </div>
                                </div>
                                <button onClick={() => toast.success('Establishing secure link...')} className="w-full py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                                    Establish Comms
                                </button>
                            </div>
                        </div>

                        {/* Review Call to Action */}
                        {order.status === 'Completed' && (
                            <motion.button 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={() => setShowReviewModal(true)}
                                className="w-full p-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-[2.5rem] shadow-xl shadow-amber-500/20 flex items-center gap-6 group"
                            >
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Star size={28} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1">Feedback Loop</p>
                                    <p className="text-lg font-black uppercase italic tracking-tighter">Rate this <br/>Experience</p>
                                </div>
                                <ChevronRight className="ml-auto group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL PLACEHOLDER */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-dark-card w-full max-w-md rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 relative shadow-3xl"
                        >
                            <button onClick={() => setShowReviewModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 uppercase font-black text-xs">Close</button>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Star size={40} fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Share Your <span className="text-primary">Intelligence</span></h3>
                                <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest mb-8">Rate the shop and delivery partner performance.</p>
                                
                                <div className="flex justify-center gap-2 mb-10">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 text-gray-300 hover:text-amber-500 hover:border-amber-500 transition-all">
                                            <Star size={20} />
                                        </button>
                                    ))}
                                </div>

                                <textarea 
                                    className="w-full p-6 bg-gray-50 dark:bg-dark-bg border-none rounded-2xl font-bold text-sm outline-none mb-8 resize-none shadow-inner"
                                    placeholder="Briefly summarize the execution quality..."
                                    rows="4"
                                />

                                <button 
                                    onClick={() => {
                                        toast.success('Review transmitted to Mission Control!');
                                        setShowReviewModal(false);
                                    }}
                                    className="w-full py-5 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
                                >
                                    Transmit Review
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderTracking;

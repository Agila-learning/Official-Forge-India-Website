import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

const mockBookings = [
    { city: 'Chennai', service: 'Deep Cleaning', time: '2 mins ago', type: 'simulated' },
    { city: 'Bangalore', service: 'Sofa Shampooing', time: '5 mins ago', type: 'simulated' },
    { city: 'Mumbai', service: 'Home Painting', time: '8 mins ago', type: 'simulated' },
    { city: 'Delhi', service: 'Full Sanitation', time: '12 mins ago', type: 'simulated' },
    { city: 'Hyderabad', service: 'Kitchen Deep Clean', time: '15 mins ago', type: 'simulated' },
    { city: 'Pune', service: 'Bathroom Deep Clean', time: '20 mins ago', type: 'simulated' },
];

const LiveActivityToast = () => {
    const [currentBooking, setCurrentBooking] = useState(null);
    const [index, setIndex] = useState(0);
    const [allBookings, setAllBookings] = useState(mockBookings);

    useEffect(() => {
        const fetchRealOrders = async () => {
            try {
                const { data } = await api.get('/orders/activity');
                const realBookings = data.map(order => ({
                    city: order.shippingAddress?.city || 'India',
                    service: order.orderItems?.[0]?.name || 'Home Service',
                    time: 'Just now',
                    isReal: true,
                    type: 'real-time'
                }));
                // Shuffle real and mock bookings
                setAllBookings([...realBookings, ...mockBookings].sort(() => Math.random() - 0.5));
            } catch (err) {
                console.error('Failed to fetch real orders for activity feed');
            }
        };
        fetchRealOrders();
    }, []);

    useEffect(() => {
        if (allBookings.length === 0) return;

        const showNext = () => {
            setCurrentBooking(allBookings[index]);
            setIndex((prev) => (prev + 1) % allBookings.length);
            
            // Wait 5 seconds, then hide
            setTimeout(() => {
                setCurrentBooking(null);
            }, 5000);
        };

        const interval = setInterval(showNext, 40000); // Trigger every 40s for non-intrusive feel
        
        // Initial trigger
        const timeout = setTimeout(showNext, 3000);
        
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [index, allBookings]);

    return (
        <div className="fixed bottom-10 left-10 z-[600] pointer-events-none">
            <AnimatePresence>
                {currentBooking && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9, rotateY: -30 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9, rotateY: 30 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="p-6 bg-white/10 dark:bg-dark-card/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-4xl flex items-center gap-6 max-w-sm pointer-events-auto"
                    >
                        <div className={`w-14 h-14 ${currentBooking.isReal ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'} rounded-2xl flex items-center justify-center shadow-lg transition-colors`}>
                            {currentBooking.isReal ? <ShoppingBag size={24} /> : <Sparkles size={24} />}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                                    {currentBooking.isReal ? 'Live Order Verified' : 'Platform Activity'}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${currentBooking.isReal ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></div>
                            </div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight mt-1">
                                {currentBooking.service} requested in <span className="text-primary italic">{currentBooking.city}</span>
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                                <MapPin size={10} className="text-gray-400" />
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{currentBooking.time}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveActivityToast;

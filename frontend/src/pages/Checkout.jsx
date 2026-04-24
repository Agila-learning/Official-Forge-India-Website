import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Truck, MapPin, CheckCircle, ArrowRight, ShieldCheck, ChevronRight, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation as useUserLocation } from '../context/LocationContext';
import OrderInvoice from '../components/ui/OrderInvoice';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { location: userLocation, getLiveLocation, fetchPincodeByCity } = useUserLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);
    const [pendingOrderDetails, setPendingOrderDetails] = useState(null);
    
    // Logic: If only services, default to Home Service
    const hasPhysicalProducts = cartItems.some(item => !item.isService);
    const initialFulfillment = hasPhysicalProducts ? 'Delivery Partner' : 'Home Service Execution';
    
    const [fulfillmentType, setFulfillmentType] = useState(initialFulfillment);
    const [selectedSlot, setSelectedSlot] = useState({ date: '', time: '' });
    const [address, setAddress] = useState({ 
        address: '', 
        city: '', 
        postalCode: '', 
        country: 'India' 
    });

    // Auto-fetch pincode when city is entered
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (address.city && address.city.length >= 3 && !address.postalCode) {
                const pincode = await fetchPincodeByCity(address.city);
                if (pincode) setAddress(prev => ({ ...prev, postalCode: pincode }));
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [address.city, fetchPincodeByCity]);

    useEffect(() => {
        if (!hasPhysicalProducts && fulfillmentType !== 'Home Service Execution') {
            setFulfillmentType('Home Service Execution');
        }
    }, [hasPhysicalProducts]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Mission Authorization Required: Please Sign In');
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [navigate]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        // Initial pre-fill from profile
        if (userInfo.address || userInfo.city || userInfo.pincode) {
            setAddress(prev => ({
                ...prev,
                address: userInfo.address || prev.address,
                city: userInfo.city || prev.city,
                postalCode: userInfo.pincode || prev.postalCode
            }));
        }

        // GPS override/complement if available
        if (userLocation) {
            setAddress(prev => ({
                ...prev,
                city: prev.city || userLocation.city,
                postalCode: prev.postalCode || userLocation.pincode,
                address: prev.address || userLocation.formatted
            }));
        }
    }, [userLocation]);

    // Removed Razorpay script injection for test mode

    const handlePlaceOrder = async () => {
        if (!cartItems || cartItems.length === 0) {
            toast.error('Requisition/Cart is empty');
            return;
        }
        setLoading(true);
        try {
            // Re-validate token exists just before mission deployment
            const token = localStorage.getItem('token');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!token) {
                toast.error('Tactical Session Expired');
                return navigate('/login');
            }
            
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id,
                    slot: item.slot || selectedSlot, 
                    isService: item.isService,
                    selectedConfig: item.selectedConfig
                })),
                shippingAddress: address,
                paymentMethod: 'Razorpay', 
                totalPrice: cartTotal,
                instructions,
                fulfillmentType
            };

            // 1. Create Order in Backend (Pending status)
            const { data: order } = await api.post('/orders', orderData);
            
            // 2. Mock: Show QR Modal instead of Razorpay
            setPendingOrderDetails(order);
            setShowQRModal(true);
            setLoading(false);

        } catch (err) {
            toast.error(err.response?.data?.message || 'Order creation failed');
            setLoading(false);
        }
    };

    const handleQRConfirm = async () => {
        setShowQRModal(false);
        setLoading(true);
        try {
            // Mock payment verification / update order to Paid
            // For now, we simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCreatedOrder(pendingOrderDetails);
            setStep(4);
            clearCart();
            toast.success('Test Payment Successful! Email receipt simulated.');
        } catch (err) {
            toast.error('Payment Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
            
            {/* TEST MODE QR MODAL */}
            <AnimatePresence>
                {showQRModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 max-w-sm w-full text-center relative"
                    >
                    <button 
                        onClick={() => setShowQRModal(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                        ✕
                    </button>
                    
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="text-primary" size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
                        Secure UPI Payment
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Scan this QR to pay <span className="text-primary font-black">₹{cartTotal.toLocaleString()}</span> and complete your order.
                    </p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
                        <img 
                        src="/registration_qr.png" 
                        alt="UPI QR Code" 
                        className="w-48 h-48 mx-auto rounded-xl shadow-inner"
                        />
                    </div>

                    <button 
                        onClick={handleQRConfirm}
                        className="w-full btn-primary btn-lg flex items-center justify-center gap-2 py-4 rounded-xl font-black"
                    >
                        I have Scanned & Paid <CheckCircle size={18} />
                    </button>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-16 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 -z-10"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-primary text-white shadow-xl shadow-primary/30 border-4 border-white dark:border-dark-bg' : 'bg-white dark:bg-dark-card text-gray-400 border-4 border-gray-100 dark:border-gray-800'}`}>
                            {step > s ? <CheckCircle size={20} /> : s}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-12"
                            >
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                    <Truck className="text-primary" /> 
                                    {hasPhysicalProducts ? 'Logistics & Mode' : 'Execution Details'}
                                </h2>
                                
                                {hasPhysicalProducts ? (
                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <button 
                                            onClick={() => setFulfillmentType('Delivery Partner')}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all ${fulfillmentType === 'Delivery Partner' ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : 'bg-gray-50 dark:bg-dark-bg border-transparent'}`}
                                        >
                                            <Truck size={24} className="mb-4 text-primary" />
                                            <p className="font-black text-xs uppercase tracking-widest">Home Delivery</p>
                                            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Certified Partner</p>
                                        </button>
                                        <button 
                                            onClick={() => setFulfillmentType('Direct Shopping')}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all ${fulfillmentType === 'Direct Shopping' ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : 'bg-gray-50 dark:bg-dark-bg border-transparent'}`}
                                        >
                                            <MapPin size={24} className="mb-4 text-secondary" />
                                            <p className="font-black text-xs uppercase tracking-widest">Shop Pickup</p>
                                            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Self-collection</p>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 mb-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white dark:bg-dark-bg rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Standard Operating Procedure</p>
                                                <h3 className="text-lg font-black uppercase tracking-tight">On-site Execution Protocol</h3>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase">Confirmed: Our delivery/service partner will arrive at your specified location for mission execution. No physical pickup required.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="col-span-2 flex justify-between items-center mb-2 px-1">
                                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Destination Address</label>
                                        <button onClick={getLiveLocation} className="text-[9px] font-black text-primary hover:underline uppercase flex items-center gap-1"><MapPin size={12}/> Sync Live Location</button>
                                    </div>
                                    <div className="col-span-2">
                                        <input value={address.address} onChange={(e) => setAddress({...address, address: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border-none font-bold outline-none" placeholder="123, Forge Street..." />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest pl-1">City Hub</label>
                                        <input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border-none font-bold outline-none" placeholder="Tirupur" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest pl-1">Pincode Vector</label>
                                        <input value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border-none font-bold outline-none" placeholder="641604" />
                                    </div>
                                </div>

                                <button onClick={() => setStep(2)} className="w-full py-6 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                                    Next: Global Schedule <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-12"
                            >
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                    <Truck className="text-primary" /> 
                                    Scheduling & Instructions
                                </h2>

                                <div className="space-y-8 mb-10">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest pl-1 italic">Authorized Execution Window</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                                <input 
                                                    type="date" 
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={selectedSlot.date}
                                                    onChange={(e) => setSelectedSlot({...selectedSlot, date: e.target.value})}
                                                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary transition-all font-bold outline-none"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                                                <select 
                                                    value={selectedSlot.time}
                                                    onChange={(e) => setSelectedSlot({...selectedSlot, time: e.target.value})}
                                                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-secondary transition-all font-bold outline-none appearance-none"
                                                >
                                                    <option value="">Select Time Slot</option>
                                                    <option value="09:00 AM - 12:00 PM">Alpha (09:00 - 12:00)</option>
                                                    <option value="12:00 PM - 03:00 PM">Bravo (12:00 - 15:00)</option>
                                                    <option value="03:00 PM - 06:00 PM">Charlie (15:00 - 18:00)</option>
                                                    <option value="06:00 PM - 09:00 PM">Delta (18:00 - 21:00)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest pl-1 italic">Partner Instructions & Credentials</label>
                                        <textarea 
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            rows="4"
                                            className="w-full px-8 py-6 rounded-3xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary transition-all font-bold outline-none resize-none shadow-inner"
                                            placeholder="Provide landmarks, security clearance details, or specific handler behavior requests..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 py-6 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors">Revision</button>
                                    <button 
                                        onClick={() => {
                                            if (!selectedSlot.date || !selectedSlot.time) return toast.error('Incomplete slot identification');
                                            setStep(3);
                                        }} 
                                        className="flex-[2] py-6 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.3em] text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Financial Protocol <ArrowRight size={20} className="inline ml-2" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 md:p-14"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                        <CreditCard className="text-secondary" /> Final Appraisal
                                    </h2>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Mode</p>
                                        <p className="font-bold text-primary uppercase text-sm italic">{fulfillmentType}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-dark-bg p-10 rounded-[3rem] mb-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-primary/5">
                                    <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory Total</p>
                                            <h4 className="text-2xl font-black italic tracking-tighter">FORGE-INDIA-CONNECT</h4>
                                        </div>
                                        <span className="text-4xl font-black text-primary tracking-tighter">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-3 py-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 dark:text-white">₹{(cartTotal * 0.82).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                                            <span>GST (18%)</span>
                                            <span className="text-gray-900 dark:text-white">₹{(cartTotal * 0.18).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                                            <span>Fulfillment Fee</span>
                                            <span className="text-green-500">Free</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 p-6 rounded-2xl mb-10 flex items-center gap-4 border border-blue-500/20">
                                    <ShieldCheck className="text-blue-500" size={24} />
                                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-relaxed">
                                        Secured by Forge India Payment Gateway. Your transaction is protected with military-grade encryption.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="flex-1 py-6 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-xs">Edit Schedule</button>
                                    <button 
                                        disabled={loading}
                                        onClick={handlePlaceOrder} 
                                        className="flex-[2] py-6 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing Transaction...' : 'Capitalize & Secure Order'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8"
                            >
                                <div className="text-center mb-12">
                                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-green-500/30">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Transaction <span className="text-primary italic">Successful</span></h2>
                                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed max-w-md mx-auto">
                                        Your order has been cryptographically secured and queued for fulfillment. Digital partner assignment is in progress.
                                    </p>
                                </div>

                                <OrderInvoice order={createdOrder} />

                                <div className="mt-12 flex justify-center gap-6">
                                    <button 
                                        onClick={() => navigate('/explore-shop')}
                                        className="px-10 py-5 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-lg"
                                    >
                                        Continue Exploration
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const role = JSON.parse(localStorage.getItem('userInfo') || '{}').role;
                                            if (role === 'Vendor') navigate('/vendor');
                                            else if (role === 'Admin') navigate('/admin');
                                            else navigate('/candidate/dashboard');
                                        }}
                                        className="px-10 py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-110 transition-all flex items-center gap-3"
                                    >
                                        Track in Hub <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

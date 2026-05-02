import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  CreditCard, Truck, MapPin, CheckCircle, ArrowRight, ShieldCheck, 
  ChevronRight, Calendar, Clock, Smartphone, Building2, Zap, 
  Lock, ArrowLeft, Info, HelpCircle, BadgeCheck, ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLocation as useUserLocation } from '../context/LocationContext';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { location: userLocation, getLiveLocation, fetchPincodeByCity } = useUserLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
    const [loadingText, setLoadingText] = useState('Initiating Protocol...');
    
    // Logic: If only services, default to Home Service
    const hasPhysicalProducts = cartItems.some(item => !item.isService);
    const initialFulfillment = hasPhysicalProducts ? 'Delivery Partner' : 'Home Service Execution';
    
    const [fulfillmentType, setFulfillmentType] = useState(initialFulfillment);
    const [selectedSlot, setSelectedSlot] = useState({ date: '', time: '' });
    const [addMembership, setAddMembership] = useState(false);
    const membershipPrice = 999;
    const savings = addMembership ? 1500 : 0; // Psychological trigger
    const [paymentMethod, setPaymentMethod] = useState('GPay');
    const [address, setAddress] = useState({ 
        address: '', 
        city: '', 
        postalCode: '', 
        country: 'India',
        manualEdit: false
    });

    const paymentOptions = [
        { 
            id: 'GPay', 
            name: 'Google Pay', 
            logo: 'https://www.vectorlogo.zone/logos/google_pay/google_pay-icon.svg',
            desc: 'Pay instantly via UPI',
            time: 'Instant'
        },
        { 
            id: 'PhonePe', 
            name: 'PhonePe', 
            logo: 'https://www.vectorlogo.zone/logos/phonepe/phonepe-icon.svg',
            desc: 'Secure UPI payment',
            time: 'Instant'
        },
        { 
            id: 'Paytm', 
            name: 'Paytm', 
            logo: 'https://www.vectorlogo.zone/logos/paytm/paytm-icon.svg',
            desc: 'Wallet or UPI',
            time: 'Instant'
        },
        { 
            id: 'Card', 
            name: 'Credit / Debit Card', 
            icon: <CreditCard className="text-gray-400" />,
            desc: 'Visa, Mastercard, RuPay',
            time: '2-3 mins'
        },
        { 
            id: 'NetBanking', 
            name: 'Net Banking', 
            icon: <Building2 className="text-gray-400" />,
            desc: 'All major Indian banks',
            time: '3-5 mins'
        },
        { 
            id: 'COD', 
            name: 'Cash on Delivery', 
            icon: <Truck className="text-gray-400" />,
            desc: 'Pay after service execution',
            time: 'Variable'
        }
    ];

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
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Session Required: Please Sign In');
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setPaymentStatus('processing');
        setLoadingText('Connecting to Secure Gateway...');
        
        try {
            await new Promise(r => setTimeout(r, 2000));
            setLoadingText('Authenticating Transaction...');
            await new Promise(r => setTimeout(r, 1500));
            
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name, qty: item.qty, image: item.image, price: item.price, product: item._id,
                    slot: item.slot || selectedSlot, isService: item.isService
                })),
                shippingAddress: address,
                paymentMethod,
                totalPrice: addMembership ? cartTotal + membershipPrice : cartTotal,
                fulfillmentType
            };

            await api.post('/orders', orderData);
            
            setPaymentStatus('success');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#10b981', '#f59e0b']
            });
            
            setTimeout(() => {
                clearCart();
                setStep(4);
                setLoading(false);
            }, 2000);
            
        } catch (err) {
            toast.error('Payment Authorization Failed');
            setPaymentStatus('idle');
            setLoading(false);
        }
    };

    const containerVars = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-dark-bg pt-28 pb-20 px-4 md:px-10 lg:px-20">
            
            <AnimatePresence>
                {paymentStatus === 'processing' && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-24 h-24 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                            <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{loadingText}</h2>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Please do not refresh or close this window</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
                {/* 🧾 PAYMENT HEADER */}
                <header className="mb-12 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-500/20 flex items-center gap-1">
                               <ShieldCheck size={12} /> SSL SECURE
                           </span>
                           <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                               256-BIT ENCRYPTION
                           </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Secure <span className="text-blue-600">Checkout</span></h1>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                           All transactions are encrypted & protected by enterprise-grade security.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-gray-100 dark:border-gray-800 pl-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-50 grayscale" alt="Paypal" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 opacity-50 grayscale" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 opacity-50 grayscale" alt="Mastercard" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT SECTION: FLOW */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* STEP INDICATOR */}
                        <div className="flex items-center gap-4 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-dark-card text-gray-400'}`}>
                                        {step > s ? <CheckCircle size={16} /> : s}
                                    </div>
                                    <div className={`h-1 w-12 rounded-full ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    variants={containerVars} initial="hidden" animate="visible" exit="hidden"
                                    className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Logistics & Address</h2>
                                        <button onClick={getLiveLocation} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                                            <MapPin size={14} /> Use Current GPS
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Delivery Protocol</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => setFulfillmentType('Delivery Partner')}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${fulfillmentType === 'Delivery Partner' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 dark:border-gray-800'}`}
                                                >
                                                    <Truck size={20} className={fulfillmentType === 'Delivery Partner' ? 'text-blue-600' : 'text-gray-400'} />
                                                    <p className="font-black text-xs uppercase mt-4">Home Delivery</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Verified Logistics</p>
                                                </button>
                                                <button 
                                                    onClick={() => setFulfillmentType('Direct Shopping')}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${fulfillmentType === 'Direct Shopping' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 dark:border-gray-800'}`}
                                                >
                                                    <Building2 size={20} className={fulfillmentType === 'Direct Shopping' ? 'text-blue-600' : 'text-gray-400'} />
                                                    <p className="font-black text-xs uppercase mt-4">Self Pickup</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Local Hub Protocol</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Secure Address</label>
                                            <textarea 
                                                value={address.address}
                                                onChange={(e) => setAddress({...address, address: e.target.value})}
                                                placeholder="Street Address, Area, Building..."
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm min-h-[100px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">City Hub</label>
                                            <input 
                                                value={address.city}
                                                onChange={(e) => setAddress({...address, city: e.target.value})}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Pincode Vector</label>
                                            <input 
                                                value={address.postalCode}
                                                onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button onClick={() => setStep(2)} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                                        Continue to Schedule <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    variants={containerVars} initial="hidden" animate="visible" exit="hidden"
                                    className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <button onClick={() => setStep(1)} className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl hover:bg-gray-100 transition-colors">
                                            <ArrowLeft size={18} />
                                        </button>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Mission Schedule</h2>
                                    </div>

                                    <div className="space-y-8 mb-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 italic">Execution Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                                                    <input 
                                                        type="date"
                                                        value={selectedSlot.date}
                                                        onChange={(e) => setSelectedSlot({...selectedSlot, date: e.target.value})}
                                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 italic">Time Window</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                                                    <select 
                                                        value={selectedSlot.time}
                                                        onChange={(e) => setSelectedSlot({...selectedSlot, time: e.target.value})}
                                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm appearance-none"
                                                    >
                                                        <option value="">Select Window</option>
                                                        <option value="Morning">Alpha (09:00 - 12:00)</option>
                                                        <option value="Afternoon">Bravo (12:00 - 15:00)</option>
                                                        <option value="Evening">Charlie (15:00 - 18:00)</option>
                                                        <option value="Night">Delta (18:00 - 21:00)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 italic">Agent Instructions</label>
                                            <textarea 
                                                placeholder="Provide landmarks, gate codes, or specific handling requests..."
                                                className="w-full px-8 py-6 rounded-3xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm min-h-[120px] resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        disabled={!selectedSlot.date || !selectedSlot.time}
                                        onClick={() => setStep(3)} 
                                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                                    >
                                        Proceed to Authorization <ShieldCheck size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    variants={containerVars} initial="hidden" animate="visible" exit="hidden"
                                    className="space-y-8"
                                >
                                    {/* 💳 PAYMENT METHOD SECTION */}
                                    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Payment Method</h2>
                                            <div className="flex items-center gap-2 text-green-600 font-black text-[10px]">
                                                <BadgeCheck size={14} /> SECURE GATEWAY ACTIVE
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {paymentOptions.map((opt) => (
                                                <button 
                                                    key={opt.id}
                                                    onClick={() => setPaymentMethod(opt.id)}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${paymentMethod === opt.id ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-12 h-12 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center shadow-sm">
                                                            {opt.logo ? <img src={opt.logo} alt={opt.name} className="h-6 w-6" /> : opt.icon}
                                                        </div>
                                                        {paymentMethod === opt.id && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-blue-600">
                                                                <CheckCircle size={20} fill="currentColor" className="text-white fill-blue-600" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{opt.name}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{opt.desc}</p>
                                                    
                                                    <div className="mt-4 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{opt.time} confirmation</span>
                                                    </div>

                                                    {paymentMethod === opt.id && (
                                                        <motion.div layoutId="glow" className="absolute inset-0 border-2 border-blue-600 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)] pointer-events-none" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 💳 MEMBERSHIP ADD-ON (SMART UX) */}
                                    <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-blue-500 shadow-2xl">
                                                    <Zap size={32} />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Forge Pro Membership</h3>
                                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Unlock Unlimited Benefits for 3 Months</p>
                                                    <div className="flex gap-3 mt-4">
                                                        {['Priority Service', 'Zero Fees', 'Rewards'].map(t => (
                                                            <span key={t} className="text-[8px] font-black text-blue-500 uppercase px-2 py-1 bg-blue-500/10 rounded-md">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-white tracking-tighter italic">₹{membershipPrice}</p>
                                                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">SAVE ₹1,500+</p>
                                                </div>
                                                <button 
                                                    onClick={() => setAddMembership(!addMembership)}
                                                    className={`w-14 h-8 rounded-full transition-all relative ${addMembership ? 'bg-blue-600' : 'bg-white/10'}`}
                                                >
                                                    <motion.div 
                                                        animate={{ x: addMembership ? 24 : 4 }}
                                                        className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-lg"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT SECTION: ORDER SUMMARY (STICKY) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Order Summary</h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="max-h-[240px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                        {cartItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate leading-tight">{item.name}</h5>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Qty: {item.qty} • ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span>₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                        {addMembership && (
                                            <div className="flex justify-between text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                                                <span>Pro Membership</span>
                                                <span>+ ₹{membershipPrice}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Platform Fee</span>
                                            <span className="text-green-500">FREE</span>
                                        </div>
                                        {savings > 0 && (
                                            <div className="flex justify-between text-[11px] font-black text-green-500 uppercase tracking-widest bg-green-500/5 p-2 rounded-lg">
                                                <span className="flex items-center gap-1"><Zap size={10} /> You Saved</span>
                                                <span>₹{savings}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</p>
                                            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">₹{(addMembership ? cartTotal + membershipPrice : cartTotal).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest flex items-center justify-end gap-1">
                                                <ShieldCheck size={10} /> PROTECTED
                                            </p>
                                        </div>
                                    </div>

                                    {step === 3 && (
                                        <button 
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                        >
                                            <Lock size={16} /> Pay Securely Now
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Need Help?</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Direct line: +91 00000 00000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL FLOW */}
            <AnimatePresence>
                {step === 4 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[300] bg-slate-900 flex items-center justify-center p-6"
                    >
                        <div className="max-w-md w-full text-center">
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }} 
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-32 h-32 bg-green-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-white shadow-[0_0_100px_rgba(34,197,94,0.4)]"
                            >
                                <CheckCircle size={64} strokeWidth={3} />
                            </motion.div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-4"
                            >
                                Mission <span className="text-green-500">Success</span>
                            </h2 >
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="text-sm text-white/50 font-bold uppercase tracking-widest mb-12"
                            >
                                Deployment Authorized. Check your terminal/profile for real-time tracking signals.
                            </motion.p>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => navigate('/profile')} className="py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all">Track Order</button>
                                <button onClick={() => navigate('/explore-shop')} className="py-5 bg-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">Continue Mission</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;

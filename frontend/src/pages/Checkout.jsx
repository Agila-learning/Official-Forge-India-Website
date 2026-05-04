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

    // DIGITAL CHECK: Detect if cart contains ONLY digital items (Memberships)
    const isDigitalOnly = cartItems.length > 0 && cartItems.every(item => 
        item.isService && (item.category === 'Membership' || item.isMembership || item.name?.toLowerCase().includes('membership'))
    );

    // If digital only, we skip step 1 and 2 and go straight to 3 (Payment)
    useEffect(() => {
        if (isDigitalOnly && step < 3) {
            setStep(3);
            toast.success('Digital Access: Skipping logistics steps', { icon: '⚡' });
        }
    }, [isDigitalOnly, step]);

    const paymentOptions = [
        { 
            id: 'GPay', 
            name: 'Google Pay', 
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg',
            desc: 'Fast & Secure UPI',
            time: 'Instant'
        },
        { 
            id: 'PhonePe', 
            name: 'PhonePe', 
            logo: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.svg',
            desc: 'Unified Payments Interface',
            time: 'Instant'
        },
        { 
            id: 'Paytm', 
            name: 'Paytm', 
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg',
            desc: 'Digital Wallet & UPI',
            time: 'Instant'
        },
        { 
            id: 'Card', 
            name: 'Credit / Debit Card', 
            logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
            secondaryLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
            desc: 'Visa, Mastercard, RuPay',
            time: 'Secure'
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
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const totalPrice = addMembership ? cartTotal + membershipPrice : cartTotal;

        setLoading(true);
        setPaymentStatus('processing');
        setLoadingText('Connecting to Secure Gateway...');
        
        try {
            // 1. Create Order on Backend
            const { data: rzpOrder } = await api.post('/payments/create-order', {
                amount: totalPrice,
                currency: 'INR',
                receipt: `FIC_${Date.now()}`
            });

            if (!rzpOrder || !rzpOrder.id) {
                throw new Error('Failed to initiate payment protocol');
            }

            setLoadingText('Redirecting to secure payment...');

            // 2. Initialize Razorpay (Mocking successful flow for testing if no key)
            // In production, this would open the Razorpay SDK
            await new Promise(r => setTimeout(r, 2000));
            
            // 3. Process Final Order
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name, qty: item.qty, image: item.image, price: item.price, product: item._id,
                    slot: item.slot || selectedSlot, isService: item.isService
                })),
                shippingAddress: isDigitalOnly ? { address: 'DIGITAL_VAULT', city: 'CLOUD', postalCode: '000000', country: 'India' } : address,
                paymentMethod: `Razorpay (${paymentMethod})`,
                totalPrice,
                fulfillmentType: isDigitalOnly ? 'Instant Activation' : fulfillmentType,
                paymentResult: { id: rzpOrder.id, status: 'Completed' }
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
                if (addMembership || isDigitalOnly) {
                    const updatedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    updatedUserInfo.isMember = true;
                    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                }
                setStep(4);
                setLoading(false);
            }, 2000);
            
        } catch (err) {
            console.error('Payment Error:', err);
            toast.error(err.response?.data?.message || 'Unable to initiate payment. Please try again.');
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
                            {[1, 2, 3].map((s) => {
                                // Skip steps for digital only
                                if (isDigitalOnly && s < 3) return null;
                                return (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-dark-card text-gray-400'}`}>
                                            {step > s ? <CheckCircle size={16} /> : s}
                                        </div>
                                        {s < 3 && <div className={`h-1 w-12 rounded-full ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />}
                                    </div>
                                );
                            })}
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
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                                                {isDigitalOnly ? 'Digital Authorization' : 'Payment Method'}
                                            </h2>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-2 text-green-600 font-black text-[10px]">
                                                    <BadgeCheck size={14} /> SECURE GATEWAY ACTIVE
                                                </div>
                                                {isDigitalOnly && (
                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-1">Instant Digital Activation</span>
                                                )}
                                            </div>
                                        </div>
                                        {isDigitalOnly && (
                                            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                                                <Info className="text-blue-600 shrink-0" size={24} />
                                                <p className="text-xs font-bold text-blue-900 dark:text-blue-200 leading-relaxed uppercase">
                                                    You are purchasing a <span className="text-blue-600 font-black tracking-tight">Digital Membership</span>. No physical delivery is required. Access will be granted immediately upon successful authorization.
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-6 mb-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-500" /> PCI DSS Compliant</div>
                                            <div className="flex items-center gap-2"><Lock size={14} className="text-blue-500" /> 256-bit SSL Encryption</div>
                                            <div className="flex items-center gap-2"><BadgeCheck size={14} className="text-purple-500" /> Razorpay Trusted</div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paymentOptions.map((opt) => (
                                                <button 
                                                    key={opt.id}
                                                    onClick={() => setPaymentMethod(opt.id)}
                                                    className={`p-8 rounded-[2rem] border-2 text-center transition-all relative overflow-hidden group flex flex-col items-center justify-center min-h-[180px] ${paymentMethod === opt.id ? 'border-blue-600 bg-white shadow-2xl scale-[1.02]' : 'border-gray-50 dark:border-gray-800 bg-white/50 dark:bg-dark-bg/50 hover:border-gray-200'}`}
                                                >
                                                    <div className="h-12 flex items-center justify-center mb-6">
                                                        <img src={opt.logo} alt={opt.name} className="max-h-full object-contain" />
                                                        {opt.secondaryLogo && <img src={opt.secondaryLogo} className="max-h-6 ml-2" alt="secondary" />}
                                                    </div>
                                                    
                                                    <h4 className="font-black text-[13px] text-gray-900 dark:text-white uppercase tracking-tight">{opt.name}</h4>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{opt.desc}</p>
                                                    
                                                    <div className={`mt-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${paymentMethod === opt.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        {opt.time}
                                                    </div>

                                                    {paymentMethod === opt.id && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-blue-600">
                                                            <CheckCircle size={24} fill="currentColor" className="text-white fill-blue-600 shadow-xl" />
                                                        </motion.div>
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
                                                          {/* PREMIUM PLAN PREVIEW CARD */}
                                    <div className="bg-gradient-to-br from-indigo-900 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl mb-8">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">FIC PREMIUM MEMBERSHIP</h4>
                                                    <p className="text-2xl font-black italic">₹5,000 <span className="text-sm font-medium opacity-60">/ 30 Days</span></p>
                                                </div>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md">MOST POPULAR</span>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                {['Unlimited Services', 'Up to ₹5,000 Service Value', 'Priority Support', 'Exclusive Member Benefits'].map(benefit => (
                                                    <li key={benefit} className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                                                        <CheckCircle size={12} className="text-yellow-400" /> {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="absolute bottom-4 right-8 opacity-20">
                                                <Zap size={80} strokeWidth={1} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 dark:text-white">₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Platform Fee</span>
                                            <span className="text-green-500 font-black">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Discount</span>
                                            <span className="text-green-500 font-black">- ₹0</span>
                                        </div>
                                    </div>
 
                                    <div className="pt-8 flex justify-between items-end">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</p>
                                            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic">₹{(addMembership ? cartTotal + membershipPrice : cartTotal).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex items-center gap-3">
                                            <ShieldCheck size={20} className="text-green-600" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Secure Payment</p>
                                                <p className="text-[8px] text-gray-500 font-bold uppercase">Your payment information is safe with us.</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                        >
                                            <Lock size={18} /> {isDigitalOnly ? 'ACTIVATE MEMBERSHIP NOW' : 'PAY SECURELY NOW'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Need Help?</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Call: +91 63694 06416 | support@forgeindia.com</p>
                                </div>
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
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="text-sm text-white/50 font-bold uppercase tracking-widest mb-12"
                            >
                                Deployment Authorized. {isDigitalOnly ? 'Your digital assets have been activated in your vault.' : 'Check your terminal/profile for real-time tracking signals.'}
                            </motion.p>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => navigate('/profile')} className="py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all">
                                    {isDigitalOnly ? 'View Vault' : 'Track Order'}
                                </button>
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

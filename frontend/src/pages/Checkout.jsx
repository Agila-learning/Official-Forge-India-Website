import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
 CreditCard, Truck, MapPin, CheckCircle, ArrowRight, ShieldCheck, 
 ChevronRight, Calendar, Clock, Smartphone, Building2, Zap, 
 Lock, ArrowLeft, Info, HelpCircle, BadgeCheck, ShieldAlert,
 Loader2, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLocation as useUserLocation } from '../context/LocationContext';

const Checkout = () => {
 const { cartItems, clearCart } = useCart();
 const navigate = useNavigate();
 const [step, setStep] = useState(1);
 const [loading, setLoading] = useState(false);
 const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, verifying, success
 const [loadingText, setLoadingText] = useState('Initiating Protocol...');
 const [lastOrder, setLastOrder] = useState(null);
 
 const [domain, setDomain] = useState('Banking');
 const [contactDetails, setContactDetails] = useState({ email: '', contactNumber: '' });
 const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: 'India' });
 
 const isPhysicalFlow = cartItems && cartItems.length > 0;
 const cartTotal = isPhysicalFlow ? cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) : 0;
 
 // Determine Pricing
 const baseTotal = isPhysicalFlow ? cartTotal : (domain === 'Banking' ? 2500 : 1500);
 
 const [addMembership, setAddMembership] = useState(false);
 const membershipPrice = 999;
 const paymentMethod = 'Razorpay'; // Only Razorpay now
 const isDigitalOnly = !isPhysicalFlow;

 useEffect(() => {
 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 if (userInfo && userInfo.email) {
 setContactDetails({
 email: userInfo.email || '',
 contactNumber: userInfo.mobile || userInfo.phone || ''
 });
 }
 }, []);

 useEffect(() => {
 const token = localStorage.getItem('token');
 if (!token) {
 toast.error('Session Required: Please Sign In');
 navigate('/login', { state: { from: '/checkout' } });
 }
 }, [navigate]);

 const handlePayment = async () => {
 if (isPhysicalFlow) {
 if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
 toast.error('Please complete shipping address details');
 return;
 }
 }

 if (!contactDetails.email || !contactDetails.contactNumber) {
 toast.error('Please provide Email and Contact Number');
 return;
 }

 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 const totalPrice = addMembership ? baseTotal + membershipPrice : baseTotal;

 setLoading(true);
 setPaymentStatus('processing');
 setLoadingText('Initiating Secure Transaction...');
 
 try {
 // 1. Create Pending Order on Backend
 const orderData = {
 orderItems: isPhysicalFlow ? cartItems : [{
 name: `FIC ${domain} Consulting`,
 qty: 1,
 price: baseTotal,
 image: '/logo.jpg',
 isService: true
 }],
 shippingAddress: isPhysicalFlow ? shippingAddress : { address: 'DIGITAL_VAULT', city: 'CLOUD', postalCode: '000000', country: 'India' },
 paymentMethod: `Razorpay`,
 totalPrice,
 fulfillmentType: isPhysicalFlow ? 'Delivery Partner' : 'Instant Activation',
 instructions: isPhysicalFlow ? 'Handle with care' : `Domain: ${domain}`
 };

 const { data: finalOrder } = await api.post('/orders', orderData);
 setLastOrder(finalOrder);

 // 2. Create Razorpay Order
 const orderIdForPayment = finalOrder._id || finalOrder.id;
 if (!orderIdForPayment) {
 console.error('CRITICAL: Order created but ID missing from response', finalOrder);
 throw new Error('Mission sequence interrupted: Order ID not returned by command center.');
 }

 const { data: rzpOrder } = await api.post('/payments/create-order', {
 orderId: orderIdForPayment,
 receipt: `order_${(orderIdForPayment).toString().slice(-8)}`
 });

 if (!rzpOrder || !rzpOrder.id) {
 throw new Error('Failed to synchronize with payment gateway');
 }

 // 3. Initialize Razorpay Checkout
 const options = {
 key: rzpOrder.keyId,
 amount: rzpOrder.amount,
 currency: rzpOrder.currency,
 name: "Forge India Connect",
 description: `FIC ${domain} Consulting`,
 image: "/logo.jpg",
 order_id: rzpOrder.id,
 handler: async (response) => {
 setLoading(true);
 setPaymentStatus('processing');
 setLoadingText('Verifying Authorization Signature...');
 try {
 const verifyPayload = {
 razorpay_order_id: response.razorpay_order_id,
 razorpay_payment_id: response.razorpay_payment_id,
 razorpay_signature: response.razorpay_signature,
 orderId: finalOrder._id
 };

 await api.post('/payments/verify', verifyPayload);
 
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
 }, 1000);
 } catch (err) {
 toast.error('Signature verification failed. Please contact support.');
 setPaymentStatus('idle');
 setLoading(false);
 }
 },
 prefill: {
 name: `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim() || 'Guest',
 email: contactDetails.email,
 contact: contactDetails.contactNumber
 },
 notes: {
 order_id: finalOrder._id
 },
 theme: { color: "#2563eb" },
 modal: {
 ondismiss: () => {
 setPaymentStatus('idle');
 setLoading(false);
 toast('Transaction Aborted by User', { icon: '🛡️' });
 }
 }
 };

 const rzp = new window.Razorpay(options);
 setLoading(false);
 setPaymentStatus('idle');
 rzp.open();
 
 } catch (err) {
 console.error('Payment Protocol Error:', err);
 toast.error(err.response?.data?.message || 'Gateway Operational Failure');
 setPaymentStatus('idle');
 setLoading(false);
 }
 };

 const handleDownloadInvoice = () => {
 window.print();
 };

 const handleShareInvoice = (platform) => {
 const text = `Invoice for Order #${lastOrder?._id?.slice(-8) || 'FIC-ORDER'}. Total: ₹${(addMembership ? baseTotal + membershipPrice : baseTotal).toLocaleString()}. View at Forge India Connect.`;
 const url = window.location.origin;
 
 if (platform === 'whatsapp') {
 window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
 } else if (platform === 'gmail') {
 window.open(`mailto:?subject=Invoice from Forge India Connect&body=${encodeURIComponent(text + '\n' + url)}`, '_blank');
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
 <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Secure <span className="text-blue-600">Checkout</span></h1>
 <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
 All transactions are encrypted & protected by enterprise-grade security.
 </p>
 </div>
 <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-gray-100 dark:border-gray-800 pl-6 h-10">
 <img src="/payment-logos/visa.svg" className="h-4 dark:invert opacity-80" alt="Visa" />
 <img src="/payment-logos/mastercard.svg" className="h-6 dark:invert opacity-80" alt="Mastercard" />
 <img src="/payment-logos/phonepe.svg" className="h-5 opacity-80" alt="PhonePe" />
 <img src="/payment-logos/gpay.svg" className="h-4 opacity-80" alt="GPay" />
 </div>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
 {/* LEFT SECTION: FLOW */}
 <div className="lg:col-span-8 space-y-8">
 
 {/* CHECKOUT FORM */}
 <AnimatePresence mode="wait">
 <motion.div 
 key="step1"
 variants={containerVars} initial="hidden" animate="visible" exit="hidden"
 className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl"
 >
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{isPhysicalFlow ? "Logistics & Address" : "Consulting Details"}</h2>
 </div>

 {isPhysicalFlow ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
 <div className="md:col-span-2">
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Secure Address</label>
 <div className="relative">
 <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
 <input 
 type="text"
 value={shippingAddress.address}
 onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
 placeholder="Full Address"
 className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
 />
 </div>
 </div>
 <div>
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">City / Hub</label>
 <input 
 type="text"
 value={shippingAddress.city}
 onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
 placeholder="City"
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
 />
 </div>
 <div>
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Protocol (Pincode)</label>
 <input 
 type="text"
 value={shippingAddress.postalCode}
 onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
 placeholder="Pincode"
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
 />
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
 <div className="md:col-span-2">
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Domain Expertise</label>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {['Banking', 'IT', 'Non-IT'].map((d) => (
 <button 
 key={d}
 onClick={() => setDomain(d)}
 className={`p-6 rounded-2xl border-2 text-left transition-all group ${domain === d ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-800'}`}
 >
 <Building2 size={20} className={domain === d ? 'text-blue-600' : 'text-gray-400'} />
 <p className="font-black text-xs uppercase mt-4">{d}</p>
 <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Consulting</p>
 </button>
 ))}
 </div>
 </div>
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
 <div>
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
 <div className="relative">
 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
 <input 
 type="email"
 value={contactDetails.email}
 onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
 placeholder="Enter email"
 className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
 />
 </div>
 </div>

 <div>
 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Contact Number</label>
 <div className="relative">
 <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
 <input 
 type="tel"
 value={contactDetails.contactNumber}
 onChange={(e) => setContactDetails({...contactDetails, contactNumber: e.target.value})}
 placeholder="Enter phone number"
 className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-600/10 font-bold text-sm"
 />
 </div>
 </div>
 </div>
 </motion.div>
 </AnimatePresence>
 </div>

 {/* RIGHT SECTION: ORDER SUMMARY (STICKY) */}
 <div className="lg:col-span-4">
 <div className="sticky top-32 space-y-6">
 <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
 <div className="p-8 border-b border-gray-50 dark:border-gray-800">
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Order Summary</h3>
 </div>
 <div className="p-8 space-y-6">
 <div className="max-h-[240px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
 {isPhysicalFlow ? cartItems.map((item, index) => (
 <div key={index} className="flex gap-4">
 <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
 <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
 </div>
 <div className="flex-1 min-w-0">
 <h5 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate leading-tight">{item.name}</h5>
 <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Qty: {item.qty} • ₹{item.price}</p>
 </div>
 </div>
 )) : (
 <div className="flex gap-4">
 <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
 <Building2 size={24} />
 </div>
 <div className="flex-1 min-w-0">
 <h5 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate leading-tight">FIC {domain} Consulting</h5>
 <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Domain Access • ₹{baseTotal}</p>
 </div>
 </div>
 )}
 </div>

 <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-800">
 <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
 <span>Subtotal</span>
 <span className="text-gray-900 dark:text-white">₹{baseTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
 <span>Platform Fee</span>
 <span className="text-green-500 font-black">FREE</span>
 </div>
 </div>
 
 <div className="pt-8 flex justify-between items-end">
 <div className="text-left">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</p>
 <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">₹{(addMembership ? baseTotal + membershipPrice : baseTotal).toLocaleString()}</p>
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
 <Lock size={18} /> PAY SECURELY NOW
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
 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4"
 >
 Mission <span className="text-green-500">Success</span>
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
 className="text-sm text-white/50 font-bold uppercase tracking-widest mb-12"
 >
 Deployment Authorized. Your domain consulting session has been scheduled.
 </motion.p>

 <div className="grid grid-cols-2 gap-4 mb-8">
 <button onClick={() => navigate('/profile')} className="py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all">
 View Dashboard
 </button>
 <button onClick={() => navigate('/explore-shop')} className="py-5 bg-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">Continue Mission</button>
 </div>

 {/* INVOICE PREVIEW AREA (Visible only on success) */}
 <div id="printable-invoice" className="bg-white rounded-3xl p-8 text-left shadow-2xl relative overflow-hidden mb-8 no-print-background">
 <div className="flex justify-between items-start mb-8">
 <div>
 <img src="/logo.jpg" alt="FIC" className="h-12 mb-4 rounded-lg" />
 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Forge India <span className="text-blue-600">Connect</span></h4>
 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Digital Solutions Ecosystem</p>
 </div>
 <div className="text-right">
 <h5 className="text-xs font-black text-slate-900 uppercase mb-1">Tax Invoice</h5>
 <p className="text-[9px] text-slate-400 font-bold uppercase">Order: #{lastOrder?._id?.slice(-8)}</p>
 <p className="text-[9px] text-slate-400 font-bold uppercase">Date: {new Date().toLocaleDateString()}</p>
 </div>
 </div>

 <div className="space-y-4 mb-8">
 {lastOrder?.orderItems?.map((item, i) => (
 <div key={i} className="flex justify-between border-b border-slate-50 pb-2">
 <div className="text-[10px] font-bold text-slate-700 uppercase">{item.name} x {item.qty}</div>
 <div className="text-[10px] font-black text-slate-900">₹{item.price?.toLocaleString()}</div>
 </div>
 ))}
 {lastOrder?.user?.isMember && (
 <div className="flex justify-between border-b border-slate-50 pb-2">
 <div className="text-[10px] font-bold text-blue-600 uppercase">FIC Premium Membership Active</div>
 </div>
 )}
 </div>

 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
 <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Total Amount Paid</div>
 <div className="text-xl font-black text-blue-600 tracking-tighter">₹{lastOrder?.totalPrice?.toLocaleString() || 0}</div>
 </div>

 <div className="mt-8 flex items-center gap-4">
 <img src="/registration_qr.png" alt="Scan" className="w-12 h-12 grayscale opacity-30" />
 <div>
 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verification Signal</p>
 <p className="text-[9px] font-bold text-slate-900 uppercase">Transaction ID: {lastOrder?.paymentResult?.id || 'AUTH_PENDING'}</p>
 </div>
 </div>
 </div>

 {/* DOWNLOAD & SHARE ACTIONS */}
 <div className="flex flex-col gap-4">
 <button onClick={handleDownloadInvoice} className="w-full py-4 bg-green-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
 Download Digital Invoice
 </button>
 <div className="grid grid-cols-2 gap-4">
 <button onClick={() => handleShareInvoice('whatsapp')} className="py-4 bg-[#25D366] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
 <Smartphone size={14} /> WhatsApp
 </button>
 <button onClick={() => handleShareInvoice('gmail')} className="py-4 bg-[#EA4335] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
 <Mail size={14} /> Gmail
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default Checkout;

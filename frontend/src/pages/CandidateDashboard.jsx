import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, FileText, Bell, User, LogOut, Upload, ChevronRight,
  CheckCircle2, Clock, XCircle, Star, MapPin, DollarSign, Send,
  Menu, X, ArrowUpRight, Loader2, AlertCircle, ShoppingCart, LayoutDashboard,
  ShieldCheck, CreditCard, Sparkles, Phone, BookOpen, Award, TrendingUp, Wallet, ExternalLink, Zap,
  Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';
import MembershipPopup from '../components/ui/MembershipPopup';
import MembershipUpgradeWidget from '../components/ui/MembershipUpgradeWidget';
import QuickDeliveryComponent from '../components/ui/QuickDeliveryComponent';

const statusConfig = {
 Pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
 Shortlisted:{ color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Star },
 Hired: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
 Rejected: { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const CandidateDashboard = () => {
 const navigate = useNavigate();
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
 const userInfo = user; // Compatibility for existing references
 const location = useLocation();
 const [activeTab, setActiveTab] = useState(location.state?.view || 'overview');
 const [jobs, setJobs] = useState([]);
 const [myApplications, setMyApplications] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
 const [myOrders, setMyOrders] = useState([]);
 const [notifications, setNotifications] = useState([]);
 const [loading, setLoading] = useState(true);
 const [resumeUrl, setResumeUrl] = useState(userInfo?.resumeUrl || '');
 const [uploading, setUploading] = useState(false);
 const [applyingJob, setApplyingJob] = useState(null);
 const [coverLetter, setCoverLetter] = useState('');
 const [submitting, setSubmitting] = useState(false);
 const [dashboardStats, setDashboardStats] = useState({});
 const [isEditing, setIsEditing] = useState(false);
 const [editData, setEditData] = useState({
 firstName: userInfo?.firstName || '',
 lastName: userInfo?.lastName || '',
 mobile: userInfo?.mobile || ''
 });
 
 // Rescheduling State
 const [reschedulingOrder, setReschedulingOrder] = useState(null);
 const [newSlot, setNewSlot] = useState({ date: '', time: '' });
 const [isRescheduling, setIsRescheduling] = useState(false);

 // ── Job Consulting State ────────────────────────────────────────
 const [consultingInquiries, setConsultingInquiries] = useState([]);
 const [consultingForm, setConsultingForm] = useState({
 consultingType: 'Career Guidance',
 experience: 'Fresher (0-1 yr)',
 currentRole: '',
 specificRequirement: '',
 message: '',
 contactNumber: userInfo?.mobile || '',
 domain: 'General', // New field
 });
 const [isSubmittingConsulting, setIsSubmittingConsulting] = useState(false);
 const [consultingPaymentSuccess, setConsultingPaymentSuccess] = useState(false);
 const [showQRModal, setShowQRModal] = useState(false);
 const [pendingInquiryId, setPendingInquiryId] = useState(null);
 const [showMembershipPopup, setShowMembershipPopup] = useState(false);
 const vault = userInfo?.membershipVault;

 useEffect(() => {
 if (!userInfo || userInfo.role !== 'Candidate') {
 navigate('/login');
 return;
 }
 fetchData();
 // Auto-show membership popup for non-members after 5s
 if (!userInfo?.isMember) {
 const timer = setTimeout(() => setShowMembershipPopup(true), 5000);
 return () => clearTimeout(timer);
 }
 }, []);

 const fetchData = async () => {
 try {
 const [jobsRes, appsRes, ordersRes, notesRes, consultingRes, bookingsRes] = await Promise.all([
 api.get('/jobs').catch(() => ({ data: [] })),
 api.get('/applications/mine').catch(() => ({ data: [] })),
 api.get('/orders/myorders').catch(() => ({ data: [] })),
 api.get('/notifications').catch(() => ({ data: [] })),
 api.get('/job-consulting/mine').catch(() => ({ data: [] })),
        api.get('/bookings/my-bookings').catch(() => ({ data: [] })),
      ]);
 setJobs(jobsRes.data || []);
 setMyApplications(appsRes.data || []);
 setMyOrders(ordersRes.data || []);
 setNotifications(notesRes.data || []);
      setMyBookings(bookingsRes.data || []);
 setConsultingInquiries(consultingRes.data || []);
 } catch (err) {
 console.error('Candidate Dashboard Sync Error:', err);
 } finally {
 setLoading(false);
 }
 };

 // ── Handle Consulting Form Submit with Razorpay ──────────
 const handleConsultingPayment = async () => {
 if (!consultingForm.consultingType || !consultingForm.specificRequirement || !consultingForm.contactNumber) {
 toast.error('Strategic Intelligence: Please fill all required fields');
 return;
 }

 setIsSubmittingConsulting(true);
 try {
 // Step 1: Create inquiry + Razorpay Order on backend
 const { data } = await api.post('/job-consulting/submit', consultingForm);
 
 if (!data.razorpayOrderId) {
 toast.info('Razorpay API busy. Redirecting to secure payment link...');
 setTimeout(() => {
 window.open(data.paymentLink, '_blank');
 }, 2000);
 return;
 }
 
 const options = {
 key: data.keyId,
 amount: data.amount * 100,
 currency: data.currency,
 name: "Forge India Connect",
 description: `Job Consulting - ${data.consultingType}`,
 image: "/logo.jpg",
 order_id: data.razorpayOrderId,
 handler: async (response) => {
 setIsSubmittingConsulting(true);
 try {
 // Step 2: Verify payment on backend
 await api.post('/job-consulting/verify-payment', {
 razorpay_order_id: response.razorpay_order_id,
 razorpay_payment_id: response.razorpay_payment_id,
 razorpay_signature: response.razorpay_signature,
 inquiryId: data.inquiryId
 });
 
 setConsultingPaymentSuccess(true);
 toast.success('🎉 Payment Confirmed! Our expert will reach out to you shortly.');
 setConsultingForm({
 consultingType: 'Career Guidance',
 experience: 'Fresher (0-1 yr)',
 currentRole: '', specificRequirement: '', message: '',
 contactNumber: userInfo?.mobile || '',
 domain: 'General',
 });
 fetchData();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Verification failed. Please contact support.');
 } finally {
 setIsSubmittingConsulting(false);
 }
 },
 prefill: {
 name: data.candidateName,
 email: data.email,
 contact: data.contactNumber
 },
 theme: { color: "#2563eb" },
 modal: {
 ondismiss: () => {
 setIsSubmittingConsulting(false);
 toast.error('Payment cancelled');
 }
 }
 };

 const rzp = new window.Razorpay(options);
 rzp.open();
 } catch (err) {
 const msg = err.response?.data?.message || 'Payment initialization failed';
 const fields = err.response?.data?.fields ? ` Missing: ${err.response.data.fields.join(', ')}` : '';
 toast.error(msg + fields);
 setIsSubmittingConsulting(false);
 }
 };

 const handleResumeUpload = async (e) => {
 const file = e.target.files[0];
 if (!file) return;
 const fd = new FormData();
 fd.append('file', file);
 setUploading(true);
 try {
 const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
 const url = typeof data === 'string' ? data : data.url;
 await api.put('/users/profile', { resumeUrl: url });
 
 const updatedUser = { ...userInfo, resumeUrl: url };
 localStorage.setItem('userInfo', JSON.stringify(updatedUser));
 toast.success('Resume synchronized with FIC network!');
 window.location.reload();
 } catch {
 toast.error('Upload failed');
 } finally {
 setUploading(false);
 }
 };

 const handleApply = async (job) => {
 if (!resumeUrl) {
 toast.error('Please upload your resume first (Profile tab)');
 setActiveTab('profile');
 return;
 }
 setApplyingJob(job);
 setCoverLetter('');
 };

 const submitApplication = async () => {
 if (!applyingJob) return;
 if (!userInfo?.mobile) {
 toast.error('Mobile number is required for applications. Please update your profile.');
 setActiveTab('profile');
 return;
 }
 setSubmitting(true);
 try {
 await api.post('/applications/apply', {
 fullName: `${userInfo.firstName} ${userInfo.lastName}`,
 email: userInfo.email,
 phone: userInfo.mobile || '',
 domain: applyingJob.domain || 'IT',
 jobRole: applyingJob.title,
 resumeUrl,
 coverLetter,
 userId: userInfo._id,
 jobId: applyingJob._id,
 });
 toast.success(`Applied to ${applyingJob.title}!`);
 setApplyingJob(null);
 fetchData();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Application failed');
 } finally {
 setSubmitting(false);
 }
 };
 
 const updateProfile = async () => {
 try {
 const { data } = await api.put('/users/profile', editData);
 const updatedInfo = { ...userInfo, ...data };
 localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
 setUser(updatedInfo); // Reactive update
 toast.success('Strategy profile updated!');
 setIsEditing(false);
 } catch (err) {
 toast.error('Profile update failed');
 }
 };

 const handleReschedule = async () => {
 if (!newSlot.date || !newSlot.time) return toast.error('Selection incomplete');
 setIsRescheduling(true);
 try {
 await api.put(`/orders/${reschedulingOrder._id}/reschedule`, { newSlot });
 toast.success('Mission window updated!');
 setReschedulingOrder(null);
 fetchData();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Rescheduling failed');
 } finally {
 setIsRescheduling(false);
 }
 };

 const isRescheduleAllowed = (order) => {
 if (!order.orderItems[0]?.slot?.date) return false;
 const slotDateTime = new Date(`${order.orderItems[0].slot.date} ${order.orderItems[0].slot.time.split(' - ')[0]}`);
 const now = new Date();
 const diff = (slotDateTime - now) / (1000 * 60 * 60);
 return diff > 12;
 };

 useEffect(() => {
 if (myApplications.length >= 0) {
 setDashboardStats({
 applied: myApplications.length,
 shortlisted: myApplications.filter(a => a.status === 'Shortlisted').length,
 hired: myApplications.filter(a => a.status === 'Hired').length,
 notifications: notifications.filter(n => !n.isRead).length
 });
 }
 }, [myApplications, notifications]);

 return (
 <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={dashboardStats}>
 {/* MEMBERSHIP VAULT POPUP */}
 {showMembershipPopup && <MembershipPopup onClose={() => setShowMembershipPopup(false)} />}

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
 <ShieldCheck className="text-primary" size={32} />
 </div>
 
 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
 Secure Scanner Pay
 </h3>
 <div className="flex items-center justify-center gap-3 mb-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
 <img src="/payment-logos/gpay.svg" className="h-3" alt="GPay" />
 <img src="/payment-logos/phonepe.svg" className="h-4" alt="PhonePe" />
 <img src="/payment-logos/paytm.svg" className="h-3" alt="Paytm" />
 <img src="/payment-logos/visa.svg" className="h-3" alt="Visa" />
 </div>
 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
 Please consult with our sales team before making the payment. Scan and pay the <span className="text-primary font-black">₹1,500 Registration Fee</span> below.
 </p>
 
 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
 <img 
 src="/registration_qr.png" 
 alt="UPI QR Code" 
 className="w-48 h-48 mx-auto rounded-xl shadow-inner group-hover:scale-105 transition-transform"
 />
 </div>

 <button 
 onClick={handleQRConfirm}
 className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
 >
 I have Scanned & Paid <CheckCircle2 size={18} />
 </button>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 <div className="space-y-12">
 <AnimatePresence mode="wait">
 {activeTab === 'overview' && (
 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto w-full space-y-12">
 
 {/* --- 🚁 MISSION CONTROL HEADER --- */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
 <div>
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-primary/20 shadow-sm"
 >
 <Zap size={14} className="animate-pulse" /> Strategic Intelligence Hub
 </motion.div>
 <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.85] font-poppins">
 CAREER <br/><span className="text-primary">DEPLOYMENT.</span>
 </h1>
 </div>
 <div className="flex flex-col items-end gap-4">
 <div className="flex items-center gap-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 px-6 py-4 rounded-[2rem] shadow-xl">
 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pipeline Status: Operational</span>
 </div>
 </div>
 </div>

 <RoleDashboardProfile user={userInfo} stats={dashboardStats} />

 {/* --- 💎 PREMIUM ECOSYSTEM FEED --- */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 {/* Membership Vault Card (Revamped) */}
 {vault && vault.balance > 0 ? (
 <div className="p-10 bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform group-hover:scale-125" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-10">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
 <Wallet size={28} className="text-primary" />
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-1">Strategic Reserve</p>
 <h3 className="text-4xl font-black tracking-tighter">₹{vault.balance?.toLocaleString()}</h3>
 </div>
 </div>
 <div className="text-right">
 <span className="px-4 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-primary/20 border border-white/10">
 {vault.planTier} Elite
 </span>
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Monthly Optimization</p>
 <p className="text-xl font-black text-green-400">+₹{vault.savingsThisMonth?.toLocaleString() || 0}</p>
 </div>
 <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Operational Window</p>
 <p className="text-xl font-black text-white/80">{vault.cycleEndDate ? new Date(vault.cycleEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '∞'}</p>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <motion.div
 whileHover={{ y: -5 }}
 onClick={() => setShowMembershipPopup(true)}
 className="cursor-pointer p-10 bg-white dark:bg-dark-card border border-dashed border-primary/30 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group transition-all"
 >
 <div className="flex items-center gap-8">
 <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center shrink-0 border border-primary/10">
 <Sparkles size={40} className="text-primary" />
 </div>
 <div className="text-left">
 <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Initialize <span className="text-primary">Membership</span> Vault</h4>
 <p className="text-sm text-gray-400 font-medium mt-2">Unlock unlimited career protocols and premium ecosystem credits.</p>
 </div>
 </div>
 <button className="px-10 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 group-hover:scale-105 transition-all">Activate Now</button>
 </motion.div>
 )}

 {/* Recent Activity / Applications Feed */}
 <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-xl overflow-hidden">
 <div className="flex items-center justify-between mb-10">
 <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight">Deployment <span className="text-primary">Pipeline</span></h3>
 <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">View Full History <ChevronRight size={14} /></button>
 </div>
 
 <div className="space-y-4">
 {myApplications.length > 0 ? myApplications.slice(0, 3).map(app => {
 const cfg = statusConfig[app.status] || statusConfig.Pending;
 const Icon = cfg.icon;
 return (
 <div key={app._id} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 dark:bg-dark-bg/50 border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all group">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Briefcase size={22} className="text-primary" /></div>
 <div className="text-left">
 <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{app.jobRole}</p>
 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Logged {new Date(app.createdAt).toLocaleDateString()}</p>
 </div>
 </div>
 <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.color}`}>
 <Icon size={12} /> {app.status}
 </span>
 </div>
 );
 }) : (
 <div className="py-12 text-center">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">No active deployments detected</p>
 </div>
 )}
 </div>
 </div>
 </div>

 <div className="space-y-8">
 {/* Marketplace Quick Access */}
 <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform" />
 <div className="relative z-10 text-left">
 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Priority Access</p>
 <h4 className="text-2xl font-black tracking-tighter mb-6 uppercase leading-none">Strategic <br/><span className="text-primary">Shopping</span></h4>
 <button 
 onClick={() => navigate('/explore-shop')}
 className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1"
 >
 Open Store <ShoppingCart size={16} />
 </button>
 </div>
 </div>

 {/* Resume Sync Status */}
 <div className="p-10 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-center text-left">
 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Identity Synchronization</p>
 {!resumeUrl ? (
 <div className="space-y-6">
 <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
 <AlertCircle size={24} />
 </div>
 <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Resume <span className="text-red-500">Offline.</span></h4>
 <button onClick={() => setActiveTab('profile')} className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
 Upload Assets <ChevronRight size={14} />
 </button>
 </div>
 ) : (
 <div className="space-y-6">
 <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shadow-lg shadow-green-500/10">
 <CheckCircle2 size={24} />
 </div>
 <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Assets <span className="text-green-500">Verified.</span></h4>
 <button onClick={() => setActiveTab('profile')} className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
 Manage Records <ChevronRight size={14} />
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {/* BROWSE JOBS */}
 {activeTab === 'browse' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto w-full">
 <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Browse Jobs</h1>
 <p className="text-gray-500 font-medium mb-8">{jobs.length} active opportunities</p>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-32 text-gray-400">
 <Loader2 className="animate-spin mb-4 text-primary" size={40} />
 <p className="font-black uppercase tracking-widest text-[10px]">Synchronizing Active Pipeline...</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
 {jobs.map(job => {
 const alreadyApplied = myApplications.some(a => (a.job?._id || a.job) === job._id);
 return (
 <motion.div 
 whileHover={{ y: -8 }}
 key={job._id} 
 className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-6 md:p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden h-full flex flex-col shadow-sm"
 >
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
 
 <div className="flex items-start justify-between mb-8 relative z-10">
 <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
 <Briefcase size={24} className="text-primary" />
 </div>
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/10">
 {job.type || 'Full-Time'}
 </span>
 </div>

 <div className="relative z-10 flex-1">
 <h3 className="font-black text-2xl text-gray-900 dark:text-white mb-2 leading-tight tracking-tight group-hover:text-primary transition-colors">{job.title}</h3>
 <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">{job.companyName}</p>
 
 <div className="space-y-3 mb-8">
 {job.location && (
 <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
 <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
 <MapPin size={14} className="text-slate-400" />
 </div>
 <span>{job.location}</span>
 </div>
 )}
 {job.salary && (
 <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
 <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
 <DollarSign size={14} className="text-slate-400" />
 </div>
 <span className="text-gray-900 dark:text-slate-200">₹{job.salary}</span>
 </div>
 )}
 {job.requirements && (
 <div className="flex flex-wrap gap-2 mb-10">
 {Array.isArray(job.requirements) 
 ? job.requirements.slice(0, 3).map((r, i) => (
 <span key={i} className="text-[10px] bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl px-3 py-1.5 font-black uppercase tracking-wider border border-slate-100 dark:border-white/5">{r}</span>
 ))
 : job.requirements.split(',').slice(0, 3).map((r, i) => (
 <span key={i} className="text-[10px] bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl px-3 py-1.5 font-black uppercase tracking-wider border border-slate-100 dark:border-white/5">{r.trim()}</span>
 ))
 }
 </div>
 )}
 </div>
 </div>

 <button
 disabled={alreadyApplied}
 onClick={() => handleApply(job)}
 className={`w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all relative z-10 mt-auto uppercase tracking-[0.2em] ${
 alreadyApplied
 ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed'
 : 'bg-primary text-white hover:bg-blue-600 shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95'
 }`}
 >
 {alreadyApplied ? <><CheckCircle2 size={16} /> Verified Application</> : <><Send size={16} /> Deploy Application</>}
 </button>
 </motion.div>
 );
 })}
 {jobs.length === 0 && (
 <div className="col-span-full py-32 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-6">
 <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
 <Briefcase size={32} />
 </div>
 <p className="font-black text-slate-300 uppercase tracking-[0.5em] text-xs">No active opportunities detected</p>
 </div>
 )}
 </div>
 )}
 </motion.div>
 )} {/* MY APPLICATIONS */}
 {activeTab === 'applications' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto w-full">
 <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Track Record</h1>
 <p className="text-gray-500 font-medium mb-8">{myApplications.length} total applications</p>
 <div className="space-y-6">
 {myApplications.map(app => {
 const cfg = statusConfig[app.status] || statusConfig.Pending;
 const Icon = cfg.icon;
 return (
 <div key={app._id} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-lg transition-all">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center"><Briefcase size={24} className="text-primary" /></div>
 <div>
 <h3 className="font-black text-lg text-gray-900 dark:text-white">{app.jobRole}</h3>
 <p className="text-sm text-gray-400">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
 </div>
 </div>
 <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
 <Icon size={12} /> {app.status}
 </span>
 </div>

 {app.hrNotes && (
 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
 <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">HR Note</p>
 <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">{app.hrNotes}</p>
 </div>
 )}
 
 {/* ATS & Interview Section */}
 <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
   <div>
     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">ATS Compatibility</p>
     <div className="flex items-center gap-4">
       <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xs" style={{ borderColor: app.atsScore > 80 ? '#22c55e' : app.atsScore > 60 ? '#eab308' : '#ef4444', color: app.atsScore > 80 ? '#22c55e' : app.atsScore > 60 ? '#eab308' : '#ef4444' }}>
         {app.atsScore || 0}%
       </div>
       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">{app.atsFeedback || 'Pending Analysis'}</p>
     </div>
   </div>
   
   {app.status === 'Interview Scheduled' && app.interviewDate && (
     <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800">
       <p className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-1">Scheduled Interview</p>
       <p className="text-sm font-black text-purple-700 dark:text-purple-300 mb-2">{new Date(app.interviewDate).toLocaleString()}</p>
       {app.interviewLink && (
         <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 hover:scale-105 transition-all">
           Join Meeting <ExternalLink size={14} />
         </a>
       )}
     </div>
   )}
 </div>

 {app.resumeUrl && (
 <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
 className="mt-6 inline-flex items-center gap-2 text-primary hover:underline text-[10px] font-black uppercase tracking-widest">
 <FileText size={14} /> View Submitted Resume
 </a>
 )}
 </div>
 );
 })}
 {myApplications.length === 0 && (
 <div className="py-20 text-center">
 <Briefcase size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
 <p className="font-bold text-gray-400">No applications yet</p>
 <button onClick={() => setActiveTab('browse')} className="mt-4 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm">Browse Jobs</button>
 </div>
 )}
 </div>
 </motion.div>
 )}

 {/* ORDERS & BOOKINGS */}
 {activeTab === 'orders' && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto w-full">
 <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight font-poppins">Orders & <span className="text-primary">Bookings</span></h1>
 <p className="text-gray-500 font-medium mb-8">Manage your product purchases and service appointments</p>

 <div className="space-y-6">
 {myOrders.map(order => (
 <div key={order._id} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl transition-all">
 <div className="flex flex-col md:flex-row justify-between gap-6">
 <div className="flex gap-6">
 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
 <ShoppingCart size={28} />
 </div>
 <div>
 <div className="flex items-center gap-3 mb-1">
 <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h3>
 <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
 order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
 }`}>{order.status}</span>
 </div>
 <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">₹{order.totalPrice.toLocaleString()}</p>
 <p className={`text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>
 {order.isPaid ? 'Payment Verified' : 'Payment Pending'}
 </p>
 </div>
 </div>

 <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {order.orderItems.map((item, i) => (
 <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
 <div>
 <p className="font-black text-xs text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
 <p className="text-[10px] font-bold text-primary uppercase">{item.isService ? 'Service' : 'Product'}</p>
 {item.slot && (
 <p className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-wider">{item.slot.date} @ {item.slot.time}</p>
 )}
 </div>
 </div>
 ))}
 </div>

 <div className="mt-8 flex flex-wrap gap-4">
 {order.orderItems.some(i => i.isService) && isRescheduleAllowed(order) && (
 <button 
 onClick={() => setReschedulingOrder(order)}
 className="px-6 py-3 bg-secondary text-dark-bg font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-secondary/10"
 >
 Reschedule Protocol
 </button>
 )}
 {((order.status === 'In Transit') || (order.fulfillmentType === 'Delivery Partner' && !['Completed', 'Delivered', 'Cancelled'].includes(order.status))) && (
 <button 
 onClick={() => navigate(/track-mission/)}
 className="px-6 py-3 bg-primary text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
 >
 <MapPin size={12} /> Track Live Service
 </button>
 )}
 </div>
 </div>
 ))}
 {myBookings && myBookings.length > 0 && (
  <div className="mt-16 mb-6">
    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins mb-2">Property & Rental <span className="text-blue-500">Bookings</span></h3>
    <div className="w-12 h-1 bg-blue-500 rounded-full mb-8"></div>
    <div className="space-y-6">
      {myBookings.map(booking => (
        <div key={booking._id} className="bg-white dark:bg-dark-card border border-blue-100 dark:border-blue-900/30 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <Home size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight">{booking.serviceName || 'Property Booking'}</h3>
                  <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600">{booking.status || 'Pending'}</span>
                </div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{new Date(booking.createdAt).toLocaleDateString()} � {booking.bookingData?.roomType || 'Room'} � {booking.bookingData?.duration || 'Duration'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">?{booking.totalPrice?.toLocaleString() || 0}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Move-In: {booking.bookingData?.moveInDate || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location: {booking.bookingData?.location || 'TBA'}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
 {myOrders.length === 0 && myBookings.length === 0 && (
 <div className="py-20 text-center bg-gray-50 dark:bg-dark-bg border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
 <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
 <p className="text-gray-400 font-bold uppercase tracking-widest">No orders found in your vault</p>
 </div>
 )}
 </div>
 </motion.div>
 )}

 {/* CHAT WITH QUIPPY */}
 {activeTab === 'quippy' && (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto w-full">
 <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-12 text-center border border-white/5 shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
 <div className="relative z-10">
 <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 rotate-12">
 <Sparkles size={48} className="text-primary" />
 </div>
 <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Meet <span className="text-primary">Quippy</span></h2>
 <p className="text-gray-400 text-lg font-medium mb-12 max-w-xl mx-auto">
 Your dedicated AI Career Strategist. Get instant help with your resume, interview prep, or navigating the Forge India ecosystem.
 </p>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
 <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-2">Resume Optimization</h4>
 <p className="text-[10px] text-gray-500 font-bold">"How can I improve my software engineer resume?"</p>
 </div>
 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
 <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-2">Interview Prep</h4>
 <p className="text-[10px] text-gray-500 font-bold">"Give me mock interview questions for Java."</p>
 </div>
 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
 <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-2">Platform Guide</h4>
 <p className="text-[10px] text-gray-500 font-bold">"How do I apply for the career guidance session?"</p>
 </div>
 </div>

 <button 
 onClick={() => {
 // Triggering the global Quippy widget
 const quippyBtn = document.querySelector('button[aria-label="Open FIC Quippy"]');
 if (quippyBtn) quippyBtn.click();
 else toast.error("Quippy is currently initializing...");
 }}
 className="px-10 py-5 bg-primary text-white font-black rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
 >
 Launch AI Strategist
 </button>
 </div>
 </div>
 </motion.div>
 )}

 {/* SUPPORT MESSAGES (MESSAGES) */}
 {activeTab === 'messages' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto w-full h-[75vh] flex flex-col">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Support <span className="text-primary">Chat</span></h1>
 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Connect with Admin & HR Experts</p>
 </div>
 </div>
 
 <div className="flex-1 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-12 text-center">
 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
 <Send size={32} />
 </div>
 <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Direct Support Channel</h3>
 <p className="text-gray-500 font-medium max-w-md mb-8">
 Our support interface is integrated directly into your dashboard. Click the floating chat button in the bottom right to start a conversation with our team.
 </p>
 <div className="flex gap-4">
 <button 
 onClick={() => {
 window.dispatchEvent(new CustomEvent('open-chat-widget'));
 }}
 className="px-8 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
 >
 Open Chat Console
 </button>
 </div>
 </div>
 </motion.div>
 )}

 {/* ALERTS */}
 {activeTab === 'notifications' && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto w-full">
 <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight">Mission <span className="text-primary">Updates</span></h1>
 <p className="text-gray-500 font-medium mb-8">Critical communications from command center</p>

 <div className="space-y-4">
 {notifications.map(note => (
 <div key={note._id} className={`p-8 rounded-[2.5rem] border transition-all ${
 note.isRead ? 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 opacity-60' : 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5'
 }`}>
 <div className="flex items-start gap-6">
 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
 note.isRead ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-xl shadow-primary/20'
 }`}>
 <Bell size={24} />
 </div>
 <div className="flex-1">
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight leading-none">{note.title}</h3>
 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</span>
 </div>
 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">{note.message}</p>
 {!note.isRead && (
 <button 
 onClick={async () => {
 try {
 await api.put(`/notifications/${note._id}/read`);
 fetchData();
 } catch (err) { toast.error('Failed to update'); }
 }}
 className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all"
 >
 Mark as Read
 </button>
 )}
 </div>
 </div>
 </div>
 ))}
 {notifications.length === 0 && (
 <div className="py-20 text-center bg-gray-50 dark:bg-dark-bg border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
 <Bell size={48} className="mx-auto text-gray-300 mb-4" />
 <p className="text-gray-400 font-bold uppercase tracking-widest">All communication lines quiet</p>
 </div>
 )}
 </div>
 </motion.div>
 )}

 {/* IDENTITY & CV */}
 {activeTab === 'profile' && (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto w-full space-y-12">
 <div className="relative z-10 text-center">
 <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-10 rotate-12">
 <ShieldCheck size={48} />
 </div>
 <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter font-poppins">Professional <span className="text-primary font-poppins">Identity</span></h3>
 <p className="text-lg text-gray-500 font-medium mb-12">Authorized Career Management Profile</p>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
 <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm md:col-span-2">
 <div className="flex items-center justify-between mb-6">
 <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Core Credentials</h4>
 <button 
 onClick={() => isEditing ? updateProfile() : setIsEditing(true)}
 className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
 >
 {isEditing ? 'Sync Changes' : 'Modify Asset'}
 </button>
 </div>
 <div className="space-y-4">
 {isEditing ? (
 <>
 <div className="grid grid-cols-2 gap-4">
 <input value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary" placeholder="First Name" />
 <input value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary" placeholder="Last Name" />
 </div>
 <input value={editData.mobile} onChange={e => setEditData({...editData, mobile: e.target.value})} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary" placeholder="Mobile Number" />
 <button onClick={() => setIsEditing(false)} className="w-full mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">Abandon Changes</button>
 </>
 ) : (
 <>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Identity</p>
 <p className="font-bold text-gray-900 dark:text-white">{userInfo?.firstName} {userInfo?.lastName}</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Node</p>
 <p className="font-bold text-gray-900 dark:text-white">{userInfo?.email}</p>
 </div>
 </>
 )}
 </div>
 </div>

 <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm md:col-span-2">
 <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-6">CV Repository (PDF)</h4>
 <label className="block w-full px-6 py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center cursor-pointer hover:border-primary transition-all group">
 <Upload size={24} className="mx-auto mb-2 text-gray-300 group-hover:text-primary transition-colors" />
 <p className="font-black text-xs uppercase tracking-widest">{uploading ? 'Uploading...' : resumeUrl ? 'Swap CV Asset' : 'Upload CV Asset'}</p>
 <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
 </label>
 </div>
 </div>
 </div>
 </motion.div>
 )}


 {/* ── JOB CONSULTING ────────────────────────────────────── */}
 {activeTab === 'consulting' && (
 <motion.div key="consulting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto w-full space-y-10">

 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Premium Service</p>
 <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
 JOB <span className="text-primary">CONSULTING</span>
 </h1>
 <p className="text-gray-500 text-sm font-medium mt-2">One-on-one expert guidance to accelerate your career</p>
 </div>
 <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 px-6 py-3 rounded-2xl">
 <Sparkles size={16} className="text-primary" />
 <span className="text-sm font-black text-primary">₹2500 / Session</span>
 </div>
 </div>

 {/* Success Banner */}
 <AnimatePresence>
 {consultingPaymentSuccess && (
 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
 className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[2rem] p-6 flex items-center gap-4">
 <CheckCircle2 className="text-green-500 shrink-0" size={28} />
 <div>
 <p className="font-black text-green-700 dark:text-green-300 text-lg">Payment Confirmed!</p>
 <p className="text-sm text-green-600 dark:text-green-400">A confirmation email has been sent to <strong>{userInfo?.email}</strong>. Our consultant will reach you within 24 hours.</p>
 </div>
 <button onClick={() => setConsultingPaymentSuccess(false)} className="ml-auto text-green-400 hover:text-green-600">
 <X size={20} />
 </button>
 </motion.div>
 )}
 </AnimatePresence>

 {/* What You Get */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {[
 { icon: BookOpen, title: 'Resume Review', desc: 'ATS-optimised resume crafted by experts' },
 { icon: TrendingUp, title: 'Career Roadmap', desc: 'Personalised 90-day career acceleration plan' },
 { icon: Award, title: 'Interview Prep', desc: 'Mock interviews with domain-specific feedback' },
 ].map(({ icon: Icon, title, desc }) => (
 <div key={title} className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2rem] flex gap-4 items-start shadow-sm">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
 <Icon size={18} className="text-primary" />
 </div>
 <div>
 <p className="font-black text-sm text-gray-900 dark:text-white">{title}</p>
 <p className="text-xs text-gray-500 mt-1">{desc}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Consulting Form or Active Status */}
 {consultingInquiries.some(inq => inq.paymentStatus === 'Paid') ? (
 <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
 <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 border border-white/20">
 <ShieldCheck size={48} />
 </div>
 <div className="flex-1 text-center md:text-left">
 <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Consultation <span className="text-white/70">Active</span></h3>
 <p className="text-white/80 font-medium leading-relaxed mb-6">
 Your payment has been verified. Our senior career strategist is currently reviewing your profile. You will receive a call/email for scheduling within 24 hours.
 </p>
 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
 <div className="px-5 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Status: Reviewing Assets
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm">
 <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Book Your Session</h3>
 <p className="text-sm text-gray-400 mb-8">Fill in your details and proceed to secure payment</p>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Consulting Type */}
 <div className="md:col-span-2">
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Consulting Type *</label>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
 {['Career Guidance', 'Resume Review', 'Interview Preparation', 'Salary Negotiation', 'Domain Switch Guidance'].map(type => (
 <button key={type}
 onClick={() => setConsultingForm(f => ({ ...f, consultingType: type }))}
 className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider border-2 transition-all ${
 consultingForm.consultingType === type
 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
 : 'bg-gray-50 dark:bg-dark-bg text-gray-500 border-gray-100 dark:border-gray-800 hover:border-primary/40'
 }`}>
 {type}
 </button>
 ))}
 </div>
 </div>

 {/* Experience */}
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Experience Level *</label>
 <select
 value={consultingForm.experience}
 onChange={e => setConsultingForm(f => ({ ...f, experience: e.target.value }))}
 className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all appearance-none">
 {['Fresher (0-1 yr)', '1-3 Years', '3-6 Years', '6-10 Years', '10+ Years'].map(e => <option key={e} value={e}>{e}</option>)}
 </select>
 </div>

 {/* Current Role */}
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Current Role / Title</label>
 <input
 type="text"
 placeholder="e.g. Software Engineer"
 value={consultingForm.currentRole}
 onChange={e => setConsultingForm(f => ({ ...f, currentRole: e.target.value }))}
 className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all"
 />
 </div>

 {/* Target Domain */}
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Target Domain *</label>
 <select
 value={consultingForm.domain}
 onChange={e => setConsultingForm(f => ({ ...f, domain: e.target.value }))}
 className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all appearance-none">
 {['General', 'Banking', 'IT / Software', 'Core Engineering', 'Management', 'Other'].map(d => <option key={d} value={d}>{d}</option>)}
 </select>
 </div>

 {/* Contact Number */}
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Number *</label>
 <div className="relative">
 <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
 <input
 type="tel"
 placeholder="+91 XXXXX XXXXX"
 value={consultingForm.contactNumber}
 onChange={e => setConsultingForm(f => ({ ...f, contactNumber: e.target.value }))}
 className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all"
 />
 </div>
 </div>

 {/* Specific Requirements */}
 <div className="md:col-span-2">
 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Specific Requirements *</label>
 <textarea
 rows={4}
 placeholder="Describe your goals, challenges, and what you hope to achieve from this session..."
 value={consultingForm.specificRequirement}
 onChange={e => setConsultingForm(f => ({ ...f, specificRequirement: e.target.value }))}
 className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all resize-none"
 />
 </div>
 </div>

 {/* Dynamic Price Display */}
 <div className="mt-8 flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Total Consultation Fee</p>
 <p className="text-2xl font-black text-gray-900 dark:text-white">₹{consultingForm.domain === 'Banking' ? '2,500' : '1,500'}</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Session Duration</p>
 <p className="text-sm font-bold text-gray-900 dark:text-white">60-90 Mins</p>
 </div>
 </div>

 {/* Security Note */}
 <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <ShieldCheck size={18} className="text-green-500 shrink-0" />
 <p className="text-xs text-gray-500 font-medium">
 Your payment is processed via our secure manual verification channel. No sensitive details are stored on our servers.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 mt-8">
 <button
 onClick={handleConsultingPayment}
 disabled={isSubmittingConsulting}
 className="flex-[1.5] py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {isSubmittingConsulting ? (
 <><Loader2 className="animate-spin" size={18} /> Processing...</>
 ) : (
 <><CreditCard size={18} /> Pay ₹{consultingForm.domain === 'Banking' ? '2500' : '1500'} &amp; Book Session</>
 )}
 </button>
 <a 
 href={consultingForm.domain === 'Banking' ? 'https://rzp.io/rzp/KJFPhwG' : 'https://rzp.io/rzp/KJFPhwG'} // Fallback link (update if separate link exists for 1500)
 target="_blank" 
 rel="noopener noreferrer"
 className="flex-1 py-5 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
 >
 <ExternalLink size={18} /> Direct Link
 </a>
 </div>
 </div>
 )}

 {/* Past Consulting Inquiries */}
 {consultingInquiries.length > 0 && (
 <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm">
 <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6 uppercase tracking-tight">My Consultings</h3>
 <div className="space-y-4">
 {consultingInquiries.map(inq => (
 <div key={inq._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
 <CreditCard size={20} className="text-primary" />
 </div>
 <div>
 <p className="font-black text-sm text-gray-900 dark:text-white">{inq.consultingType}</p>
 <p className="text-xs text-gray-400">{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <p className="font-black text-lg text-gray-900 dark:text-white">₹{inq.amount}</p>
 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
 inq.paymentStatus === 'Paid'
 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
 : inq.paymentStatus === 'Pending'
 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
 : 'bg-red-100 dark:bg-red-900/30 text-red-500'
 }`}>
 {inq.paymentStatus === 'Paid' ? '✓ Paid' : inq.paymentStatus}
 </span>
 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
 inq.status === 'In Progress'
 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
 : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
 }`}>{inq.status}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 </motion.div>
 )}

 </AnimatePresence>
 </div>

 {/* Additional Candidate Modules */}
 {['saved-jobs', 'interview-prep', 'resume-hub', 'assessments'].includes(activeTab) && (
   <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-dark-card/50 rounded-[4rem] border border-gray-100 dark:border-gray-800">
     <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
       <Sparkles size={40} />
     </div>
     <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 capitalize">{activeTab.replace('-', ' ')} <span className="text-primary">Module</span></h2>
     <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest max-w-md text-center">
       This strategic candidate module is currently being calibrated. The advanced interface and automated workflows will be online shortly.
     </p>
   </motion.div>
 )}

 {/* Reschedule Modal */}
 <AnimatePresence>
 {reschedulingOrder && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4">
 <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-md rounded-[3rem] p-10 border border-white/10 shadow-2xl">
 <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter">Reschedule <span className="text-secondary font-poppins">Mission</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Order #{reschedulingOrder._id.slice(-6).toUpperCase()}</p>
 
 <div className="space-y-6 mb-10">
 <div>
 <label className="block text-[10px] font-black uppercase text-secondary mb-2 tracking-widest">New Execution Date</label>
 <input 
 type="date" 
 min={new Date().toISOString().split('T')[0]}
 value={newSlot.date}
 onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-secondary transition-all font-bold outline-none"
 />
 </div>
 <div>
 <label className="block text-[10px] font-black uppercase text-secondary mb-2 tracking-widest">New Time Hub</label>
 <select 
 value={newSlot.time}
 onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-secondary transition-all font-bold outline-none appearance-none"
 >
 <option value="">Select Time Slot</option>
 <option value="09:00 AM - 12:00 PM">Alpha (09:00 - 12:00)</option>
 <option value="12:00 PM - 03:00 PM">Bravo (12:00 - 15:00)</option>
 <option value="03:00 PM - 06:00 PM">Charlie (15:00 - 18:00)</option>
 <option value="06:00 PM - 09:00 PM">Delta (18:00 - 21:00)</option>
 </select>
 </div>
 </div>

 <div className="flex gap-4">
 <button onClick={handleReschedule} disabled={isRescheduling} className="flex-[2] py-5 bg-secondary text-dark-bg font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/10 flex items-center justify-center gap-2">
 {isRescheduling ? <Loader2 className="animate-spin" size={14}/> : 'Confirm Deployment'}
 </button>
 <button onClick={() => setReschedulingOrder(null)} className="flex-1 py-5 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-[10px]">Abort</button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Apply Modal */}
 <AnimatePresence>
 {applyingJob && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
 <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-2xl">
 <h3 className="text-2xl font-black mb-1 text-gray-900 dark:text-white">{applyingJob.title}</h3>
 <p className="text-primary font-bold mb-6">{applyingJob.companyName}</p>
 <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Cover Letter (Optional)" className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl outline-none text-sm font-medium focus:border-primary transition-all mb-6" />
 <div className="flex gap-3">
 <button onClick={submitApplication} disabled={submitting || !resumeUrl} className="flex-1 py-4 rounded-2xl font-black text-white bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 tracking-widest uppercase text-[10px]">
 {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Deploy Application
 </button>
 <button onClick={() => setApplyingJob(null)} className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 font-black text-gray-500 uppercase tracking-widest text-[10px]">Close</button>
 </div>
 </motion.div>
 </motion.div>
 )}
 {activeTab === 'subscription' && (
   <motion.div key="subscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
     <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl mt-8">
       <MembershipUpgradeWidget userInfo={userInfo} />
     </div>
   </motion.div>
 )}
 </AnimatePresence>
 </DashboardLayout>
 );
};

export default CandidateDashboard;





import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, FileText, Bell, User, LogOut, Upload, ChevronRight,
  CheckCircle2, Clock, XCircle, Star, MapPin, DollarSign, Send,
  Menu, X, ArrowUpRight, Loader2, AlertCircle, ShoppingCart, LayoutDashboard,
  ShieldCheck, CreditCard, Sparkles, Phone, BookOpen, Award, TrendingUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';

const statusConfig = {
  Pending:    { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  Shortlisted:{ color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Star },
  Hired:      { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  Rejected:   { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const userInfo = user; // Compatibility for existing references
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.view || 'overview');
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
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
    consultingType:      'Career Guidance',
    experience:          'Fresher (0-1 yr)',
    currentRole:         '',
    specificRequirement: '',
    message:             '',
    contactNumber:       userInfo?.mobile || '',
  });
  const [isSubmittingConsulting, setIsSubmittingConsulting] = useState(false);
  const [consultingPaymentSuccess, setConsultingPaymentSuccess] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pendingInquiryId, setPendingInquiryId] = useState(null);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Candidate') {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, ordersRes, notesRes, consultingRes] = await Promise.all([
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/applications/mine').catch(() => ({ data: [] })),
        api.get('/orders/myorders').catch(() => ({ data: [] })),
        api.get('/notifications').catch(() => ({ data: [] })),
        api.get('/job-consulting/mine').catch(() => ({ data: [] })),
      ]);
      setJobs(jobsRes.data || []);
      setMyApplications(appsRes.data || []);
      setMyOrders(ordersRes.data || []);
      setNotifications(notesRes.data || []);
      setConsultingInquiries(consultingRes.data || []);
    } catch (err) {
      console.error('Candidate Dashboard Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Removed Razorpay load script

  // ── Handle Consulting Form Submit + Open QR Modal ──────────
  const handleConsultingPayment = async () => {
    if (!consultingForm.consultingType || !consultingForm.specificRequirement || !consultingForm.contactNumber) {
      toast.error('Please fill all required fields.');
      return;
    }
    setIsSubmittingConsulting(true);
    try {
      // Step 1: Create inquiry on backend
      const { data } = await api.post('/job-consulting/submit', consultingForm);
      setPendingInquiryId(data.inquiryId);

      // Step 2: Show QR Modal
      setShowQRModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmittingConsulting(false);
    }
  };

  const handleQRConfirm = async () => {
      setShowQRModal(false);
      setIsSubmittingConsulting(true);
      try {
          // Verify with backend
          await api.post('/job-consulting/verify-payment', {
              razorpay_order_id: `order_mock_${Date.now()}`,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              inquiryId: pendingInquiryId
          });
          
          setConsultingPaymentSuccess(true);
          toast.success('🎉 Payment confirmed! Our consultant will reach out soon.');
          setConsultingForm({
            consultingType: 'Career Guidance',
            experience: 'Fresher (0-1 yr)',
            currentRole: '', specificRequirement: '', message: '',
            contactNumber: userInfo?.mobile || '',
          });
          fetchData();
      } catch (err) {
          toast.error(err.response?.data?.message || 'Verification failed. Please contact support.');
      } finally {
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
      const url = typeof data === 'string' ? `http://localhost:5000${data}` : data;
      await api.put('/users/profile', { resumeUrl: url });
      setResumeUrl(url);
      const updatedInfo = { ...userInfo, resumeUrl: url };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      toast.success('Resume updated successfully!');
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
                Membership Payment
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Scan this QR to pay the <span className="text-primary font-black">₹1,500 Registration Fee</span> and unlock premium job consulting.
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
                className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                I have Scanned & Paid <CheckCircle size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        <div className="space-y-12">
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase italic leading-none font-poppins">
                            STRATEGIC <span className="text-primary italic font-black">PROGRESS</span>
                            </h1>
                            <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.4em] ml-1">Job Seeker Command Center</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 px-6 py-3 rounded-2xl shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live & Connected</span>
                        </div>
                    </div>

                    <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Marketplace Integration</p>
                                <h4 className="text-xl md:text-2xl font-black italic tracking-tighter mb-4 uppercase">Direct <span className="text-primary italic">Shopping</span> Access</h4>
                                <p className="text-xs text-gray-400 font-bold mb-8 leading-relaxed">
                                    As a verified Candidate, you have priority access to our curated service catalog. Browse now for professional kits and tools.
                                </p>
                                <button 
                                    onClick={() => navigate('/explore-shop')}
                                    className="bg-primary hover:bg-blue-600 text-white font-black py-3 px-6 md:py-4 md:px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
                                >
                                    Shop Now <ShoppingCart size={16} />
                                </button>
                            </div>
                            <ShoppingCart size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="p-6 md:p-8 bg-white dark:bg-dark-card rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Identity Hub</p>
                            <h4 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-4 uppercase italic tracking-tighter">Profile <span className="text-primary italic">Synchronization</span></h4>
                            <p className="text-xs text-gray-500 font-medium mb-6">Ensure your contact details and master resume are up-to-date for automated job matching.</p>
                            <button onClick={() => setActiveTab('profile')} className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                                Verify Identity Assets <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {!resumeUrl ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[2rem] p-6 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                        <AlertCircle className="text-yellow-500" size={24} />
                        <div>
                            <p className="font-black text-yellow-800 dark:text-yellow-200">No resume uploaded</p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">Upload your resume to apply for jobs with one click</p>
                        </div>
                        </div>
                        <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-yellow-500 text-white rounded-2xl font-black text-sm hover:bg-yellow-600 transition-colors">
                        Upload Now
                        </button>
                    </div>
                    ) : (
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-[2rem] p-6 flex items-center gap-4 mb-8">
                        <CheckCircle2 className="text-green-500" size={24} />
                        <div>
                        <p className="font-black text-green-700 dark:text-green-300">Resume Ready</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Your resume will be auto-attached when you apply</p>
                        </div>
                    </div>
                    )}

                    {myApplications.length > 0 && (
                    <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <h3 className="font-black text-lg mb-6 text-gray-900 dark:text-white">Recent Applications</h3>
                        <div className="space-y-4">
                        {myApplications.slice(0, 3).map(app => {
                            const cfg = statusConfig[app.status] || statusConfig.Pending;
                            const Icon = cfg.icon;
                            return (
                            <div key={app._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Briefcase size={18} className="text-primary" /></div>
                                <div>
                                    <p className="font-black text-sm text-gray-900 dark:text-white">{app.jobRole}</p>
                                    <p className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                </div>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                                <Icon size={10} /> {app.status}
                                </span>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}
                </motion.div>
                )}

                {/* BROWSE JOBS */}
                {activeTab === 'browse' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                        const alreadyApplied = myApplications.some(a => a.job?._id === job._id);
                        return (
                            <motion.div 
                                whileHover={{ y: -8 }}
                                key={job._id} 
                                className="bg-white dark:bg-[#111827] rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-white/5 p-6 md:p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden h-full flex flex-col shadow-sm"
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
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 italic">{job.companyName}</p>
                                
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
                                </div>

                                {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-10">
                                    {job.requirements.slice(0, 3).map((r, i) => (
                                        <span key={i} className="text-[10px] bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl px-3 py-1.5 font-black uppercase tracking-wider border border-slate-100 dark:border-white/5">{r}</span>
                                    ))}
                                    </div>
                                )}
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
                            <div className="col-span-full py-32 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-6">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
                                    <Briefcase size={32} />
                                </div>
                                <p className="font-black text-slate-300 uppercase tracking-[0.5em] text-xs">No active opportunities detected</p>
                            </div>
                        )}
                    </div>
                    )}
                </motion.div>
                )}        {/* MY APPLICATIONS */}
                {activeTab === 'applications' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Track Record</h1>
                    <p className="text-gray-500 font-medium mb-8">{myApplications.length} total applications</p>
                    <div className="space-y-6">
                    {myApplications.map(app => {
                        const cfg = statusConfig[app.status] || statusConfig.Pending;
                        const Icon = cfg.icon;
                        return (
                        <div key={app._id} className="bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-lg transition-all">
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
                            {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline text-sm font-bold">
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
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl">
                    <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight font-poppins">Orders & <span className="text-primary italic">Bookings</span></h1>
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
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items</p>
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
                            {order.status === 'In Transit' && (
                            <button 
                                onClick={() => navigate('/track-mission', { state: { order } })}
                                className="px-6 py-3 bg-primary text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                            >
                                <MapPin size={12} /> Track Live Service
                            </button>
                            )}
                        </div>
                        </div>
                    ))}
                    {myOrders.length === 0 && (
                        <div className="py-20 text-center bg-gray-50 dark:bg-dark-bg border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest italic">No orders found in your vault</p>
                        </div>
                    )}
                    </div>
                </motion.div>
                )}

                {/* CHAT WITH QUIPPY */}
                {activeTab === 'quippy' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[3rem] p-12 text-center border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 rotate-12">
                                <Sparkles size={48} className="text-primary" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Meet <span className="text-primary italic">Quippy</span></h2>
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
                                    const quippyBtn = document.querySelector('button[aria-label="Toggle Quippy AI"]');
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[75vh] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Support <span className="text-primary italic">Chat</span></h1>
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
                                    const chatBtn = document.querySelector('button[aria-label="Open Chat"]');
                                    if (chatBtn) chatBtn.click();
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
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl">
                    <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight italic">Mission <span className="text-primary italic">Updates</span></h1>
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
                        <div className="py-20 text-center bg-gray-50 dark:bg-dark-bg border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                        <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest italic">All communication lines quiet</p>
                        </div>
                    )}
                    </div>
                </motion.div>
                )}

                {/* IDENTITY & CV */}
                {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-10 rotate-12">
                            <ShieldCheck size={48} />
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic font-poppins">Professional <span className="text-primary font-poppins">Identity</span></h3>
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
                <motion.div key="consulting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Premium Service</p>
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                                JOB <span className="text-primary italic">CONSULTING</span>
                            </h1>
                            <p className="text-gray-500 text-sm font-medium mt-2">One-on-one expert guidance to accelerate your career</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 px-6 py-3 rounded-2xl">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-sm font-black text-primary">₹1500 / Session</span>
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

                    {/* Consulting Form */}
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

                        {/* Security Note */}
                        <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                            <ShieldCheck size={18} className="text-green-500 shrink-0" />
                            <p className="text-xs text-gray-500 font-medium">
                                Your payment is processed securely via <strong>Razorpay</strong>. We never store your card details. 256-bit SSL encrypted.
                            </p>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handleConsultingPayment}
                            disabled={isSubmittingConsulting}
                            className="mt-8 w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmittingConsulting ? (
                                <><Loader2 className="animate-spin" size={18} /> Processing...</>
                            ) : (
                                <><CreditCard size={18} /> Pay ₹1500 &amp; Book Session</>
                            )}
                        </button>
                    </div>

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

        {/* Reschedule Modal */}
        <AnimatePresence>
            {reschedulingOrder && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4">
                <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-md rounded-[3rem] p-10 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter italic">Reschedule <span className="text-secondary italic font-poppins">Mission</span></h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Order #{reschedulingOrder._id.slice(-6).toUpperCase()}</p>
                
                <div className="space-y-6 mb-10">
                    <div>
                    <label className="block text-[10px] font-black uppercase text-secondary mb-2 tracking-widest italic">New Execution Date</label>
                    <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-secondary transition-all font-bold outline-none"
                    />
                    </div>
                    <div>
                    <label className="block text-[10px] font-black uppercase text-secondary mb-2 tracking-widest italic">New Time Hub</label>
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
        </AnimatePresence>
    </DashboardLayout>
  );
};

export default CandidateDashboard;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Globe, Zap, ChevronDown, Loader2, FileText, Building2, UserCircle, Truck, Briefcase, ShoppingBag, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ShopLocationPicker from '../components/ui/ShopLocationPicker';
import SEOMeta from '../components/ui/SEOMeta';

const Register = () => {
  const location = useLocation();
  const presetRole = location.state?.presetRole || 'Customer';

  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    mobile: '', 
    role: presetRole,    
    serviceInterest: 'General Shopping',
    industry: 'IT & Software',
    businessName: '',
    gstNumber: '',
    vehicleDetails: '',
    licenseNumber: '',
    companyName: '',
    vendorType: 'Product Seller',
    profileDocuments: [],
    distanceLimit: 10,
    exactLocation: { lat: 0, lng: 0, address: '' },
    strictPolicy: '',
    refundPolicy: '',
    resumeUrl: '',
    domainInterest: 'IT',
    candidateType: 'Standard', // Standard (Free) or Premium (Paid 1500)
    subscriptionLevel: 'Free', // Free (Default), Basic, Premium, Elite
    referredByAgentName: '',
    agentMobile: '',
    agentReference: '',
    additionalComments: '',
    acceptedTerms: false
  });

  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPendingApproval, setShowPendingApproval] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formDataUpload);
      const url = typeof data === 'string' ? (data.startsWith('/') ? `http://localhost:5000${data}` : data) : data.url || data;
      setFormData({ ...formData, profileDocuments: [...formData.profileDocuments, url] });
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async () => {
    // TEST MODE: Display QR code instead of Razorpay
    setShowQRModal(true);
  };

  const handleQRConfirm = () => {
    setShowQRModal(false);
    handleRegistrationSubmit({ 
        paymentId: 'TEST_QR_PAYMENT_' + Math.floor(Math.random() * 1000000),
        paymentStatus: 'Pending Verification'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Basic Presence Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.mobile || !formData.role) {
      setError('Strategic Error: Please fill in all required operational fields.');
      return;
    }

    // 2. Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid Signal: Please provide a valid professional email address.');
      return;
    }

    // 3. Mobile Regex Validation (Indian Standard)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Invalid Signal: Please provide a valid 10-digit mobile number.');
      return;
    }

    // 4. Password Strength (Minimum 6 characters)
    if (formData.password.length < 6) {
      setError('Security Warning: Password must be at least 6 characters long.');
      return;
    }

    // 5. Business Logic Validation
    if (formData.role === 'Vendor' || formData.role === 'Seller' || formData.role === 'Service Provider') {
        if (!formData.businessName || !formData.gstNumber) {
            setError('Operational Blocker: Business Name and GST/Tax ID are required for this role.');
            return;
        }
    }

    setError('');
    
    const isPremiumCandidate = formData.role === 'Candidate' && formData.candidateType === 'Premium';
    
    if (isPremiumCandidate) {
       handlePayment();
    } else {
       handleRegistrationSubmit();
    }
  };

  const handleRegistrationSubmit = async (paymentData = {}) => {
    setIsProcessing(true);
    try {
      const submissionData = { ...formData, ...paymentData };
      const { data } = await api.post('/auth/register', submissionData);
      
      if (data.approvalStatus === 'Pending') {
         setShowPendingApproval(true);
      } else {
         localStorage.setItem('token', data.token);
         localStorage.setItem('userInfo', JSON.stringify(data));
         window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const roleIcons = {
    Customer: UserCircle,
    Candidate: Briefcase,
    Vendor: Building2,
    Seller: ShoppingBag,
    'Service Provider': Wrench,
    HR: Network,
    'Delivery Partner': Truck
  };

  const RoleIcon = roleIcons[formData.role] || UserCircle;

  return (
    <>
      <SEOMeta 
        title="Register | Join Forge India Connect Ecosystem"
        description="Create your FIC account today. Join as a Customer, Job Seeker, Vendor, or Partner and access South India's premier business network."
        canonical="/register"
      />

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
                <Globe className="text-primary" size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
                Secure Scanner Pay
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Please consult with our sales team before making the payment. Scan and pay the <span className="text-primary font-black">₹1,500 Registration Fee</span> below.
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
                className="w-full btn-primary btn-lg flex items-center justify-center gap-2"
              >
                I have Scanned & Paid <CheckCircle2 size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-start justify-center px-4 pt-24 pb-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr,1.8fr] bg-white dark:bg-dark-card rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10"
        >
          {/* Left Side: Trust & Stats (Hidden on small screens) */}
          <div className="hidden lg:flex flex-col p-12 bg-slate-50 dark:bg-white/5 border-r border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-primary/20">
              <Network size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight tracking-tighter">Grow With South India's <span className="text-primary">Trusted Network.</span></h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Standardizing industrial recruitment and high-trust service fulfillment since 2020.</p>
            
            <div className="space-y-8">
              {[
                { title: 'Wide Reach', desc: 'Active in Chennai, Krishnagiri & Bangalore.', icon: Globe },
                { title: 'Verified Nodes', desc: 'Secure community of 180+ corporate partners.', icon: ShieldCheck },
                { title: 'Strategic Ops', desc: 'Lightning-fast placement & service delivery.', icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Create Account</h2>
                <div className="h-1.5 w-16 bg-primary rounded-full"></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800 pr-5">
                  <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                    <RoleIcon size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Joining as</p>
                     <p className="text-xs font-black text-primary leading-none uppercase">{formData.role}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    // Trigger the global role modal or just let them use the select below
                    document.getElementById('role-select-input')?.focus();
                  }}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Change Role?
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl mb-8 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" required placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="form-input !rounded-2xl py-4 w-full" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" required placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="form-input !rounded-2xl py-4 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input !rounded-2xl py-4" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                  <input type="tel" required placeholder="+91 00000 00000" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="form-input !rounded-2xl py-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                  <div className="relative">
                    <select 
                      id="role-select-input"
                      required 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      className="form-input !rounded-2xl py-4 appearance-none cursor-pointer pr-12 dark:bg-dark-bg dark:text-white"
                    >
                      <option value="Customer" className="text-slate-900 bg-white">Customer / Individual</option>
                      <option value="Trainer" className="text-slate-900 bg-white">Academic Trainer</option>
                      <option value="Candidate" className="text-slate-900 bg-white">Job Seeker / Candidate</option>
                      <option value="Vendor" className="text-slate-900 bg-white">Vendor (Bulk/B2B)</option>
                      <option value="Seller" className="text-slate-900 bg-white">Direct Product Seller</option>
                      <option value="Service Provider" className="text-slate-900 bg-white">Local Service Provider</option>
                      <option value="HR" className="text-slate-900 bg-white">HR / Recruiter</option>
                      <option value="Delivery Partner" className="text-slate-900 bg-white">Delivery Partner</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                  <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="form-input !rounded-2xl py-4" />
                </div>
              </div>

              {/* Dynamic Role Fields */}
              <AnimatePresence mode="wait">
                {formData.role === 'Customer' && (
                  <motion.div key="cust" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Interest</label>
                    <div className="relative">
                      <select 
                        required 
                        value={formData.serviceInterest} 
                        onChange={e => setFormData({...formData, serviceInterest: e.target.value})} 
                        className="form-input !rounded-2xl py-4 appearance-none cursor-pointer pr-12 dark:bg-dark-bg dark:text-white"
                      >
                        <option value="General Shopping" className="text-slate-900 bg-white">Product Shopping</option>
                        <option value="Job Consulting" className="text-slate-900 bg-white">Job Consulting (Membership)</option>
                        <option value="Home Services" className="text-slate-900 bg-white">Verified Home Services</option>
                        <option value="Business Inquiries" className="text-slate-900 bg-white">Corporate Inquiries</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </motion.div>
                )}

                {formData.role === 'Candidate' && (
                  <motion.div key="cand" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Level</label>
                        <div className="flex p-1 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800">
                          {['Standard', 'Premium'].map(t => (
                            <button key={t} type="button" onClick={() => setFormData({...formData, candidateType: t})} className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.candidateType === t ? 'bg-white dark:bg-dark-card text-primary shadow-sm' : 'text-slate-400'}`}>
                              {t === 'Standard' ? 'Free' : 'Consult (₹1.5k)'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Domain</label>
                        <select 
                          required 
                          value={formData.domainInterest} 
                          onChange={e => setFormData({...formData, domainInterest: e.target.value})} 
                          className="form-input !rounded-2xl py-4 appearance-none cursor-pointer dark:bg-dark-bg dark:text-white"
                        >
                          <option value="IT" className="text-slate-900 bg-white">IT / Software</option>
                          <option value="Banking" className="text-slate-900 bg-white">Banking & Finance</option>
                          <option value="Manufacturing" className="text-slate-900 bg-white">Manufacturing</option>
                          <option value="Other" className="text-slate-900 bg-white">Other Verticals</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Resume (PDF)</label>
                      <label className="w-full p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between cursor-pointer group hover:border-primary transition-all">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className={formData.resumeUrl ? "text-green-500" : "text-slate-300"} />
                          <span className="text-xs font-bold text-slate-500">{formData.resumeUrl ? 'Asset Attached' : 'Select PDF Document'}</span>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={async (e) => {
                          const f = e.target.files[0];
                          if(!f) return;
                          const d = new FormData(); d.append('file', f);
                          setUploading(true);
                          try { 
                              const {data} = await api.post('/upload', d); 
                              const url = typeof data === 'string' ? (data.startsWith('/') ? `http://localhost:5000${data}` : data) : data.url || data;
                              setFormData({...formData, resumeUrl: url}); 
                          }
                          catch (err) { setError('Upload failed'); } finally { setUploading(false); }
                        }} />
                        {uploading && <Loader2 className="animate-spin text-primary" size={16} />}
                      </label>
                    </div>
                  </motion.div>
                )}

                {(formData.role === 'Vendor' || formData.role === 'Seller' || formData.role === 'Service Provider') && (
                  <motion.div key="biz" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                        <input type="text" required placeholder="FIC Enterprises" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST/TAX ID</label>
                        <input type="text" required placeholder="29XXXXX..." value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Comments</label>
                        <input type="text" placeholder="Special requirements..." value={formData.additionalComments} onChange={e => setFormData({...formData, additionalComments: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 flex items-center gap-2"><Globe size={14}/> {formData.role === 'Service Provider' ? 'Service Area' : 'Shop Location'} on Map</label>
                      <ShopLocationPicker onLocationSelect={loc => setFormData({...formData, exactLocation: loc})} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {['Vendor', 'Seller', 'Service Provider', 'HR'].includes(formData.role) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-6 overflow-hidden pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Referral Details (Optional)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Reference Code</label>
                        <input type="text" placeholder="FIC-AGT-XXXX" value={formData.agentReference} onChange={e => setFormData({...formData, agentReference: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Name</label>
                        <input type="text" placeholder="Name of referring agent" value={formData.referredByAgentName} onChange={e => setFormData({...formData, referredByAgentName: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Mobile</label>
                        <input type="tel" placeholder="+91 ..." value={formData.agentMobile} onChange={e => setFormData({...formData, agentMobile: e.target.value})} className="form-input !rounded-2xl py-4" />
                      </div>
                    </div>
                  </motion.div>
              )}

              <button type="submit" disabled={uploading || isProcessing} className="btn-primary w-full !py-6 !rounded-2xl !text-sm group mt-6">
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Finalize Registration <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <p className="mt-10 text-center text-slate-500 font-bold text-sm">
              Already a member? <Link to="/login" className="text-primary hover:underline font-black uppercase tracking-widest text-[11px]">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Simplified Approval/Payment Modals (Logic remains, UI polished) */}
      <AnimatePresence>
        {showPendingApproval && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
               <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-secondary">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Payment Confirmed!</h3>
               <p className="text-slate-500 font-medium mb-10 leading-relaxed">Our expert will reach out to you shortly to finalize your onboarding.</p>
               <Link to="/" className="btn-primary w-full !py-5 !rounded-2xl !bg-slate-900">Explore Platform</Link>
            </motion.div>
          </motion.div>
        )}

        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
                  <Briefcase size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Consulting Membership</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 italic">LIFETIME PLACEMENT ASSURANCE</p>
               
               <div className="p-8 bg-slate-50 dark:bg-dark-bg rounded-[2rem] mb-10 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-3xl font-black text-primary">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Total Fee</span>
                    <span>₹1500.00</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <button onClick={handleRegistrationSubmit} className="btn-primary w-full !py-5 !rounded-2xl shadow-xl shadow-primary/20">Authorize & Pay</button>
                  <button onClick={() => setShowPayment(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500">Cancel</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Register;

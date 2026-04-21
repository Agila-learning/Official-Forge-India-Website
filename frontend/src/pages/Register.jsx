import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Globe, Zap, ChevronDown, Loader2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ShopLocationPicker from '../components/ui/ShopLocationPicker';

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
    // Candidate Specifics
    resumeUrl: '',
    domainInterest: 'IT',
    candidateType: 'Standard', // 'Standard' or 'Premium'
    acceptedTerms: false
  });
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
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
      const { data } = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, profileDocuments: [...formData.profileDocuments, data] });
      setUploading(false);
    } catch (err) {
      setError('File upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    // Role-specific validation
    if (formData.role === 'Vendor') {
        if (!formData.businessName || !formData.gstNumber) {
            setError('Business Name and GST are required for Vendors');
            return;
        }
        if (!formData.exactLocation.address) {
            setError('Please select your shop location on the map');
            return;
        }
    }
    if (formData.role === 'Delivery Partner' && (!formData.vehicleDetails || !formData.licenseNumber)) {
        setError('Vehicle and License details are required for Delivery Partners');
        return;
    }

    setError('');
    
    setError('');
    
    // Membership triggers ONLY for Job Consulting Customers OR Premium Candidates
    const isPremiumCandidate = formData.role === 'Candidate' && formData.candidateType === 'Premium';
    const isJobConsultingCustomer = formData.role === 'Customer' && formData.serviceInterest === 'Job Consulting';

    if (isJobConsultingCustomer || isPremiumCandidate) {
       setShowPayment(true);
    } else {
       handleMockPayment(); // Directly submit for others
    }
  };

  const handleMockPayment = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      
      if (data.approvalStatus === 'Pending') {
         setShowPayment(false);
         setShowPendingApproval(true);
         setIsProcessing(false);
      } else {
         localStorage.setItem('token', data.token);
         localStorage.setItem('userInfo', JSON.stringify(data));
         window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setShowPayment(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-start justify-center px-4 pt-32 pb-24 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full filter blur-[100px] opacity-70"></div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] bg-white dark:bg-dark-card rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 overflow-hidden relative z-10"
      >
        {/* Left Side: Branding & Trust */}
        <div className="hidden lg:flex flex-col p-12 bg-gray-50 dark:bg-white/5 border-r border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-primary/30 shrink-0">
                <Network size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">Step into the <br/> Future of <br/> Networking.</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-12">Join 5,000+ businesses and professionals shaping India's industry landscape.</p>
            
            <div className="space-y-8">
                {[
                    { title: 'Global Reach', desc: 'Connect with partners across borders.', icon: Globe },
                    { title: 'Verified Only', desc: 'Secure community of verified entities.', icon: ShieldCheck },
                    { title: 'Strategic Growth', desc: 'Access tools to scale your business.', icon: Zap }
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                             <CheckCircle2 size={20} className="text-primary" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-wider">{item.title}</h4>
                            <p className="text-xs text-gray-400 font-bold">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Right Side: Step-by-Step Form */}
        <div className="p-8 sm:p-14">
            <div className="mb-10 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-10">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 group-hover:rotate-12 transition-transform shadow-lg border border-gray-100 dark:border-gray-800">
                            <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none uppercase">Forge <span className="text-primary italic">India</span></span>
                            <span className="text-[10px] text-[#FFC107] font-black uppercase tracking-tight">Connect</span>
                        </div>
                    </Link>
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Create Account</h2>
                <div className="h-1.5 w-20 bg-primary rounded-full mx-auto lg:mx-0"></div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-5 rounded-2xl mb-8 text-sm font-black border border-red-100 dark:border-red-900/30 flex items-center gap-3"
                    >
                        <AlertCircle size={20} /> {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                        <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                        <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="Doe" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="company@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                        <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="+91 98765 43210" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Account Type</label>
                        <div className="relative">
                            <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold appearance-none cursor-pointer">
                                <option value="Customer">Customer / Shopper</option>
                                <option value="Candidate">Job Seeker / Candidate</option>
                                <option value="Vendor">Vendor / Seller</option>
                                <option value="HR">HR / Recruiter</option>
                                <option value="Delivery Partner">Delivery Partner</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="••••••••" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {formData.role === 'Customer' && (
                        <motion.div key="customer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 pb-4 overflow-hidden">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Service Interest</label>
                            <div className="relative">
                                <select required value={formData.serviceInterest} onChange={(e) => setFormData({...formData, serviceInterest: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold appearance-none cursor-pointer">
                                    <option value="General Shopping">General Shopping</option>
                                    <option value="Job Consulting">Job Consulting (Membership Required)</option>
                                    <option value="Home Services">Home Services</option>
                                    <option value="Business Inquiries">Business Inquiries</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {formData.role === 'Vendor' && (
                        <motion.div key="vendor" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Vendor Type</label>
                                    <div className="relative">
                                        <select required value={formData.vendorType} onChange={(e) => setFormData({...formData, vendorType: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold appearance-none cursor-pointer">
                                            <option value="Product Seller">Product Seller</option>
                                            <option value="Service Provider">Service Provider</option>
                                            <option value="Both">Both (Hybrid)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Business Name</label>
                                    <input type="text" required value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="Global Traders LLC" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">GST/TAX ID</label>
                                    <input type="text" required value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="29XXXXX..." />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Service / Delivery Radius (KMs)</label>
                                        <input type="number" required value={formData.distanceLimit} onChange={(e) => setFormData({...formData, distanceLimit: Number(e.target.value)})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold" placeholder="10" />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            {formData.vendorType === 'Product Seller' ? 'Refund / Return Policy' : 'Strict Compliance Policy'}
                                        </label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={formData.vendorType === 'Product Seller' ? formData.refundPolicy : formData.strictPolicy} 
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                [formData.vendorType === 'Product Seller' ? 'refundPolicy' : 'strictPolicy']: e.target.value
                                            })} 
                                            className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold" 
                                            placeholder="Standard 7-Day Refund / Local Compliance..." 
                                        />
                                     </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                        <Globe size={14} /> Pin Shop Location on Map
                                    </label>
                                    <ShopLocationPicker onLocationSelect={(loc) => setFormData({...formData, exactLocation: loc})} />
                                </div>
                             </div>
                        </motion.div>
                    )}

                    {formData.role === 'HR' && (
                        <motion.div key="hr" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                             <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Represented Company</label>
                                <input type="text" required value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="Tech Giants Pvt Ltd" />
                             </div>
                        </motion.div>
                    )}

                    {formData.role === 'Delivery Partner' && (
                        <motion.div key="delivery" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Vehicle Model / Fleet</label>
                                    <input type="text" required value={formData.vehicleDetails} onChange={(e) => setFormData({...formData, vehicleDetails: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="Tata Ace / Hero Splendor" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Driving License Number</label>
                                    <input type="text" required value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg transition-all focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="DL-XXXXX..." />
                                </div>
                             </div>
                        </motion.div>
                    )}
                    
                    {formData.role === 'Candidate' && (
                        <motion.div key="candidate" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Registration Type</label>
                                    <div className="flex gap-3">
                                        {['Standard', 'Premium'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, candidateType: type})}
                                                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                                                    formData.candidateType === type 
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                                    : 'bg-white dark:bg-dark-bg text-gray-400 border-gray-100 dark:border-gray-800'
                                                }`}
                                            >
                                                {type === 'Standard' ? 'Free Access' : 'Consulting (₹1500)'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Profile Domain</label>
                                    <select required value={formData.domainInterest} onChange={(e) => setFormData({...formData, domainInterest: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold appearance-none cursor-pointer">
                                        <option value="IT">Information Technology</option>
                                        <option value="Banking">Banking & Finance</option>
                                        <option value="Non-IT">Non-IT / Management</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Automobile">Automobile</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Resume / CV (Master Copy)</label>
                                    <label className="w-full px-5 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg flex items-center justify-between cursor-pointer group transition-all hover:border-primary/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center shadow-sm">
                                                <FileText size={18} className={formData.resumeUrl ? "text-green-500" : "text-gray-300"} />
                                            </div>
                                            <span className="text-gray-400 font-bold text-sm truncate">{formData.resumeUrl ? 'Asset Attached Successfully' : 'Select PDF/DOCX Document'}</span>
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const upData = new FormData();
                                            upData.append('file', file);
                                            setUploading(true);
                                            try {
                                                const { data } = await api.post('/upload', upData);
                                                setFormData({ ...formData, resumeUrl: data });
                                            } catch (err) { setError('Resume upload failed'); }
                                            setUploading(false);
                                        }} />
                                    </label>
                                </div>
                              </div>
                             
                              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                <div className="flex items-start gap-4">
                                    <input type="checkbox" required checked={formData.acceptedTerms} onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})} className="mt-1 w-6 h-6 accent-primary rounded-lg cursor-pointer" />
                                    <div>
                                        <p className="font-black text-xs uppercase text-primary mb-1">Service Protocols & Parity</p>
                                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                                            {formData.candidateType === 'Premium' ? (
                                                <>I agree to pay the <strong className="text-dark-bg dark:text-white">₹1500 Consulting Fee</strong> for 100% placement assurance and professional grooming. I acknowledge that this fee is <strong className="text-red-500 uppercase tracking-tighter">Non-Refundable</strong> once verification begins.</>
                                            ) : (
                                                <>I agree to use the Forge India Connect platform for standard job search and tracking. I understand that <strong className="text-dark-bg dark:text-white">Standard Access</strong> includes browsing and direct application without specialized consulting services.</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                              </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* KYC Multi-Document Upload - Only for Vendors, HR, and Delivery Partners */}
                {formData.role !== 'Customer' && formData.role !== 'Candidate' && (
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Verification Documents (GST/License/ID)</label>
                        <div className="flex flex-wrap gap-4">
                            {formData.profileDocuments.map((doc, idx) => (
                                <div key={idx} className="px-4 py-2 bg-primary/10 rounded-xl text-primary text-xs flex items-center gap-2 font-bold">
                                     <CheckCircle2 size={14} /> Document {idx + 1}
                                </div>
                            ))}
                            <label className="px-6 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:border-primary transition-colors font-bold">
                                <input type="file" className="hidden" onChange={handleFileUpload} />
                                {uploading ? <Loader2 className="animate-spin" size={14} /> : '+ Upload Document'}
                            </label>
                        </div>
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={uploading || isProcessing} 
                  className="w-full bg-secondary hover:bg-yellow-400 text-dark-bg py-5 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                    {(formData.role === 'Candidate' && formData.candidateType === 'Premium') || (formData.role === 'Customer' && formData.serviceInterest === 'Job Consulting') ? 'Authorize Membership Fee' : 'Finalize Registration'} <ArrowRight size={22} />
                </button>
            </form>

            <p className="mt-8 text-center text-gray-500 font-bold">
                Member already? <Link to="/login" className="text-primary hover:underline">Sign in securely</Link>
            </p>
        </div>
      </motion.div>

      {/* Pending Approval / Callback Success Modal */}
      <AnimatePresence>
        {showPendingApproval && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="bg-[#030712] w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(59,130,246,0.25)] border border-white/10 text-center relative"
            >
              {/* Top Gradient Banner */}
              <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-secondary"></div>
              
              <div className="p-12">
                {/* Animated Checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30"
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-4xl font-black text-white mb-4 leading-tight"
                >
                  Thank You for <br/>Registering!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-zinc-400 font-medium mb-3 leading-relaxed text-base"
                >
                  Your <strong className="text-white">{formData.role}</strong> application has been received by our team.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black mb-10"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  You will receive a callback shortly!
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="text-zinc-500 text-sm font-medium mb-8"
                >
                  While you wait, explore our wide range of services and discover what Forge India Connect has to offer you.
                </motion.p>

                <div className="flex flex-col gap-4">
                  <Link 
                    to="/services/job-consulting"
                    className="w-full py-4 rounded-2xl font-black text-dark-bg bg-secondary hover:bg-yellow-400 shadow-xl shadow-secondary/20 block text-center transition-all hover:scale-[1.02] active:scale-95"
                  >
                    ✨ Explore Our Services
                  </Link>
                  <Link 
                    to="/login"
                    className="w-full py-4 rounded-2xl font-bold text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white block text-center transition-all"
                  >
                    Sign In After Approval
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Membership Payment Modal */}
      <AnimatePresence>
        {showPayment && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-dark-bg/90 backdrop-blur-2xl p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[3rem] border border-gray-100 dark:border-gray-800 p-12 shadow-3xl text-center"
                >
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-secondary">
                        <Zap size={40} />
                    </div>
                    
                    <h3 className="text-3xl font-black mb-2 italic">LIFETIME <span className="text-primary tracking-tighter">MEMBERSHIP</span></h3>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-10 opacity-60">Strategic Placement Access</p>
                    
                    <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Consultancy Fee</span>
                            <span className="text-xl font-bold">₹1500.00</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">GST (Integrated)</span>
                            <span className="text-sm font-bold text-gray-500">Included</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Final Authorization</span>
                            <span className="text-3xl font-black text-primary italic">₹1500.00</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-10 px-8">
                        Secure authorization via UPI, Card, or Net Banking. Payment is processed directly to <strong className="text-gray-900 dark:text-white">Forge India Connect (FIC)</strong>.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={handleMockPayment}
                            className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-primary/30 uppercase tracking-[0.4em] text-xs transition-all active:scale-[0.98]"
                        >
                            {isProcessing ? 'Processing Transaction...' : 'Authorize & Register'}
                        </button>
                        <button 
                            onClick={() => setShowPayment(false)}
                            className="w-full py-4 text-gray-400 font-black hover:text-red-500 transition-colors uppercase tracking-widest text-[10px]"
                        >
                            Cancel Application
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Register;

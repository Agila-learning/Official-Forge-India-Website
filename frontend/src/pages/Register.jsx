import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Globe, Zap, ChevronDown, Loader2, FileText, Building2, UserCircle, Truck, Briefcase } from 'lucide-react';
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
    candidateType: 'Standard', 
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
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

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
    
    const isPremiumCandidate = formData.role === 'Candidate' && formData.candidateType === 'Premium';
    const isJobConsultingCustomer = formData.role === 'Customer' && formData.serviceInterest === 'Job Consulting';

    if (isJobConsultingCustomer || isPremiumCandidate) {
       setShowPayment(true);
    } else {
       handleRegistrationSubmit();
    }
  };

  const handleRegistrationSubmit = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      if (data.approvalStatus === 'Pending') {
         setShowPayment(false);
         setShowPendingApproval(true);
      } else {
         localStorage.setItem('token', data.token);
         localStorage.setItem('userInfo', JSON.stringify(data));
         window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setShowPayment(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const roleIcons = {
    Customer: UserCircle,
    Candidate: Briefcase,
    Vendor: Building2,
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
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800 pr-5">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <RoleIcon size={20} />
                </div>
                <div className="text-left">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Joining as</p>
                   <p className="text-xs font-black text-primary leading-none uppercase">{formData.role}</p>
                </div>
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
                  <input type="text" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="form-input !rounded-2xl py-4 w-full" />
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
                    <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field !rounded-2xl py-4 appearance-none cursor-pointer pr-12">
                      <option value="Customer">Customer / Individual</option>
                      <option value="Candidate">Job Seeker / Candidate</option>
                      <option value="Vendor">Vendor / Business Seller</option>
                      <option value="HR">HR / Recruiter</option>
                      <option value="Delivery Partner">Delivery Partner</option>
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
                      <select required value={formData.serviceInterest} onChange={e => setFormData({...formData, serviceInterest: e.target.value})} className="input-field !rounded-2xl py-4 appearance-none cursor-pointer pr-12">
                        <option value="General Shopping">Product Shopping</option>
                        <option value="Job Consulting">Job Consulting (Membership)</option>
                        <option value="Home Services">Verified Home Services</option>
                        <option value="Business Inquiries">Corporate Inquiries</option>
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
                        <select required value={formData.domainInterest} onChange={e => setFormData({...formData, domainInterest: e.target.value})} className="form-input !rounded-2xl py-4">
                          <option value="IT">IT / Software</option>
                          <option value="Banking">Banking & Finance</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Other">Other Verticals</option>
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
                          try { const {data} = await api.post('/upload', d); setFormData({...formData, resumeUrl: data}); }
                          catch { setError('Upload failed'); } finally { setUploading(false); }
                        }} />
                        {uploading && <Loader2 className="animate-spin text-primary" size={16} />}
                      </label>
                    </div>
                  </motion.div>
                )}

                {formData.role === 'Vendor' && (
                  <motion.div key="vend" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden pt-4 border-t border-slate-100 dark:border-slate-800">
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
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 flex items-center gap-2"><Globe size={14}/> Shop Location on Map</label>
                      <ShopLocationPicker onLocationSelect={loc => setFormData({...formData, exactLocation: loc})} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Application Received</h3>
               <p className="text-slate-500 font-medium mb-10 leading-relaxed">Our team will verify your documents and contact you within <strong className="text-slate-900 dark:text-white">24-48 hours</strong> to finalize your onboarding.</p>
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

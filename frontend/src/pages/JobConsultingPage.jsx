import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import { 
 Briefcase, CheckCircle2, ArrowRight, Star, Users,
 Building2, GraduationCap, FileText, PhoneCall,
 Phone, Zap, Check, ShieldCheck, Target, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const sectors = [
 { name: 'Banking & Finance', roles: ['Relationship Manager', 'Bank PO', 'Loan Officer', 'Credit Analyst'], companies: ['HDFC Bank', 'ICICI Bank', 'Kotak Mahindra', 'Axis Bank', 'Yes Bank'] },
 { name: 'IT & Software', roles: ['Software Developer', 'QA Engineer', 'Tech Support', 'Data Analyst'], companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'] },
 { name: 'BPO / ITES', roles: ['Customer Service', 'Process Associate', 'Team Leader', 'Voice Support'], companies: ['Accenture', 'Concentrix', 'Teleperformance', 'WNS', 'EXL'] },
 { name: 'Insurance', roles: ['LIC Agent', 'Insurance Advisor', 'Claims Executive', 'Underwriter'], companies: ['LIC', 'Max Life', 'HDFC Life', 'Bajaj Allianz', 'Reliance'] },
];

const JobConsultingPage = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
 consultingType: 'Career Guidance',
 experience: 'Fresher (0-1 yr)',
 currentRole: '',
 specificRequirement: '',
 contactNumber: '',
 });

 useEffect(() => {
 const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
 if (userInfo) {
 setFormData(prev => ({
 ...prev,
 contactNumber: userInfo.mobile || userInfo.phone || '',
 currentRole: userInfo.candidateRole || ''
 }));
 }
 }, []);

 const handlePayment = async (e) => {
 if (e) e.preventDefault();
 const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 
 if (!userInfo) {
 toast.error('Strategic Authorization Required: Please login to proceed.');
 navigate('/login');
 return;
 }

 if (!formData.contactNumber || !formData.specificRequirement) {
 toast.error('Mission Parameters Incomplete: Contact number and requirements are mandatory.');
 return;
 }

 setLoading(true);
 try {
 const { data } = await api.post('/job-consulting/submit', formData);
 if (!data.success) {
 throw new Error(data.message || 'Failed to save inquiry.');
 }
 toast.success('Inquiry registered! Redirecting to secure payment...', { duration: 3000 });
 setTimeout(() => {
 window.open(data.paymentLink, '_blank', 'noopener,noreferrer');
 }, 800);
 } catch (err) {
 toast.error(err.response?.data?.message || err.message || 'Gateway Operational Failure');
 } finally {
 setLoading(false);
 }
 };

 const handleQuickPay = async () => {
 const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 if (!userInfo) {
 toast.error('Strategic Authorization Required: Please login for Quick Pay.');
 navigate('/login');
 return;
 }

 if (!formData.contactNumber || !formData.specificRequirement) {
   toast.error('Please complete the mission parameters below before Quick Pay.');
   document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' });
   return;
 }
 
 const quickFormData = {
 ...formData,
 specificRequirement: formData.specificRequirement,
 contactNumber: formData.contactNumber,
 };

 setLoading(true);
 try {
 const { data } = await api.post('/job-consulting/submit', quickFormData);
 if (!data.success) throw new Error(data.message);
 toast.success('Redirecting to secure payment gateway...', { duration: 3000 });
 setTimeout(() => {
 window.open(data.paymentLink, '_blank', 'noopener,noreferrer');
 }, 800);
 } catch (err) {
 toast.error(err.response?.data?.message || err.message || 'Failed to initiate payment.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <>
 <SEOMeta 
 title="Elite Career Consulting | Forge India Connect"
 description="Professional recruitment consulting, resume review, and interview preparation. Accelerate your career mission with FIC."
 />
 
 {/* --- 🌟 HERO SECTION (Modern & Bright) --- */}
 <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-dark-bg">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64" />
 <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-400/5 dark:bg-blue-500/10 rounded-full blur-[120px] -ml-96 -mb-96" />
 
 <div className="max-w-[1536px] mx-auto px-6 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 <div className="max-w-3xl">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 rounded-full mb-8"
 >
 <Target size={14} />
 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Elite Career Intelligence Protocol</span>
 </motion.div>
 
 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8 uppercase">
 Command Your <br />
 <span className="text-primary relative inline-block mt-2">
 Trajectory.
 <svg className="absolute w-full h-4 -bottom-1 left-0 text-secondary" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
 </span>
 </h1>
 
 <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl">
 Deploy advanced career re-engineering. From elite resume synthesis to strategic theater preparation, we ensure your absolute market dominance in India's top corporate sectors.
 </p>

 <div className="flex flex-wrap gap-4">
 <button 
 onClick={() => document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' })}
 className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest text-xs flex items-center gap-3"
 >
 Initiate Mission <ArrowRight size={18} />
 </button>
 <a href="tel:+916369406416" className="px-10 py-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:border-primary/50 transition-all uppercase tracking-widest text-xs flex items-center gap-3 shadow-sm">
 Direct Uplink <Phone size={18} />
 </a>
 </div>
 
 <div className="mt-16 flex items-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-8">
 {[
 { v: '1500+', l: 'Success Rate' },
 { v: '₹45L+', l: 'Top Package' },
 { v: '98%', l: 'Placement' }
 ].map((s, i) => (
 <div key={i}>
 <p className="text-3xl font-black text-gray-900 dark:text-white">{s.v}</p>
 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.l}</p>
 </div>
 ))}
 </div>
 </div>
 
 <div className="relative hidden lg:block">
 <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-400 rounded-[3rem] blur-2xl opacity-20 transform rotate-3 scale-105"></div>
 <img 
 src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop" 
 alt="Career Consulting" 
 className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl"
 />
 <div className="absolute bottom-10 -left-10 bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 flex items-center gap-4">
 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
 <TrendingUp size={24} />
 </div>
 <div>
 <p className="text-2xl font-black text-gray-900 dark:text-white">300%</p>
 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg Salary Hike</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* --- 🏢 SECTOR INTELLIGENCE --- */}
 <section className="py-24 bg-gray-50 dark:bg-[#0a0a0b] border-t border-gray-200 dark:border-gray-800">
 <div className="max-w-[1536px] mx-auto px-6">
 <div className="text-center max-w-3xl mx-auto mb-16">
 <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Sector <span className="text-primary">Intelligence</span></h2>
 <p className="text-gray-500 font-medium">Deep-node access to India's most prestigious corporate theaters. Explore the domains we dominate.</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {sectors.map((sector, i) => (
 <motion.div 
 key={i} 
 whileHover={{ y: -5 }}
 className="bg-white dark:bg-dark-card p-10 md:p-12 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group"
 >
 <div className="flex items-center gap-6 mb-10">
 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
 <Building2 size={32} />
 </div>
 <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">{sector.name}</h3>
 </div>
 
 <div className="space-y-8">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Deployment Roles</p>
 <div className="flex flex-wrap gap-2">
 {sector.roles.map(r => <span key={r} className="px-4 py-2 bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase rounded-xl border border-gray-100 dark:border-gray-800">{r}</span>)}
 </div>
 </div>
 
 <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Tactical Partners</p>
 <div className="flex flex-wrap gap-x-6 gap-y-3">
 {sector.companies.map(c => <span key={c} className="text-gray-500 dark:text-gray-400 font-black text-xs md:text-sm uppercase tracking-tight">{c}</span>)}
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* --- 💎 THE ELITE PROTOCOL & FORM --- */}
 <section id="consulting-form-section" className="py-24 bg-white dark:bg-dark-bg relative overflow-hidden">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
 
 <div className="max-w-[1536px] mx-auto px-6 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
 
 {/* Left: Pricing & Perks */}
 <div className="lg:col-span-5 space-y-8 sticky top-32">
 <div className="bg-gradient-to-br from-gray-900 to-black p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
 
 <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 inline-block">Tier 1 Authorization</span>
 <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">Elite Consultation</h3>
 
 <div className="flex items-baseline gap-3 mb-10">
 <span className="text-6xl font-black tracking-tighter">₹2,500</span>
 <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">/ Session</span>
 </div>

 <div className="space-y-5 mb-12">
 {[
 'Elite Resume Synthesis & Re-engineering',
 'Strategic Theatre (Interview) Simulation',
 'Direct Pipeline to Lead Tech Vendors',
 'High-Level Salary Negotiation Tactics',
 'Post-Deployment Support Protocol'
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-4 text-gray-300 font-medium">
 <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
 <Check size={14} />
 </div>
 <span className="text-sm font-bold uppercase tracking-tight">{item}</span>
 </div>
 ))}
 </div>

 <button 
 onClick={handleQuickPay}
 className="w-full py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/10 active:scale-95 flex items-center justify-center gap-2 group"
 >
 Instant Quick Pay <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
 </button>
 </div>

 <div className="p-8 bg-gray-50 dark:bg-dark-card rounded-[2.5rem] border border-gray-200 dark:border-gray-800 flex items-center gap-6">
 <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
 <ShieldCheck size={32} />
 </div>
 <div>
 <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">Strategic Assurance</h4>
 <p className="text-xs text-gray-500 font-medium leading-relaxed">
 Consultations are conducted by industry veterans with 15+ years of tactical enterprise experience.
 </p>
 </div>
 </div>
 </div>

 {/* Right: The Form */}
 <div className="lg:col-span-7">
 <div className="bg-white dark:bg-dark-card p-10 md:p-16 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl relative">
 <div className="absolute top-0 left-16 w-32 h-1.5 bg-primary rounded-b-lg" />
 <div className="mb-12">
 <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3">Initiate Mission</h3>
 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Define your tactical parameters below to generate your brief.</p>
 </div>
 <ConsultingForm formData={formData} setFormData={setFormData} handlePayment={handlePayment} loading={loading} />
 </div>
 </div>

 </div>
 </div>
 </section>

 {/* --- 📞 COMMAND CENTER --- */}
 <section className="py-24 bg-primary relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay" />
 <div className="max-w-4xl mx-auto relative z-10 text-center px-6">
 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-10 leading-tight">Need Direct <br /> Tactical Support?</h2>
 <div className="flex flex-col sm:flex-row justify-center gap-6">
 <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
 className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3">
 WhatsApp Command <ArrowRight size={18} />
 </a>
 <Link to="/contact" className="px-10 py-5 bg-blue-800/50 backdrop-blur-md text-white font-black rounded-2xl hover:bg-blue-800 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs border border-white/20">
 Contact HQ
 </Link>
 </div>
 </div>
 </section>

 </>
 );
};

const ConsultingForm = ({ formData, setFormData, handlePayment, loading }) => {
 return (
 <form className="space-y-8" onSubmit={handlePayment}>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Consultation Protocol</label>
 <div className="relative">
 <Briefcase size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
 <select 
 value={formData.consultingType}
 onChange={(e) => setFormData({...formData, consultingType: e.target.value})}
 className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
 >
 <option>Career Guidance</option>
 <option>Resume Review</option>
 <option>Interview Preparation</option>
 <option>Salary Negotiation</option>
 <option>Domain Switch Guidance</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Experience Level</label>
 <select 
 value={formData.experience}
 onChange={(e) => setFormData({...formData, experience: e.target.value})}
 className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
 >
 <option>Fresher (0-1 yr)</option>
 <option>1-3 Years</option>
 <option>3-6 Years</option>
 <option>6-10 Years</option>
 <option>10+ Years</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Contact Number</label>
 <input 
 type="tel" required placeholder="+91 XXXXX XXXXX"
 value={formData.contactNumber}
 onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
 className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Current/Target Role</label>
 <input 
 type="text" placeholder="e.g. Relationship Manager, Software Dev"
 value={formData.currentRole}
 onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
 className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
 />
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Specific Requirements</label>
 <textarea 
 rows="5" required placeholder="What are your primary goals for this session?"
 value={formData.specificRequirement}
 onChange={(e) => setFormData({...formData, specificRequirement: e.target.value})}
 className="w-full px-6 py-5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
 />
 </div>

 <button 
 type="submit" 
 disabled={loading}
 className="w-full py-5 bg-primary text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-3"
 >
 {loading ? (
 <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing Secure Uplink...</span>
 ) : (
 <>Confirm & Pay ₹2,500 <ArrowRight size={18} /></>
 )}
 </button>
 
 <p className="text-[9px] text-center text-gray-400 font-bold uppercase leading-relaxed px-4 tracking-widest">
 By clicking, you agree to our terms. Consultations are typically scheduled within 24-48 hours post-payment verification.
 </p>
 </form>
 );
};

export default JobConsultingPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import { 
  Briefcase, CheckCircle2, ArrowRight, Star, Users,
  Building2, GraduationCap, FileText, PhoneCall,
  Phone, Zap, Check, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const sectors = [
  { name: 'Banking & Finance', roles: ['Relationship Manager', 'Bank PO', 'Loan Officer', 'Credit Analyst'], companies: ['HDFC Bank', 'ICICI Bank', 'Kotak Mahindra', 'Axis Bank', 'Yes Bank'] },
  { name: 'IT & Software',     roles: ['Software Developer', 'QA Engineer', 'Tech Support', 'Data Analyst'],    companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'] },
  { name: 'BPO / ITES',       roles: ['Customer Service', 'Process Associate', 'Team Leader', 'Voice Support'],  companies: ['Accenture', 'Concentrix', 'Teleperformance', 'WNS', 'EXL'] },
  { name: 'Insurance',         roles: ['LIC Agent', 'Insurance Advisor', 'Claims Executive', 'Underwriter'],      companies: ['LIC', 'Max Life', 'HDFC Life', 'Bajaj Allianz', 'Reliance'] },
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
      // 1. Save inquiry to DB for tracking
      const { data } = await api.post('/job-consulting/submit', formData);

      if (!data.success) {
        throw new Error(data.message || 'Failed to save inquiry.');
      }

      toast.success('Inquiry registered! Redirecting to secure payment...', { duration: 3000 });

      // 2. Redirect to the direct Razorpay payment link
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
    
    const quickFormData = {
      ...formData,
      specificRequirement: formData.specificRequirement || 'Quick Pay via Direct Dashboard Access',
      contactNumber: formData.contactNumber || userInfo.mobile || userInfo.phone || 'N/A',
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
    
    {/* Hero Section */}
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-950 via-primary to-indigo-800">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="badge-primary mb-6 !bg-white/20 !text-white">Strategic Career Advancement</span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter italic text-white">
              COMMAND YOUR <br />
              <span className="text-white/80">CAREER TRAJECTORY</span>
            </h1>
            <p className="text-lg text-white/70 mb-12 font-medium max-w-xl">
              From elite resume re-engineering to strategic salary negotiation, our specialists deploy 
              advanced tactics to secure your position in the global tech theater.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-primary font-black rounded-3xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
              >
                Initiate Consultation <ArrowRight size={18} />
              </button>
              <a href="tel:+916369406416" className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 border-2 border-white/20 text-white font-black rounded-3xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs">
                Speak to Expert <Phone size={18} />
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
             <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/20">
                <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80" alt="Career Strategy" className="w-full h-full object-cover aspect-square" />
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Sectors */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg/50">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sector, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl bg-white dark:bg-dark-card">
               <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic text-primary">{sector.name}</h3>
               <div className="flex flex-wrap gap-2 mb-6">
                 {sector.roles.map(r => <span key={r} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded-lg">{r}</span>)}
               </div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Elite Partners</p>
               <div className="flex flex-wrap gap-3">
                 {sector.companies.map(c => <span key={c} className="text-slate-500 font-bold">{c}</span>)}
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing / Booking Section */}
    <section id="consulting-form-section" className="section-padding overflow-hidden">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="glass-card p-10 md:p-12 rounded-[3rem] bg-slate-900 text-white border-none shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10">
                <span className="px-4 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20 mb-8 inline-block">Elite Tier Authorized</span>
                <h3 className="text-4xl font-black mb-6 italic tracking-tighter uppercase">Elite Consultation</h3>
                <div className="flex items-baseline gap-4 mb-10">
                <span className="text-6xl font-black text-white">₹2,500</span>
                  <span className="text-white/50 font-bold uppercase tracking-widest text-sm">/ Mission</span>
                </div>
                <ul className="space-y-4 mb-12">
                  {[
                    'One-on-One Strategic Strategy Session',
                    'A.I. Optimized Resume Re-engineering',
                    'Direct Referral to Top Tech Vendors',
                    'Priority Mock Interview Simulation',
                    'Strategic Salary Negotiation Guidance'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-white/80 font-medium">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                        <Check size={12} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                   <button 
                    onClick={() => document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary w-full !bg-white !text-primary hover:!bg-slate-100 !rounded-2xl !py-4 shadow-xl"
                   >
                     Book Now & Pay <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Direct Payment Access</h4>
              <p className="text-sm text-slate-500 mb-6 font-medium">Already discussed with us? Use our quick payment protocol for immediate slot reservation.</p>
              <button 
                onClick={handleQuickPay}
                className="inline-flex items-center justify-center gap-3 w-full py-5 bg-indigo-900 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-950 transition-all uppercase tracking-widest text-xs"
              >
                Quick Pay & Initiate Protocol <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-10 md:p-16 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <ConsultingForm formData={formData} setFormData={setFormData} handlePayment={handlePayment} loading={loading} />
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-primary overflow-hidden relative">
      <div className="container-xl text-center relative z-10">
        <h2 className="text-white text-4xl md:text-5xl mb-4 italic tracking-tighter">Need Immediate Assistance?</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-primary font-black rounded-3xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs">
            WhatsApp Command Center
          </a>
          <Link to="/register" className="inline-flex items-center gap-4 px-12 py-6 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-black rounded-3xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs">
            Register Free
          </Link>
        </div>
      </div>
    </section>
  </>
  );
};

const ConsultingForm = ({ formData, setFormData, handlePayment, loading }) => {
  return (
    <form className="space-y-6" onSubmit={handlePayment}>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Consultation Protocol</label>
        <select 
            value={formData.consultingType}
            onChange={(e) => setFormData({...formData, consultingType: e.target.value})}
            className="form-input !rounded-2xl"
        >
          <option>Career Guidance</option>
          <option>Resume Review</option>
          <option>Interview Preparation</option>
          <option>Salary Negotiation</option>
          <option>Domain Switch Guidance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Experience Level</label>
            <select 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="form-input !rounded-2xl"
            >
                <option>Fresher (0-1 yr)</option>
                <option>1-3 Years</option>
                <option>3-6 Years</option>
                <option>6-10 Years</option>
                <option>10+ Years</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Number</label>
            <input 
                type="tel" required placeholder="+91 XXXXX XXXXX"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="form-input !rounded-2xl"
            />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current/Target Role</label>
        <input 
            type="text" placeholder="e.g. Relationship Manager, Software Dev"
            value={formData.currentRole}
            onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
            className="form-input !rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Specific Requirements</label>
        <textarea 
            rows="4" required placeholder="What are your primary goals for this session?"
            value={formData.specificRequirement}
            onChange={(e) => setFormData({...formData, specificRequirement: e.target.value})}
            className="form-input !rounded-[2rem] py-5"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full !py-6 !rounded-3xl !text-sm group shadow-xl shadow-primary/20"
      >
        {loading ? 'Saving & Redirecting...' : <>Confirm & Pay ₹2,500 <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
      </button>
      
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase leading-relaxed px-4">
        By clicking, you agree to our terms. Consultations are typically scheduled within 24-48 hours post-payment verification.
      </p>
    </form>
  );
};

export default JobConsultingPage;

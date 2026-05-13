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
    
    {/* --- 🛡️ HERO: THE COMMAND CENTER --- */}
    <section className="relative pt-40 pb-24 overflow-hidden bg-[#0a0a0b]">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="container-xl relative z-10 px-6">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Elite Career Intelligence Protocol</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400">Trajectory.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/40 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
            Deploy advanced career re-engineering. From elite resume synthesis to strategic theater preparation, we ensure your absolute market dominance.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 bg-primary text-white font-black rounded-[2rem] shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center gap-3"
            >
              Initiate Mission <ArrowRight size={18} />
            </button>
            <a href="tel:+916369406416" className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] hover:bg-white/10 transition-all uppercase tracking-widest text-xs flex items-center gap-3">
              Direct Uplink <Phone size={18} />
            </a>
          </div>
        </div>

        {/* --- STATS OVERLAY --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
          {[
            { v: '1500+', l: 'Missions Success' },
            { v: '₹45L+', l: 'Highest Package' },
            { v: '98%', l: 'Placement Rate' },
            { v: '24/7', l: 'Tactical Support' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-white mb-1">{s.v}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* --- 🧬 SECTOR INTELLIGENCE --- */}
    <section className="py-32 bg-[#0a0a0b] px-6">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl text-left">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">Sector <span className="text-primary">Intelligence</span></h2>
            <p className="text-white/40 font-medium">Deep-node access to India's most prestigious corporate theaters.</p>
          </div>
          <div className="h-px flex-1 bg-white/5 mb-4 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sector, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="glass-card p-12 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent group"
            >
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Building2 size={28} />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight text-white">{sector.name}</h3>
               </div>
               
               <div className="space-y-8">
                 <div>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Core Deployment Roles</p>
                   <div className="flex flex-wrap gap-2">
                     {sector.roles.map(r => <span key={r} className="px-4 py-2 bg-white/5 text-white/60 text-[10px] font-black uppercase rounded-xl border border-white/5">{r}</span>)}
                   </div>
                 </div>
                 
                 <div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Tactical Partners</p>
                   <div className="flex flex-wrap gap-x-6 gap-y-3">
                     {sector.companies.map(c => <span key={c} className="text-white/40 font-black text-sm uppercase tracking-tight">{c}</span>)}
                   </div>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* --- 💎 THE ELITE PROTOCOL --- */}
    <section id="consulting-form-section" className="py-32 bg-[#0a0a0b] relative overflow-hidden px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Pricing & Perks */}
          <div className="lg:col-span-5 space-y-12">
            <div className="glass-card p-12 rounded-[4rem] bg-gradient-to-br from-primary/20 via-slate-900 to-black border-primary/30 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
              <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10 inline-block">Tier 1 Authorization</span>
              <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter">Elite Consultation</h3>
              
              <div className="flex items-baseline gap-4 mb-12">
                <span className="text-7xl font-black text-white tracking-tighter">₹2,500</span>
                <span className="text-white/40 font-black uppercase tracking-widest text-xs">/ Consultation</span>
              </div>

              <div className="space-y-6 mb-12">
                {[
                  'Elite Resume Synthesis & Re-engineering',
                  'Strategic Theatre (Interview) Simulation',
                  'Direct Pipeline to Lead Tech Vendors',
                  'High-Level Salary Negotiation Tactics',
                  'Post-Deployment Support Protocol'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 text-white/70 font-medium">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleQuickPay}
                className="w-full py-6 bg-white text-black font-black rounded-[2rem] text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
              >
                Instant Quick Pay <ArrowRight size={18} />
              </button>
            </div>

            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-xl">
              <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Strategic Assurance</h4>
              <p className="text-sm text-white/40 font-medium leading-relaxed">
                Consultations are conducted by industry veterans with over 15+ years of tactical experience in enterprise recruitment.
              </p>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-12 md:p-16 rounded-[4rem] border border-white/10 bg-white/5 backdrop-blur-2xl relative">
              <div className="absolute top-0 left-12 w-24 h-1 bg-primary" />
              <div className="mb-12">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Initiate Mission</h3>
                <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest">Define your tactical parameters below.</p>
              </div>
              <ConsultingForm formData={formData} setFormData={setFormData} handlePayment={handlePayment} loading={loading} />
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* --- 📞 COMMAND CENTER --- */}
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')] opacity-20 mix-blend-overlay" />
      <div className="container-xl relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic mb-12">Need Direct <br /> Support?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
            className="px-16 py-8 bg-white text-primary font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center gap-4">
            WhatsApp Command Center <ArrowRight size={20} />
          </a>
          <Link to="/register" className="px-16 py-8 bg-black text-white font-black rounded-[2.5rem] hover:bg-slate-900 transition-all uppercase tracking-[0.2em] text-xs border border-white/10">
            Secure Enrollment
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

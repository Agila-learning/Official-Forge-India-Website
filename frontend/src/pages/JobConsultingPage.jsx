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
    email: '',
    domain: 'General',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        contactNumber: userInfo.mobile || userInfo.phone || '',
        email: userInfo.email || '',
        currentRole: userInfo.candidateRole || ''
      }));
    }
  }, []);

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.contactNumber || !formData.specificRequirement || !formData.email) {
        toast.error('Mission Parameters Incomplete: Email, Contact number and requirements are mandatory.');
        return;
    }

    setLoading(true);
    try {
      // 1. Submit Inquiry & Get Razorpay Order
      const { data } = await api.post('/job-consulting/submit', formData);

      if (!data.success) {
        throw new Error(data.message || 'Failed to save inquiry.');
      }

      // 2. If Razorpay Order ID exists, open modal
      if (data.razorpayOrderId) {
        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: data.currency,
          name: "Forge India Connect",
          description: `Job Consulting - ${formData.consultingType}`,
          image: "/logo.jpg",
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            setLoading(true);
            try {
              await api.post('/job-consulting/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                inquiryId: data.inquiryId
              });
              setPaymentSuccess(true);
              toast.success('🎉 Transaction successful! Expert will contact you shortly.');
              setFormData({
                ...formData,
                specificRequirement: '',
              });
            } catch (err) {
              toast.error('Payment verification failed.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: data.candidateName,
            email: formData.email,
            contact: formData.contactNumber
          },
          theme: { color: "#2563eb" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.error('Payment cancelled');
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to direct link if order creation failed
        toast.info('Redirecting to secure payment link...');
        setTimeout(() => {
          window.open(data.paymentLink, '_blank');
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Gateway Operational Failure');
      setLoading(false);
    }
  };

  const handleQuickPay = () => handlePayment();

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
                <span className="text-6xl font-black text-white">₹{formData.domain === 'Banking' ? '2,500' : '1,500'}</span>
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
                     Select Domain & Pay <ArrowRight size={18} />
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
            
            <AnimatePresence>
              {paymentSuccess && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary italic">Confirmed</span></h3>
                    <p className="text-slate-500 font-medium">Your consulting session for <strong>{formData.domain}</strong> has been secured. Our expert strategist will reach you within 24-48 hours.</p>
                    <button onClick={() => setPaymentSuccess(false)} className="px-8 py-3 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-lg">Acknowledged</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Domain *</label>
            <select 
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                className="form-input !rounded-2xl"
            >
                <option value="General">General Consultation (₹1,500)</option>
                <option value="IT / Software">IT / Software (₹1,500)</option>
                <option value="Banking">Banking & Finance (₹2,500)</option>
                <option value="Core Engineering">Core Engineering (₹1,500)</option>
                <option value="Non-IT">Non-IT / Others (₹1,500)</option>
            </select>
        </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Node *</label>
            <input 
                type="email" required placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-input !rounded-2xl"
            />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Number *</label>
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
        {loading ? 'Saving & Redirecting...' : <>Confirm & Pay ₹{formData.domain === 'Banking' ? '2,500' : '1,500'} <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
      </button>
      
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase leading-relaxed px-4">
        By clicking, you agree to our terms. Consultations are typically scheduled within 24-48 hours post-payment verification.
      </p>
    </form>
  );
};

export default JobConsultingPage;

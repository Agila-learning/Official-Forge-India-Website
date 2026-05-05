import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import {
  Briefcase, CheckCircle2, ArrowRight, Star, Users,
  Building2, GraduationCap, FileText, PhoneCall
} from 'lucide-react';

const sectors = [
  { name: 'Banking & Finance', roles: ['Relationship Manager', 'Bank PO', 'Loan Officer', 'Credit Analyst'], companies: ['HDFC Bank', 'ICICI Bank', 'Kotak Mahindra', 'Axis Bank', 'Yes Bank'] },
  { name: 'IT & Software',     roles: ['Software Developer', 'QA Engineer', 'Tech Support', 'Data Analyst'],    companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'] },
  { name: 'BPO / ITES',       roles: ['Customer Service', 'Process Associate', 'Team Leader', 'Voice Support'],  companies: ['Accenture', 'Concentrix', 'Teleperformance', 'WNS', 'EXL'] },
  { name: 'Insurance',         roles: ['LIC Agent', 'Insurance Advisor', 'Claims Executive', 'Underwriter'],      companies: ['LIC', 'Max Life', 'HDFC Life', 'Bajaj Allianz', 'Reliance'] },
];

const process = [
  { step: '01', title: 'Register Online', desc: 'Fill our quick registration form with your details and preferred role.' },
  { step: '02', title: 'Document Verification', desc: 'Upload and verify your qualifications and ID — takes under 24 hours.' },
  { step: '03', title: 'Profile Processing', desc: 'Our counsellors craft your profile and match it with active openings.' },
  { step: '04', title: 'Interview Scheduling', desc: 'We arrange direct interviews with our 180+ hiring partner companies.' },
  { step: '05', title: 'Placement Confirmed', desc: 'Receive your offer letter with post-placement support and follow-up.' },
];

const testimonials = [
  { name: 'Priya S.',    role: 'HDFC Bank, RM',          quote: 'FIC placed me within 3 weeks! The interview coaching was a game-changer. Highly recommend.', rating: 5 },
  { name: 'Rajan K.',   role: 'TCS, Software Dev',       quote: 'I was struggling for months. FIC streamlined my profile and got me 4 interview calls in one week.', rating: 5 },
  { name: 'Meena L.',   role: 'Concentrix, Team Leader', quote: 'The counsellors are genuinely supportive. They went beyond just scheduling — they prepared me fully.', rating: 5 },
];

const JobConsultingPage = () => (
  <>
    <SEOMeta
      title="Job Consultancy in Chennai | Banking, IT & BPO Placement | Forge India Connect"
      description="Top job consultancy in Chennai, Krishnagiri & Bangalore. Expert placement in Banking (HDFC, ICICI), IT (TCS, Infosys), BPO & more. Register today for career placement support."
      keywords="job consultancy chennai, banking job placement chennai, IT job placement south india, BPO jobs krishnagiri, HR consultancy freshers tamil nadu, best job agency chennai, career placement service, forge india connect jobs"
      canonical="/job-consulting"
    />

    {/* Hero */}
    <section className="relative bg-gradient-to-br from-indigo-950 via-primary to-indigo-800 pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="container-xl relative">
        <div className="max-w-3xl">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-eyebrow !bg-white/20 !text-white">
            #1 Job Consultancy in South India
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white mt-3 mb-5">
            Land Your Dream Job in <span className="animated-text-gradient">Banking, IT & BPO</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl">
            Forge India Connect has placed <strong className="text-white">2,400+ candidates</strong> across South India with a 95% success rate. We offer end-to-end placement support — from resume building to interview coaching and offer letter follow-up.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary btn-lg !bg-white !text-primary hover:!bg-slate-100 shadow-2xl">
              Apply for Placement <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-all min-h-[44px]">
              <PhoneCall size={16} /> Book Free Counselling
            </Link>
          </div>
          {/* Social proof bar */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[['2,400+', 'Placed'], ['95%', 'Success Rate'], ['180+', 'Hiring Partners'], ['48 hrs', 'Avg Turnaround']].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Sectors We Cover */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">Sectors We Cover</span>
          <h2 className="section-title">Jobs across every industry vertical</h2>
          <div className="section-divider" />
          <p className="section-subtitle">From entry-level to management, we have active openings in the sectors that matter most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{sector.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {sector.roles.map(r => <span key={r} className="badge-primary">{r}</span>)}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hiring Partners</p>
              <div className="flex flex-wrap gap-2">
                {sector.companies.map(c => (
                  <span key={c} className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{c}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="section-padding bg-white dark:bg-dark-card">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">From registration to placement — in 5 steps</h2>
          <div className="section-divider" />
        </div>
        <div className="relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="process-step"
              >
                <div className="process-step-icon text-lg font-black relative z-10 bg-white dark:bg-dark-card border-2 border-primary/20 shadow-lg">
                  {p.step}
                </div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">{p.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">Success Stories</span>
          <h2 className="section-title">Real people. Real placements.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Consultation Plans */}
    <section className="section-padding bg-white dark:bg-dark-card overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="container-xl relative z-10">
        <div className="section-header">
          <span className="section-eyebrow">Premium Career Support</span>
          <h2 className="section-title">Investment in Your Future</h2>
          <div className="section-divider" />
          <p className="section-subtitle">Choose the plan that fits your current career stage. High-impact support for serious professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 flex flex-col">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Basic Guidance</h3>
            <div className="text-4xl font-black text-primary mb-6 italic tracking-tighter">FREE</div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                'Standard Resume Database entry',
                'Job Alert notifications',
                'General Career Webinars',
                'Online Resource Access'
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-500">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-ghost w-full border border-slate-200 dark:border-slate-700 !rounded-2xl">
              Register Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="p-10 rounded-[3rem] bg-primary text-white shadow-2xl shadow-primary/30 relative flex flex-col scale-105">
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              Most Popular
            </div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Elite Consultation</h3>
            <div className="text-5xl font-black mb-6 italic tracking-tighter">₹1,500 <span className="text-sm font-medium text-white/60 not-italic">/ one-time</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                'Direct 1:1 Expert Counselling',
                'Professional ATS Resume Revamp',
                'Unlimited Interview Referrals',
                'Mock Interview Session',
                'Post-Placement Support'
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <CheckCircle2 size={18} className="text-secondary shrink-0" /> {item}
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
               <p className="text-[10px] text-center text-white/50 font-bold uppercase tracking-widest">Secure Payment Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Consulting Form Section */}
    <section id="consulting-form-section" className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="section-eyebrow">Strategic Onboarding</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic">Ready for <br/><span className="text-primary">Takeoff?</span></h2>
            <p className="text-lg text-slate-500 mb-10 font-medium">Fill in your professional parameters. Our algorithms and experts will use this data to chart your path to placement.</p>
            
            <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Direct Payment Access</h4>
              <p className="text-sm text-slate-500 mb-6 font-medium">Already discussed with us? You can use the quick payment link below to complete your registration instantly.</p>
              <a 
                href="https://rzp.io/rzp/34LdDbk5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-5 bg-indigo-900 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-950 transition-all uppercase tracking-widest text-xs"
              >
                Quick Pay via Razorpay Link <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-10 md:p-16 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <ConsultingForm />
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="section-padding bg-primary overflow-hidden relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="container-xl text-center relative z-10">
        <h2 className="text-white text-4xl md:text-5xl mb-4 italic tracking-tighter">Need Immediate Assistance?</h2>
        <p className="text-white/75 text-lg max-w-xl mx-auto mb-10 font-medium">
          Our recruitment mission control is active 24/7. Connect with us via WhatsApp for instant status updates.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 bg-[#25D366] text-white font-black rounded-3xl shadow-2xl shadow-green-500/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">
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

const ConsultingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    consultingType: 'Career Guidance',
    experience: 'Fresher (0-1 yr)',
    currentRole: '',
    specificRequirement: '',
    contactNumber: '',
  });

  const handlePayment = async (e) => {
    e.preventDefault();
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
      // 1. Create Inquiry & Razorpay Order
      const { data: orderData } = await api.post('/job-consulting/submit', formData);

      // 2. Configure Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "Forge India Connect",
        description: `Consultation: ${formData.consultingType}`,
        image: "/logo.jpg",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              inquiryId: orderData.inquiryId,
            };

            await api.post('/job-consulting/verify-payment', verifyPayload);
            toast.success('Strategic Success: Payment Verified. Mission Initiated!', { duration: 6000 });
            navigate('/candidate/dashboard');
          } catch (err) {
            toast.error('Signature Verification Failed: Potential communication breach.');
          }
        },
        prefill: {
          name: orderData.candidateName,
          email: orderData.email,
          contact: orderData.contactNumber,
        },
        theme: { color: "#0A66C2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gateway Operational Failure');
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? 'Initializing Gateway...' : <>Confirm & Pay ₹1,500 <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
      </button>
      
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase leading-relaxed px-4">
        By clicking, you agree to our terms. Consultations are typically scheduled within 24-48 hours post-payment verification.
      </p>
    </form>
  );
};

export default JobConsultingPage;

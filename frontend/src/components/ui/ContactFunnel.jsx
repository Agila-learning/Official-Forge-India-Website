import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import {
  User, Mail, Phone, Briefcase, Building2, MessageSquare,
  ArrowRight, CheckCircle2, ChevronLeft, Loader2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'job',      icon: Briefcase,  label: 'Job Consulting',    sub: 'Career placement & interview support' },
  { id: 'business', icon: Building2,  label: 'Business Services', sub: 'Web, marketing & digital solutions' },
  { id: 'college',  icon: User,       label: 'College / Training', sub: 'Campus placement & training programs' },
];

const SERVICES_MAP = {
  job:      ['Banking Job Placement', 'IT / Software Jobs', 'BPO / Customer Service', 'Resume Building & Coaching', 'Interview Preparation', 'Government Exam Coaching'],
  business: ['Website Development', 'Digital Marketing / SEO', 'Social Media Management', 'Google Ads', 'Insurance Services', 'Home Services'],
  college:  ['Campus Placement Drive', 'Pre-Placement Training', 'Soft Skills Workshop', 'Mock Interviews', 'Industry Visit Coordination', 'MoU Partnership'],
};

const INITIAL = { category: '', service: '', name: '', email: '', phone: '', message: '' };

const ContactFunnel = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    // Basic presence check
    if (!form.name || !form.email || !form.phone) { setErr('Please fill all required fields.'); return; }
    
    // Name validation
    if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      setErr('Name must contain only letters and spaces.');
      return;
    }
    
    // Phone validation (exactly 10 digits)
    if (!/^\d{10}$/.test(form.phone)) {
      setErr('Phone number must be exactly 10 digits.');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErr('Please enter a valid email address.');
      return;
    }

    // Split name into firstName and lastName for backend
    const nameParts = form.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Doe'; // Backend requires lastName, provide default if omitted

    setErr(''); setLoading(true);
    try {
      await api.post('/contacts', {
        firstName, lastName, email: form.email, phone: form.phone,
        category: form.category, service: form.service, message: form.message,
      });
      setDone(true);
    } catch (e) {
      setErr(e.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  const stepVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-8">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-emerald-600" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">We've got your request!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Our team will contact you within 2 business hours. For urgent queries, WhatsApp us directly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
          WhatsApp Now
        </a>
        <button onClick={() => { setDone(false); setForm(INITIAL); setStep(1); }} className="btn-ghost btn-lg">
          Submit Another Query
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
              step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>{step > s ? <CheckCircle2 size={16} /> : s}</div>
            {s < 3 && <div className={`flex-1 h-1 rounded-full max-w-[60px] transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1 — Category */}
        {step === 1 && (
          <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">What brings you to FIC?</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Select the area you need help with.</p>
            </div>
            <div className="grid gap-4">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { set('category', cat.id); setStep(2); }}
                    className={`flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:border-primary hover:shadow-lg ${
                      form.category === cat.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{cat.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.sub}</p>
                    </div>
                    <ArrowRight size={18} className="ml-auto text-slate-300 dark:text-slate-600" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Service + Personal Info */}
        {step === 2 && (
          <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary mb-6 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Which service interests you?</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Choose a specific service to help us prepare better.</p>
            </div>

            {/* Service Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(SERVICES_MAP[form.category] || []).map(s => (
                <button
                  key={s}
                  onClick={() => set('service', s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    form.service === s ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label"><User size={10} className="inline mr-1" />Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" placeholder="John Doe" value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label"><Phone size={10} className="inline mr-1" />Phone Number *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel" placeholder="+91 98765 43210" value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="form-label"><Mail size={10} className="inline mr-1" />Email Address *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email" placeholder="you@company.com" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {err && <p className="text-red-500 text-sm font-medium mb-4">{err}</p>}

            <button
              onClick={() => {
                if (!form.name || !form.phone || !form.email) { setErr('Please fill all required fields.'); return; }
                if (!/^[a-zA-Z\s]+$/.test(form.name)) { setErr('Name must contain only letters and spaces.'); return; }
                if (!/^\d{10}$/.test(form.phone)) { setErr('Phone number must be exactly 10 digits.'); return; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email address.'); return; }
                setErr(''); setStep(3);
              }}
              className="btn-primary w-full btn-lg"
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* STEP 3 — Message + Submit */}
        {step === 3 && (
          <motion.div key="s3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
            <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary mb-6 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Anything else to share?</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">The more context you provide, the faster we can help.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Request Summary</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Category:</span> <span className="font-bold text-slate-700 dark:text-slate-200 ml-1 capitalize">{form.category}</span></div>
                <div><span className="text-slate-400">Service:</span> <span className="font-bold text-slate-700 dark:text-slate-200 ml-1">{form.service || 'General'}</span></div>
                <div><span className="text-slate-400">Name:</span> <span className="font-bold text-slate-700 dark:text-slate-200 ml-1">{form.name}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="font-bold text-slate-700 dark:text-slate-200 ml-1">{form.phone}</span></div>
              </div>
            </div>

            <div className="mb-6">
              <label className="form-label"><MessageSquare size={10} className="inline mr-1" />Your Message (optional)</label>
              <textarea
                rows={4}
                placeholder="Describe your requirement, timeline, budget, or any specific questions..."
                value={form.message}
                onChange={e => set('message', e.target.value)}
                className="form-input resize-none !min-h-[100px]"
              />
            </div>

            {err && <p className="text-red-500 text-sm font-medium mb-4">{err}</p>}

            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full btn-lg">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <>Send Request <ArrowRight size={18} /></>}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              We respect your privacy. Your data is never sold or shared.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactFunnel;

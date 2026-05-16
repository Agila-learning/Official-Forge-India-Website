import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ShieldCheck, Cpu, Smartphone, Code, ArrowRight, MessageSquare,
  CheckCircle2, BarChart, Globe, Terminal, Layers, X, Loader2, Send,
  Building2, Clock, DollarSign
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOMeta from '../components/ui/SEOMeta';
import api from '../services/api';
import toast from 'react-hot-toast';

// ─── Service Data ──────────────────────────────────────────────────────────────
const serviceData = {
  'it-solutions': {
    title: 'Enterprise IT Solutions',
    subtitle: 'Scalable Infrastructure for Modern Organizations',
    desc: 'Deploy resilient, cloud-native IT systems that grow with your business. From cybersecurity audits to managed cloud migrations.',
    icon: Cpu,
    color: 'from-blue-600 to-indigo-600',
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: ShieldCheck, title: 'Security Audits', desc: 'Comprehensive vulnerability assessments.' },
      { icon: Layers, title: 'Cloud Integration', desc: 'Hybrid and multi-cloud architecture.' },
      { icon: Terminal, title: 'DevOps Support', desc: 'Automated CI/CD pipelines for agility.' }
    ],
    highlights: ['Dedicated Project Manager', '24/7 Enterprise Support', 'Full Source Code Ownership', 'Scalable Architecture Design'],
  },
  'website-development': {
    title: 'Web Development',
    subtitle: 'Futuristic Digital Presence',
    desc: 'High-performance corporate websites and e-commerce platforms designed for conversion and speed.',
    icon: Code,
    color: 'from-emerald-500 to-teal-600',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Zap, title: 'Performance First', desc: 'Optimized for Core Web Vitals.' },
      { icon: Globe, title: 'Global Reach', desc: 'Multi-lingual and localized SEO.' },
      { icon: Smartphone, title: 'Responsive Design', desc: 'Seamless across all devices.' }
    ],
    highlights: ['React / Next.js Stack', 'SEO-Optimized Architecture', 'Admin Panel Included', '6 Months Free Support'],
  },
  'app-development': {
    title: 'Mobile App Development',
    subtitle: 'Native and Cross-Platform Excellence',
    desc: 'Bespoke mobile applications for iOS and Android that engage users and drive operational efficiency.',
    icon: Smartphone,
    color: 'from-orange-500 to-rose-600',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Smartphone, title: 'Native iOS/Android', desc: 'High-performance platform-specific builds.' },
      { icon: Zap, title: 'Fast MVP', desc: 'Accelerated development cycles.' },
      { icon: ShieldCheck, title: 'Secure Payments', desc: 'Integrated wallet and gateway support.' }
    ],
    highlights: ['React Native & Flutter', 'Play Store / App Store Launch', 'Push Notifications', 'Offline Support'],
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    subtitle: 'Data-Driven Growth Strategies',
    desc: 'Accelerate your customer acquisition through targeted performance marketing and content strategy.',
    icon: BarChart,
    color: 'from-purple-500 to-pink-600',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: BarChart, title: 'PPC Management', desc: 'Maximize ROI on ad spend.' },
      { icon: MessageSquare, title: 'Content Strategy', desc: 'Engage your audience naturally.' },
      { icon: Globe, title: 'SEO Dominance', desc: 'Rank high for the keywords that matter.' }
    ],
    highlights: ['Google & Meta Ads', 'Monthly Analytics Reports', 'Dedicated Campaign Manager', 'A/B Testing'],
  },
  'logistics-delivery': {
    title: 'Logistics & Express Delivery',
    subtitle: 'Precision Global Supply Chain Deployment',
    desc: 'Advanced logistics solutions for businesses of all sizes. From hyperlocal express to global freight management.',
    icon: Zap,
    color: 'from-indigo-600 to-cyan-600',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: ShieldCheck, title: 'Insured Cargo', desc: 'Full coverage for every mission.' },
      { icon: Zap, title: '60 Min Express', desc: 'Hyperlocal speed at scale.' },
      { icon: Globe, title: 'Global Forwarding', desc: 'Seamless international logistics.' }
    ],
    highlights: ['Real-time GPS Tracking', 'Insured Shipments', 'API Integration', '24/7 Operations Center'],
  },
};

// ─── Registration Modal ────────────────────────────────────────────────────────
const RegistrationModal = ({ isOpen, onClose, serviceSlug, serviceName }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', budget: 'Not Sure', timeline: '1-3 Months', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/service-registrations', { ...form, serviceSlug, serviceName });
      setSubmitted(true);
      toast.success('Registration submitted! Our team will contact you shortly.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-[#111827] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 max-w-xl w-full relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                Registration <span className="text-green-500">Confirmed!</span>
              </h3>
              <p className="text-gray-500 font-medium mb-8">Our team will reach out within <strong>24 hours</strong> to discuss your project.</p>
              <button onClick={onClose} className="px-8 py-4 bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  Service Registration
                </span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mt-4 mb-2">
                  Get Started with <span className="text-primary">{serviceName}</span>
                </h2>
                <p className="text-sm text-gray-500 font-medium">Fill in the details below and our team will contact you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors" />
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Company / Organization</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Company name (optional)" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block flex items-center gap-1"><DollarSign size={10}/> Budget</label>
                    <select name="budget" value={form.budget} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors">
                      {['Under ₹50K', '₹50K - ₹2L', '₹2L - ₹5L', '₹5L - ₹15L', '₹15L+', 'Not Sure'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block flex items-center gap-1"><Clock size={10}/> Timeline</label>
                    <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors">
                      {['ASAP', '1 Month', '1-3 Months', '3-6 Months', '6+ Months'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Project Details</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Briefly describe your requirements..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:border-primary transition-colors resize-none" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-xl shadow-primary/20"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ServiceLandingPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const data = serviceData[categorySlug] || serviceData['it-solutions'];
  const Icon = data.icon;

  return (
    <div className="bg-dark-bg min-h-screen pb-32">
      <SEOMeta title={`${data.title} | Forge India Connect`} description={data.desc} />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={data.heroImage} className="w-full h-full object-cover opacity-30" alt={data.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
        </div>
        <div className="container-xl px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${data.color} text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block shadow-lg`}>
              Enterprise Protocol
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              {data.title.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-primary">{data.title.split(' ').pop()}</span>
            </h1>
            <p className="text-2xl text-white/40 font-medium leading-relaxed mb-12 max-w-2xl">{data.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-12 py-6 bg-primary text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                Register Interest <ArrowRight size={20} />
              </button>
              <a href="tel:+916369406416" className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                Free Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="container-xl px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 group hover:border-primary/30 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-all`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{f.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="container-xl px-6 mt-32">
        <div className="glass-card p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-10">
                Customized <br /><span className="text-primary">Architecture</span><br />For Your Needs.
              </h2>
              <p className="text-lg text-white/50 font-medium leading-relaxed mb-12">{data.desc}</p>
              <div className="space-y-6 mb-12">
                {data.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="font-black text-white/80 uppercase text-[10px] tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                Get a Custom Quote <ArrowRight size={16} />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10 group">
                <img src={data.heroImage} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="Process" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
              </div>
              <div className="absolute -bottom-10 -left-10 glass-card p-10 bg-primary text-white shadow-2xl">
                <p className="text-4xl font-black mb-1">99.9%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Operational Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="container-xl px-6 mt-32 relative z-20">
        <h2 className="text-3xl md:text-5xl font-black text-center text-white uppercase tracking-tighter mb-16">
          Mission <span className="text-primary">Protocol</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0" />
          
          {[
            { step: '01', title: 'Tactical Analysis', desc: 'We analyze your requirements and blueprint the optimal technical architecture.' },
            { step: '02', title: 'Agile Deployment', desc: 'Our elite engineering teams build and deploy in rapid, iterative cycles.' },
            { step: '03', title: 'Mission Success', desc: 'Seamless handover, training, and 24/7 post-deployment operational support.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-10 text-center relative z-10 hover:-translate-y-2 transition-transform"
            >
              <div className="w-16 h-16 bg-dark-bg border-4 border-primary rounded-full flex items-center justify-center text-xl font-black text-white mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                {item.step}
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{item.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="container-xl px-6 mt-32 mb-10">
        <div className="bg-gradient-to-br from-primary/10 to-dark-bg p-12 md:p-20 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 text-[200px] text-white/5 font-serif leading-none">"</div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 relative z-10">
            Field <span className="text-primary">Intelligence</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {[
              { quote: "FIC deployed our entire cloud infrastructure 3 weeks ahead of schedule. Their engineering precision is unmatched in the region.", author: "Director of Operations", company: "Global Tech Solutions" },
              { quote: "The performance marketing campaigns engineered by FIC increased our conversion rates by 400% within the first operational quarter.", author: "Chief Marketing Officer", company: "Retail Innovators Inc." }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                <p className="text-lg text-white/80 font-medium leading-relaxed italic mb-8">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{t.author}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Modal ───────────────────────────────────── */}
      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceSlug={categorySlug || 'it-solutions'}
        serviceName={data.title}
      />
    </div>
  );
};

export default ServiceLandingPage;

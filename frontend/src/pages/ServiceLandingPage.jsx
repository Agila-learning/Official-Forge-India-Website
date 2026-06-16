import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ShieldCheck, Cpu, Smartphone, Code, ArrowRight, MessageSquare,
  CheckCircle2, BarChart, Globe, Terminal, Layers, X, Loader2, Send,
  Building2, Clock, DollarSign,
  Network,
  Droplets,
  Search,
  Paintbrush,
  Sparkles,
  Rocket,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  Compass,
  CheckSquare,
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
    heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1920&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: BarChart, title: 'PPC Management', desc: 'Maximize ROI on ad spend.' },
      { icon: MessageSquare, title: 'Content Strategy', desc: 'Engage your audience naturally.' },
      { icon: Globe, title: 'SEO Dominance', desc: 'Rank high for the keywords that matter.' }
    ],
    highlights: ['Google & Meta Ads', 'Monthly Analytics Reports', 'Dedicated Campaign Manager', 'A/B Testing'],
  },
  'insurance-services': {
    title: 'Insurance Consulting',
    subtitle: 'Comprehensive Protection For Your Future',
    desc: 'Navigate complex insurance portfolios with our expert advisors. From enterprise liability to personal health coverage.',
    icon: ShieldCheck,
    color: 'from-violet-500 to-indigo-600',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: ShieldCheck, title: 'Risk Assessment', desc: 'Identify critical vulnerabilities.' },
      { icon: BarChart, title: 'Portfolio Management', desc: 'Optimize premiums and coverage.' },
      { icon: CheckCircle2, title: 'Claims Assistance', desc: 'End-to-end support during claims.' }
    ],
    highlights: ['Certified IRDAI Advisors', 'Custom Policy Structuring', 'Corporate Health Plans', 'Free Initial Consultation'],
  },
  'crm-solutions': {
    title: 'CRM Solutions',
    subtitle: 'Intelligent Customer Relationship Management',
    desc: 'Streamline your sales pipeline and automate customer interactions with our customized CRM deployments.',
    icon: Layers,
    color: 'from-sky-500 to-blue-600',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: BarChart, title: 'Sales Automation', desc: 'Automate repetitive follow-ups.' },
      { icon: Globe, title: 'Omnichannel Support', desc: 'Unify communication channels.' },
      { icon: Zap, title: 'Analytics Dashboard', desc: 'Real-time performance tracking.' }
    ],
    highlights: ['Salesforce & Zoho Integration', 'Data Migration Services', 'Custom Automations', 'Staff Training Included'],
  },

  'software-development': {
    title: 'Custom Software Development',
    subtitle: 'Tailored Solutions for Complex Business Problems',
    desc: 'End-to-end software engineering using modern stacks. We build robust, scalable applications tailored perfectly to your operational needs.',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    heroImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Code, title: 'Custom Architecture', desc: 'Built specifically for your business logic.' },
      { icon: ShieldCheck, title: 'Secure by Design', desc: 'Enterprise-grade security standards.' },
      { icon: Zap, title: 'High Performance', desc: 'Optimized for speed and scale.' }
    ],
    highlights: ['Microservices Architecture', 'Agile Methodology', 'Post-Launch Support', 'Full IP Ownership']
  },
  'erp-solutions': {
    title: 'ERP Solutions',
    subtitle: 'Unify Your Business Operations',
    desc: 'Integrate all your core business processes—finance, HR, manufacturing, supply chain—into a single, intelligent system.',
    icon: Layers,
    color: 'from-emerald-500 to-green-700',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: BarChart, title: 'Data Centralization', desc: 'Single source of truth for all departments.' },
      { icon: Zap, title: 'Process Automation', desc: 'Eliminate manual data entry.' },
      { icon: Globe, title: 'Real-Time Insights', desc: 'Live dashboards for executives.' }
    ],
    highlights: ['SAP & Oracle Integration', 'Custom Module Development', 'Data Migration', 'Staff Training']
  },
  'cloud-services': {
    title: 'Cloud Computing Services',
    subtitle: 'Scale Infinitely, Securely',
    desc: 'Migrate, manage, and optimize your infrastructure on AWS, Azure, or GCP. Achieve high availability and disaster recovery.',
    icon: Network,
    color: 'from-sky-400 to-blue-600',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Network, title: 'Cloud Migration', desc: 'Seamless transition to the cloud.' },
      { icon: ShieldCheck, title: 'Disaster Recovery', desc: 'Automated backups and failover.' },
      { icon: Terminal, title: 'DevOps & CI/CD', desc: 'Automated deployment pipelines.' }
    ],
    highlights: ['AWS / Azure / GCP', '24/7 Monitoring', 'Cost Optimization', 'Serverless Architecture']
  },
  'it-consulting': {
    title: 'IT Consulting',
    subtitle: 'Strategic Technology Roadmaps',
    desc: 'Align your technology strategy with your business goals. Our experts help you navigate digital transformation and system architecture.',
    icon: Droplets,
    color: 'from-slate-600 to-gray-800',
    heroImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: ShieldCheck, title: 'Tech Audits', desc: 'Comprehensive system reviews.' },
      { icon: Layers, title: 'Digital Transformation', desc: 'Modernize legacy systems.' },
      { icon: BarChart, title: 'Cost Analysis', desc: 'Optimize IT spending and ROI.' }
    ],
    highlights: ['Vendor Agnostic Advice', 'Enterprise Architecture', 'Security Compliance', 'Strategic Planning']
  },
  'seo-services': {
    title: 'SEO Services',
    subtitle: 'Dominate Search Engine Rankings',
    desc: 'Data-driven SEO strategies to increase organic visibility, drive targeted traffic, and outrank your competition.',
    icon: Search,
    color: 'from-green-500 to-teal-600',
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Search, title: 'Keyword Research', desc: 'Identify high-intent search terms.' },
      { icon: Code, title: 'Technical SEO', desc: 'Optimize site speed and structure.' },
      { icon: Globe, title: 'Link Building', desc: 'High-authority backlink outreach.' }
    ],
    highlights: ['Monthly Audits', 'Local SEO', 'Competitor Analysis', 'Content Optimization']
  },
  'social-media-management': {
    title: 'Social Media Management',
    subtitle: 'Build Your Brand Community',
    desc: 'Engaging content creation, community management, and targeted ad campaigns across Facebook, Instagram, LinkedIn, and X.',
    icon: Globe,
    color: 'from-pink-500 to-rose-600',
    heroImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: MessageSquare, title: 'Content Creation', desc: 'Viral, brand-aligned posts.' },
      { icon: BarChart, title: 'Paid Ads', desc: 'High ROI targeted social campaigns.' },
      { icon: CheckCircle2, title: 'Community Growth', desc: 'Active engagement with followers.' }
    ],
    highlights: ['Content Calendars', 'Influencer Outreach', 'Analytics Reports', 'Crisis Management']
  },
  'branding-design': {
    title: 'Branding & Design',
    subtitle: 'Visual Identities That Resonate',
    desc: 'Crafting memorable brand identities, logos, and UI/UX designs that captivate your audience and communicate your values.',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Sparkles, title: 'Brand Identity', desc: 'Logos, colors, and typography.' },
      { icon: Layers, title: 'UI/UX Design', desc: 'Intuitive user experiences.' },
      { icon: Code, title: 'Print & Digital', desc: 'Cohesive assets for all mediums.' }
    ],
    highlights: ['Brand Guidelines', 'Wireframing', 'Market Research', 'Rebranding Strategies']
  },
  'advertising-services': {
    title: 'Advertising Services',
    subtitle: 'High-Conversion Paid Campaigns',
    desc: 'Maximize your advertising budget with precision-targeted PPC and display ads across Google, Meta, and premium networks.',
    icon: Rocket,
    color: 'from-red-500 to-rose-700',
    heroImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Zap, title: 'Google Ads', desc: 'Capture high-intent search traffic.' },
      { icon: BarChart, title: 'Retargeting', desc: 'Bring back lost visitors.' },
      { icon: Terminal, title: 'A/B Testing', desc: 'Continuous ad copy optimization.' }
    ],
    highlights: ['ROAS Focus', 'Custom Landing Pages', 'Video Ads', 'Real-time Bidding']
  },
  'financial-assistance': {
    title: 'Financial Assistance',
    subtitle: 'Strategic Capital for Growth',
    desc: 'Expert guidance on securing business loans, venture capital, and government grants to fuel your expansion.',
    icon: DollarSign,
    color: 'from-green-600 to-emerald-800',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: BarChart, title: 'Financial Modeling', desc: 'Accurate growth projections.' },
      { icon: CheckCircle2, title: 'Loan Procurement', desc: 'Connect with premium lenders.' },
      { icon: Layers, title: 'Grant Applications', desc: 'Identify and apply for subsidies.' }
    ],
    highlights: ['VC Pitch Decks', 'SME Loans', 'Tax Optimization', 'Working Capital Advisory']
  },
  'documentation-support': {
    title: 'Documentation Support',
    subtitle: 'Flawless Paperwork & Compliance',
    desc: 'Professional drafting of NDAs, contracts, employment agreements, and business proposals to protect your interests.',
    icon: FileText,
    color: 'from-slate-500 to-gray-700',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: FileText, title: 'Legal Drafting', desc: 'Watertight business contracts.' },
      { icon: ShieldCheck, title: 'IP Protection', desc: 'Trademarks and patents.' },
      { icon: CheckCircle2, title: 'Tender Prep', desc: 'Winning government bids.' }
    ],
    highlights: ['Corporate Governance', 'NDA & Non-competes', 'Policy Manuals', 'Notary Services']
  },
  'business-registration': {
    title: 'Business Registration',
    subtitle: 'Launch Your Startup Legally',
    desc: 'Seamless company incorporation services. We handle the red tape so you can focus on building your product.',
    icon: Building2,
    color: 'from-blue-600 to-indigo-800',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: Building2, title: 'Company Incorporation', desc: 'Pvt Ltd, LLP, and Partnerships.' },
      { icon: Zap, title: 'Fast Track', desc: 'Expedited registration processes.' },
      { icon: ShieldCheck, title: 'Founder Agreements', desc: 'Protect equity and IP.' }
    ],
    highlights: ['DIN & DSC Registration', 'MoA & AoA Drafting', 'Startup India Registration', 'Virtual CFO']
  },
  'business-compliance': {
    title: 'Business Compliance',
    subtitle: 'Stay on the Right Side of the Law',
    desc: 'Ongoing compliance management including GST filings, annual returns, and labor law adherence for risk-free operations.',
    icon: CheckSquare,
    color: 'from-violet-600 to-purple-800',
    heroImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1920&auto=format&fit=crop',
    features: [
      { icon: CheckSquare, title: 'Tax Filings', desc: 'Timely GST and IT returns.' },
      { icon: ShieldCheck, title: 'Labor Laws', desc: 'PF, ESI, and payroll compliance.' },
      { icon: FileText, title: 'Annual RoC', desc: 'Ministry of Corporate Affairs filings.' }
    ],
    highlights: ['Dedicated Compliance Officer', 'Audit Support', 'Penalty Prevention', 'Regulatory Updates']
  }
,
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
          className="bg-white dark:bg-[#111827] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 max-w-xl w-full relative overflow-y-auto max-h-[90vh] custom-scrollbar"
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
                Get Custom Quote <ArrowRight size={20} />
              </button>
              <a href="tel:+916369406416" className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                Free Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="container-xl px-6 pt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 group hover:border-primary/30 transition-all flex flex-col h-full"
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

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Linkedin, Instagram, ArrowRight, MapPin,
  Phone, Mail, CheckCircle2, ShieldCheck, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About FIC', path: '/about' },
      { name: 'Careers', path: '/explore-jobs' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Partner With Us', path: '/contact' },
      { name: 'Company Portfolio', path: 'https://fic-hrms.lovable.app/', external: true },
    ]
  },
  {
    title: 'IT Solutions',
    links: [
      { name: 'Custom Software', path: '/solutions/custom-software-development' },
      { name: 'Web Development', path: '/solutions/web-development' },
      { name: 'Mobile App Dev', path: '/solutions/mobile-app-development' },
      { name: 'ERP Solutions', path: '/solutions/erp-solutions' },
      { name: 'CRM Solutions', path: '/solutions/crm-solutions' },
    ]
  },
  {
    title: 'Careers',
    links: [
      { name: 'Find Jobs', path: '/explore-jobs' },
      { name: 'Banking Jobs', path: 'https://jobs.forgeindiaconnect.in', external: true },
      { name: 'Career Guidance', path: '/contact' },
      { name: 'Training & Placement', path: '/training-placement' },
      { name: 'Internships', path: 'https://forms.gle/hJfT8Yna5De5ttwv8', external: true },
    ]
  },
  {
    title: 'Business Growth',
    links: [
      { name: 'Digital Marketing', path: '/solutions/digital-marketing' },
      { name: 'SEO', path: '/solutions/seo' },
      { name: 'Branding', path: '/solutions/branding' },
      { name: 'Social Media', path: '/solutions/social-media-marketing' },
      { name: 'Recruitment', path: '/solutions/recruitment' },
    ]
  },
];

const branches = [
  {
    city: 'Krishnagiri',
    type: 'Head Office',
    phone: '+91 63694 06416',
    address: 'RK Towers, Rayakottai Rd, opposite HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002'
  },
  {
    city: 'Bangalore',
    type: 'Liaison Office',
    phone: '+91 63694 06416',
    address: 'Excel Coworks, Marilingappa Layout, Nagarbhavi, Papareddypalya, Bangalore.'
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      await api.post('/users/subscribe', { email });
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#080d1a] via-[#0d1528] to-[#0a1020] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Footer Body */}
      <div className="container-xl px-6 pt-16 pb-10 relative z-10">

        {/* TOP ROW: Brand + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg group-hover:scale-105 transition-transform">
                <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-blue-400 font-black text-lg tracking-tight leading-none">FORGE INDIA</span>
                <span className="text-yellow-400 font-black text-[10px] tracking-[0.2em]">CONNECT</span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              India's premier gateway for career placement, business excellence, and digital transformation.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/people/Forge-India-Connect/61583095918027', label: 'Facebook' },
                { icon: Linkedin, href: 'https://www.linkedin.com/company/forge-india-connect-pvt-ltd/', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://www.instagram.com/forgeindia_connect', label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">ISO 9001:2015 Certified</span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerSections.map((section, idx) => (
              <div key={section.title}>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors flex items-center gap-1.5 group"
                        >
                          <ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          {link.name} <span className="text-[9px] opacity-50">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors flex items-center gap-1.5 group"
                        >
                          <ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICES ROW */}
        <div className="border-t border-white/8 pt-10 mb-10">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Our Offices</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {branches.map((branch) => (
              <div
                key={branch.city}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className="w-9 h-9 bg-blue-600/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-white font-black text-sm">{branch.city}</h5>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider px-2 py-0.5 bg-blue-400/10 rounded-full">
                      {branch.type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-2">{branch.address}</p>
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, '')}`}
                    className="text-slate-400 hover:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors w-fit"
                  >
                    <Phone size={11} className="text-emerald-500" />
                    {branch.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[11px] font-bold uppercase tracking-wider order-2 sm:order-1">
            © {currentYear} Forge India Connect Pvt. Ltd. · MSME Registered · Skill India Partner
          </p>
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <Link to="/privacy" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
              Terms
            </Link>
            <button
              onClick={() => { localStorage.removeItem('fic_cookie_consent'); window.location.reload(); }}
              className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

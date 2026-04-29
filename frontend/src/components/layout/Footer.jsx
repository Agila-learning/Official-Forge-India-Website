import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Linkedin, Instagram, ArrowRight, MapPin, 
  Phone, Mail, CheckCircle2, ShieldCheck, Globe, Users, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About FIC', path: '/about' },
      { name: 'Our Clientele', path: '/clientele' },
      { name: 'Success Stories', path: '/testimonials' },
      { name: 'Partner with Us', path: '/contact' },
      { name: 'Careers', path: '/jobs' },
    ]
  },
  {
    title: 'Core Services',
    links: [
      { name: 'Job Consulting', path: '/services/job-consulting' },
      { name: 'IT Solutions', path: '/services/it-solutions' },
      { name: 'Digital Marketing', path: '/services/digital-marketing' },
      { name: 'Insurance Services', path: '/services/insurance-services' },
      { name: 'Web & App Dev', path: '/services/website-development' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center & FAQ', path: '/faq' },
      { name: 'Contact Support', path: '/contact' },
      { name: 'Member Login', path: '/login' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Refund Policy', path: '/refund-policy' },
    ]
  }
];

const branches = [
  { city: 'Krishnagiri', type: 'Head Office', phone: '+91 63694 06416', address: 'RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002' },
  { city: 'Chennai',     type: 'Branch Office', phone: '+91 63694 06416', address: '22, VVM Towers, 3rd Floor, Pattullos Rd, Anna Salai, Royapettah, Chennai, Tamil Nadu 600002' },
  { city: 'Bangalore',   type: 'Liaison Office', phone: '+91 63694 06416', address: 'Excel coworks, Marilingappa layout, Nagarbhavi, Papareddypalya , Bangalore.' },
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
      toast.success('Successfully subscribed to weekly insights!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] translate-y-1/2" />

      <div className="container-xl relative z-10">
        {/* Newsletter removed for cleaner design and better contrast */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 group-hover:rotate-12 transition-transform shadow-2xl">
                <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-black leading-none text-xl tracking-tighter uppercase flex flex-col">
                  <span className="text-blue-500">FORGE INDIA</span>
                  <span className="text-yellow-500 text-xs tracking-[0.2em] mt-1">CONNECT</span>
                </span>
                <span className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] mt-1">Connect Ecosystem</span>
              </div>
            </Link>
            
            <p className="text-slate-200 text-lg leading-relaxed max-w-sm text-left">
              India's premier gateway for career placement, business excellence, and digital transformation. 
              Bridging talent with global opportunities through a verified partner network.
            </p>

            <div className="flex gap-4">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/people/Forge-India-Connect/61583095918027', color: 'hover:bg-[#1877F2]' },
                { icon: Linkedin, href: 'https://www.linkedin.com/company/forge-india-connect-pvt-ltd/?viewAsMember=true', color: 'hover:bg-[#0A66C2]' },
                { icon: Instagram, href: 'https://www.instagram.com/forgeindia_connect?igsh=MTF4Z2M4Z3p2OHA2YQ%3D%3D', color: 'hover:bg-[#E4405F]' },
                { icon: Globe, href: '#', color: 'hover:bg-primary' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl hover:-translate-y-1 ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl space-y-4">
               <div className="flex items-center gap-3 text-secondary">
                  <ShieldCheck size={20} />
                  <span className="text-xs font-black uppercase tracking-widest text-white">ISO 9001:2015 Certified</span>
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed font-medium text-left">
                 Government Approved Job Consultancy | MSME Registered | Trusted by 180+ Enterprise Partners across South India.
               </p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((group) => (
                <div key={group.title} className="text-left">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    {group.title}
                  </h4>
                  <ul className="space-y-4">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.path} 
                          className="text-slate-400 hover:text-secondary transition-colors text-sm font-semibold flex items-center group"
                        >
                          <ArrowRight size={12} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Regional Offices Row */}
            <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {branches.map(branch => (
                <div key={branch.city} className="space-y-3 p-6 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{branch.type}</p>
                  <h5 className="text-white font-black text-lg flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {branch.city}
                  </h5>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">{branch.address}</p>
                  <a href={`tel:${branch.phone.replace(/\s/g,'')}`} className="text-slate-400 hover:text-secondary transition-colors text-sm font-bold flex items-center gap-2">
                    <Phone size={14} className="text-secondary" /> {branch.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              &copy; {currentYear} Forge India Connect Pvt. Ltd.
            </p>
            <div className="hidden sm:flex gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                  <CheckCircle2 size={12} className="text-secondary" /> Skill India Partner
               </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/privacy" className="text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('fic_cookie_consent');
                window.location.reload();
              }} 
              className="text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

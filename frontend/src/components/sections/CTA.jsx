import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, Building2, ShieldCheck } from 'lucide-react';

const trustItems = [
 { icon: Users, value: '20,000+', label: 'Placements' },
 { icon: Building2, value: '180+', label: 'Partners' },
 { icon: Award, value: '95%', label: 'Success Rate'},
 { icon: ShieldCheck,value: 'ISO', label: 'Certified' },
];

const CTA = () => {
 const navigate = useNavigate();
 const location = useLocation();

 const handleContactClick = () => {
 if (location.pathname !== '/') {
 navigate('/#contact');
 } else {
 const el = document.getElementById('contact');
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 }
 };

 return (
 <section className="relative py-24 md:py-32 overflow-hidden noise-bg" style={{ background: 'linear-gradient(135deg, #0c0e1a 0%, #0f172a 60%, #0c1025 100%)' }}>
 {/* Background glow orbs */}
 <div className="absolute top-0 left-1/4 w-[500px] h-[500px] blob-glow-indigo animate-blob pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] blob-glow-teal animate-blob animation-delay-4000 pointer-events-none" />

 {/* Dot grid */}
 <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
 style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

 {/* Top gradient divider */}
 <div className="absolute top-0 left-0 right-0 gradient-divider" />

 <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
 {/* Eyebrow */}
 <motion.span
 initial={{ opacity: 0, y: -10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="section-eyebrow-dark mb-6"
 >
 Start Your Journey
 </motion.span>

 {/* Heading */}
 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.05 }}
 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tighter mb-6"
 >
 Empower Your Business with{' '}
 <span className="text-gradient-primary">Smart IT Solutions</span>{' '}
 Today
 </motion.h2>

 <motion.p
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
 >
 Join India's leading technology ecosystem. Connect with experts, build scalable solutions, 
 and grow your brand in the digital-first economy.
 </motion.p>

 {/* CTAs */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.15 }}
 className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
 >
 <button
 onClick={() => navigate('/register')}
 className="btn-primary btn-lg group"
 >
 Register for Free
 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
 </button>
 <button
 onClick={handleContactClick}
 className="btn-glass btn-lg"
 >
 Contact Sales
 </button>
 </motion.div>

 {/* Trust strip */}
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.25 }}
 className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
 >
 {trustItems.map((item, i) => (
 <div key={i} className="flex items-center gap-2.5 group">
 <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
 style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.3)' }}>
 <item.icon size={13} className="text-indigo-300" />
 </div>
 <div className="text-left">
 <span className="text-sm font-black text-white">{item.value}</span>
 <span className="text-xs text-slate-500 font-bold ml-1.5 uppercase tracking-wider">{item.label}</span>
 </div>
 {i < trustItems.length - 1 && (
 <div className="hidden md:block w-px h-5 bg-white/10 ml-3" />
 )}
 </div>
 ))}
 </motion.div>
 </div>

 {/* Bottom gradient divider */}
 <div className="absolute bottom-0 left-0 right-0 gradient-divider" />
 </section>
 );
};

export default CTA;

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Users, Clock, Award, ChevronRight } from 'lucide-react';
import SEOMeta from '../ui/SEOMeta';
import ServiceInquiryForm from '../forms/ServiceInquiryForm';

const Counter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(value);
    const duration = 1400;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const ServicePageTemplate = ({
  title, description, tagline, heroTitle, heroHighlight, heroSubtitle, heroImage,
  accentColor = '#3b82f6', accentFrom = 'from-blue-600', accentTo = 'to-cyan-500', 
  accentText = 'text-blue-600 dark:text-blue-400', accentBg = 'bg-blue-50 dark:bg-blue-900/20', 
  accentBorder = 'border-blue-200 dark:border-blue-500/30', stats = [], 
  servicesTitle = 'What We Deliver', services = [], processTitle = 'Our Approach', 
  processSteps = [], whyTitle = 'Why Choose FIC?', whyPoints = [], serviceType, 
  serviceSlug, formTitle, formBullets = [], keywords = ''
}) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="bg-slate-50 dark:bg-[#070b14] min-h-screen text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <SEOMeta title={`${title} | Forge India Connect`} description={description} keywords={keywords} />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className={`absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 dark:opacity-20 bg-gradient-to-br ${accentFrom} ${accentTo} pointer-events-none`} />
        
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="container-xl px-6 relative z-10 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${accentBorder} ${accentBg} mb-8`}
              >
                <Sparkles size={13} className={accentText} />
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${accentText}`}>{tagline}</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1] mb-8 text-slate-900 dark:text-white"
              >
                {heroTitle}{' '}
                <span className={`bg-gradient-to-r ${accentFrom} ${accentTo} bg-clip-text text-transparent`}>
                  {heroHighlight}
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-white/50 font-medium leading-relaxed max-w-xl mb-12"
              >
                {heroSubtitle}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4">
                <button onClick={() => document.getElementById('inquiry').scrollIntoView({ behavior: 'smooth' })} className={`px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest bg-gradient-to-r ${accentFrom} ${accentTo} hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 hover:gap-5`}>
                  Get Started <ArrowRight size={18} />
                </button>
                <Link to="/contact" className="px-8 py-4 rounded-2xl text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-3 shadow-sm dark:shadow-none">
                  Talk to Expert
                </Link>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }} 
              animate={{ opacity: 1, scale: 1, rotate: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className={`absolute -inset-4 bg-gradient-to-tr ${accentFrom} ${accentTo} opacity-20 blur-2xl rounded-full`} />
              <div className={`relative aspect-square w-full max-w-lg mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800`}>
                <img 
                  src={heroImage} 
                  alt={heroTitle} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      {stats.length > 0 && (
        <section className="relative -mt-10 z-10">
          <div className="container-xl px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-[#0a1020] p-8 text-center hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <p className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r ${accentFrom} ${accentTo} bg-clip-text text-transparent`}>
                    <Counter value={stat.value} suffix={stat.suffix || ''} />
                  </p>
                  <p className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES GRID ── */}
      <section className="container-xl px-6 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className={`text-xs font-black uppercase tracking-[0.3em] ${accentText} mb-4`}>What We Offer</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{servicesTitle}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative p-8 rounded-[2rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15 hover:shadow-xl dark:hover:bg-white/[0.06] transition-all duration-300 overflow-hidden shadow-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${accentFrom} ${accentTo} opacity-0 group-hover:opacity-[0.02] dark:group-hover:opacity-[0.04] transition-opacity rounded-[2rem]`} />
              <div className={`w-14 h-14 rounded-2xl ${accentBg} border ${accentBorder} flex items-center justify-center mb-6`}>
                <svc.icon size={24} className={accentText} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all">
                {svc.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-white/40 leading-relaxed font-medium">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      {processSteps.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-white dark:bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50 dark:via-white/[0.02] to-transparent" />
          <div className="container-xl px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className={`text-xs font-black uppercase tracking-[0.3em] ${accentText} mb-4`}>How It Works</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{processTitle}</h2>
            </motion.div>

            <div className="relative">
              <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent hidden lg:block" />
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {processSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative">
                    <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center text-white font-black text-2xl mb-6 shadow-xl`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{step.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-white/40 font-medium leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── INQUIRY FORM ── */}
      <section id="inquiry" className="container-xl px-6 py-24">
        <div className="relative">
          <div className={`absolute -inset-px bg-gradient-to-r ${accentFrom} ${accentTo} rounded-[3rem] opacity-10 dark:opacity-20 blur-xl`} />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl dark:shadow-none">
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${accentFrom} ${accentTo} rounded-full blur-[100px] opacity-5 dark:opacity-10`} />

            <div className="relative z-10">
              <p className={`text-xs font-black uppercase tracking-[0.3em] ${accentText} mb-4`}>Let's Talk</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">
                {formTitle || `Start Your ${serviceType} Project`}
              </h2>
              <p className="text-slate-600 dark:text-white/40 font-medium leading-relaxed mb-8">
                Tell us about your requirements and our team will reach out within 24 hours.
              </p>
              {formBullets.length > 0 && (
                <div className="space-y-4">
                  {formBullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight size={14} className={accentText} />
                      <span className="text-sm font-bold text-slate-700 dark:text-white/60">{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <ServiceInquiryForm
                serviceType={serviceType}
                serviceSlug={serviceSlug}
                themeColor="blue"
                title={formTitle || `Request ${serviceType} Consultation`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePageTemplate;

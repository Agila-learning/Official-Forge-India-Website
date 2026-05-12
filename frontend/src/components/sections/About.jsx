import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const statItems = [
  { value: '500',  suffix: '+', label: 'Verified Partners', color: 'text-indigo-400', border: 'rgba(99,102,241,0.3)', glow: 'rgba(99,102,241,0.1)', icon: Briefcase },
  { value: '10',   suffix: 'k+', label: 'Placed Candidates', color: 'text-emerald-400', border: 'rgba(16,185,129,0.3)', glow: 'rgba(16,185,129,0.1)', icon: Users },
];

const checks = [
  'End-to-end IT solutions',
  'Industry-ready training programs',
  'Placement support ecosystem',
  '360° business support',
];

const Counter = ({ to, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1800;
    const step = (to / dur) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-white dark:bg-dark-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="section-eyebrow">Why Choose FIC</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.08] tracking-tighter mt-3">
              Why Choose{' '}
              <span className="text-gradient-primary">FIC?</span>{' '}
              End-to-End{' '}
              <span className="text-gradient-blue">IT Solutions</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
              Forge India Connect is a technology-first company dedicated to transforming businesses 
              through smart digital engineering and a robust skill development ecosystem.
            </p>

            {/* Checklist */}
            <ul className="space-y-3.5 mb-10">
              {checks.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3.5"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.2)' }}
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              {statItems.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative p-5 rounded-2xl overflow-hidden cursor-default transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #0c0e1a 0%, #0f172a 100%)',
                    border: `1px solid ${stat.border}`,
                    boxShadow: `0 4px 20px ${stat.glow}`,
                  }}
                >
                  {/* Top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, transparent, ${stat.border.replace('0.3', '0.8')}, transparent)` }} />

                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: stat.glow, border: `1px solid ${stat.border}` }}
                  >
                    <stat.icon size={15} className={stat.color} />
                  </div>

                  <h4 className={`text-2xl font-black tracking-tighter mb-1 ${stat.color}`}>
                    <Counter to={parseInt(stat.value)} suffix={stat.suffix} />
                  </h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            {/* Animated glow ring behind image */}
            <div className="absolute -inset-4 rounded-[3.5rem] animate-border-glow opacity-60"
              style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(13,148,136,0.1))', filter: 'blur(20px)' }} />

            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl group">
              {/* Color overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/15 z-10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />

              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Business Strategy Meeting at Forge India Connect Office"
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-[2s]"
              />

              {/* Floating caption badge */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-2xl transition-transform duration-300 group-hover:translate-y-0 translate-y-1"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <h4 className="text-white font-black text-base mb-1">Corporate Strategy</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  Empowering the next generation of industry leaders through collaborative networking.
                </p>
              </div>
            </div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 px-5 py-4 rounded-2xl shadow-2xl z-30"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', boxShadow: '0 8px 32px rgba(79,70,229,0.4)' }}
            >
              <p className="text-white font-black text-xl tracking-tighter">6+ Yrs</p>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Of Excellence</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

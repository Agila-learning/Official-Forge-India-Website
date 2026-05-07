import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, Globe, ArrowRight, Users, Calendar, Handshake, Building } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Smart Connections',
    desc: 'AI-driven matchmaking to find the right business partners instantly.',
    color: 'from-indigo-500/20 to-indigo-500/5',
    glow: 'rgba(99,102,241,0.15)',
    iconColor: 'text-indigo-400',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Businesses',
    desc: 'Every profile is manually verified to ensure trust and reliability.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    glow: 'rgba(16,185,129,0.15)',
    iconColor: 'text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    desc: 'Access exclusive deals, jobs, and investment opportunities.',
    color: 'from-blue-500/20 to-blue-500/5',
    glow: 'rgba(59,130,246,0.15)',
    iconColor: 'text-blue-400',
  },
  {
    icon: Globe,
    title: 'Real-time Networking',
    desc: 'Chat and collaborate with industry peers in real-time.',
    color: 'from-violet-500/20 to-violet-500/5',
    glow: 'rgba(139,92,246,0.15)',
    iconColor: 'text-violet-400',
  },
];

const metrics = [
  { icon: Users,    from: 0, to: 1248, suffix: '+', label: 'Active Members' },
  { icon: Calendar, from: 0, to: 85,   suffix: '',  label: 'Events Hosted'  },
  { icon: Handshake,from: 0, to: 300,  suffix: '+', label: 'Business Deals' },
  { icon: Building, from: 0, to: 25,   suffix: '+', label: 'Industries'     },
];

const AnimatedCounter = ({ from, to, suffix, duration = 2 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: '-50px' });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count.toLocaleString('en-IN')}{suffix}</span>;
};

const FeatureCard = ({ feat, idx }) => {
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="relative p-8 rounded-[1.75rem] border overflow-hidden group cursor-default transition-all duration-400"
      style={{
        background: 'linear-gradient(135deg, #0a1128 0%, #050d1f 100%)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
        e.currentTarget.style.boxShadow = `0 0 40px ${feat.glow}, 0 20px 60px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Gradient background glow behind icon */}
      <div className={`absolute -top-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br ${feat.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <feat.icon size={22} className={`${feat.iconColor} group-hover:scale-110 transition-transform duration-300`} />
      </div>

      <h4 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors duration-300">
        {feat.title}
      </h4>
      <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
        {feat.desc}
      </p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Metric Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="metric-card group"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

              <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.2)' }}
              >
                <m.icon size={16} className="text-indigo-400" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">
                <AnimatedCounter from={m.from} to={m.to} suffix={m.suffix} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em]">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Feature Cards + Copy ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, idx) => (
              <FeatureCard key={idx} feat={feat} idx={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Platform Advantages</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.08] tracking-tighter mt-3">
              Powerful Features for{' '}
              <span className="text-gradient-blue">Ambitious Teams.</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              Experience a sophisticated networking environment designed for performance and scale. Real-time updates, 
              secure connections, and verified profiles ensure your growth is our priority.
            </p>
            <Link
              to="/register"
              className="btn-primary btn-lg group inline-flex"
            >
              Discover All Features
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

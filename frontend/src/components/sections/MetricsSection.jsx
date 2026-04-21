import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, GraduationCap, Award, TrendingUp, MapPin } from 'lucide-react';

const metrics = [
  { icon: Users,         value: 2400,  suffix: '+', label: 'Candidates Placed',   sub: 'Across Banking, IT & BPO sectors', color: 'text-indigo-600' },
  { icon: Building2,     value: 180,   suffix: '+', label: 'Hiring Partners',      sub: 'Verified companies across South India', color: 'text-teal-600' },
  { icon: GraduationCap, value: 40,    suffix: '+', label: 'College Partners',     sub: 'Campus placement drives delivered', color: 'text-violet-600' },
  { icon: Award,         value: 95,    suffix: '%',  label: 'Placement Rate',      sub: 'Industry-leading success percentage', color: 'text-amber-600' },
  { icon: TrendingUp,    value: 6,     suffix: '+',  label: 'Years of Excellence', sub: 'Trusted since 2018 in South India', color: 'text-rose-600' },
  { icon: MapPin,        value: 3,     suffix: '',   label: 'Key Cities Served',   sub: 'Chennai · Krishnagiri · Bangalore', color: 'text-blue-600' },
];

const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
};

const MetricCard = ({ metric, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(metric.value, 2000, inView);
  const Icon = metric.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="feature-card text-center group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 ${metric.color}`}>
        <Icon size={26} />
      </div>
      <div className={`text-4xl sm:text-5xl font-black mb-1 ${metric.color}`}>
        {count}{metric.suffix}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{metric.label}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{metric.sub}</p>
    </motion.div>
  );
};

const MetricsSection = () => (
  <section className="section-padding bg-slate-50 dark:bg-dark-card" aria-label="Key Metrics">
    <div className="container-xl">
      <div className="section-header">
        <span className="section-eyebrow">By the Numbers</span>
        <h2 className="section-title">Results that speak for themselves</h2>
        <div className="section-divider" />
        <p className="section-subtitle">
          Forge India Connect has been transforming careers and businesses since 2018 — backed by real results across South India.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} metric={m} delay={i * 0.1} />
        ))}
      </div>
    </div>
  </section>
);

export default MetricsSection;

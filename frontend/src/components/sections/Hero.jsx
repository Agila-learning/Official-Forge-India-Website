import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Building2, GraduationCap, ShoppingBag,
  ArrowRight, ChevronRight, Star, Users, Award, TrendingUp, CheckCircle2
} from 'lucide-react';

const segments = [
  {
    id: 'job-seekers',
    label: 'Job Seekers',
    icon: Briefcase,
    headline: 'Land Your Dream Job in Banking, IT & BPO',
    sub: 'Expert placement support, resume building, and interview coaching — tailored for freshers and experienced professionals across Chennai, Krishnagiri & Bangalore.',
    cta: { label: 'Apply for Placement', to: '/jobs' },
    cta2: { label: 'Book Consultation', to: '/contact' },
    accent: 'from-indigo-600 to-indigo-900',
    bg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920&auto=format&fit=crop',
    stats: [
      { v: '2,400+', l: 'Candidates Placed' },
      { v: '95%', l: 'Success Rate' },
      { v: '180+', l: 'Partner Companies' },
    ],
  },
  {
    id: 'employers',
    label: 'Employers',
    icon: Building2,
    headline: 'Hire Top Talent, Fast & Verified',
    sub: 'Streamline your recruitment with pre-screened, job-ready candidates. We handle sourcing, background checks, and skill assessment so you can focus on growth.',
    cta: { label: 'Hire Through FIC', to: '/contact' },
    cta2: { label: 'View Plans', to: '/services' },
    accent: 'from-teal-600 to-teal-900',
    bg: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1920&auto=format&fit=crop',
    stats: [
      { v: '180+', l: 'Hiring Partners' },
      { v: '48 hrs', l: 'Avg. Turnaround' },
      { v: '100%', l: 'Background Verified' },
    ],
  },
  {
    id: 'colleges',
    label: 'College Partners',
    icon: GraduationCap,
    headline: 'Campus-to-Corporate Placement Programs',
    sub: 'Forge India Connect partners with colleges and training institutes to bridge the gap between education and employment through structured placement drives.',
    cta: { label: 'Start Partnership', to: '/contact' },
    cta2: { label: 'Learn More', to: '/services' },
    accent: 'from-violet-600 to-violet-900',
    bg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
    stats: [
      { v: '40+', l: 'College Partners' },
      { v: '3,000+', l: 'Students Trained' },
      { v: '85%', l: 'Placement Rate' },
    ],
  },
  {
    id: 'business',
    label: 'Business Clients',
    icon: ShoppingBag,
    headline: 'Digital & Business Services to Scale Your Brand',
    sub: 'From website development and digital marketing to insurance and home services — FIC is your end-to-end business growth partner across South India.',
    cta: { label: 'Explore Services', to: '/services' },
    cta2: { label: 'Get a Quote', to: '/contact' },
    accent: 'from-amber-600 to-amber-900',
    bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop',
    stats: [
      { v: '500+', l: 'Business Clients' },
      { v: '10+', l: 'Service Categories' },
      { v: '6 yrs', l: 'Market Experience' },
    ],
  },
];

const INTERVAL = 6000;

const Hero = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(p => (p + 1) % segments.length);
      setProgress(0);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setProgress(0);
    const step = 100 / (INTERVAL / 100);
    const progTimer = setInterval(() => {
      setProgress(p => Math.min(p + step, 100));
    }, 100);
    return () => clearInterval(progTimer);
  }, [active]);

  const seg = segments[active];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-950" aria-label="Hero Section">
      {/* Background Image with Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={seg.id + '-bg'}
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <img src={seg.bg} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className={`absolute inset-0 bg-gradient-to-br ${seg.accent} opacity-75`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center pt-24 md:pt-28 pb-16">
          <div className="container-xl section-padding py-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Left — Text */}
              <div>
                {/* Segment Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {segments.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => { setActive(i); setProgress(0); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          i === active
                            ? 'bg-white text-slate-900 shadow-lg'
                            : 'bg-white/15 text-white/80 hover:bg-white/25'
                        }`}
                      >
                        <Icon size={12} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={seg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                      {seg.headline}
                    </h1>
                    <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
                      {seg.sub}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                      <Link
                        to={seg.cta.to}
                        className="btn-primary btn-lg bg-white !text-slate-900 hover:!bg-white/90 shadow-2xl"
                      >
                        {seg.cta.label} <ArrowRight size={18} />
                      </Link>
                      <Link
                        to={seg.cta2.to}
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl text-sm hover:border-white hover:bg-white/10 transition-all duration-200 min-h-[44px]"
                      >
                        {seg.cta2.label} <ChevronRight size={16} />
                      </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 sm:gap-8">
                      {seg.stats.map((s, i) => (
                        <div key={i}>
                          <p className="text-2xl sm:text-3xl font-black text-white">{s.v}</p>
                          <p className="text-xs text-white/60 font-medium mt-0.5">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — Trust Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={seg.id + '-card'}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                  className="hidden lg:block"
                >
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-black text-sm">Why Choose FIC?</p>
                        <p className="text-white/60 text-xs">Trusted since 2018 across South India</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {[
                        'ISO-certified recruitment processes',
                        'Pre-screened, skill-verified candidates',
                        'Dedicated relationship manager',
                        'Post-placement follow-up support',
                        'Transparent pricing, no hidden costs',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                          <span className="text-white/85 text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 pt-5 border-t border-white/15">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-white/80 text-xs font-bold ml-1">4.9/5 — 800+ client reviews</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Progress Bar Tabs */}
        <div className="relative z-30 bg-slate-950/60 backdrop-blur-md border-t border-white/10">
          <div className="container-xl">
            <div className="grid grid-cols-4 divide-x divide-white/10">
              {segments.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActive(i); setProgress(0); }}
                    className={`relative flex flex-col sm:flex-row items-center gap-2 px-4 py-5 text-left transition-all duration-200 ${
                      i === active ? 'text-white' : 'text-white/50 hover:text-white/75'
                    }`}
                    aria-label={s.label}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold hidden sm:block">{s.label}</span>
                    {/* Progress */}
                    {i === active && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-teal-400"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

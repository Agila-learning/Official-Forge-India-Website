import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Globe, Sparkles, Zap, Briefcase, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import LocationRequestModal from '../modals/LocationRequestModal';

/* ── Animated SVG Route Map ── */
const RouteNode = ({ cx, cy, label, icon: Icon, color, delay = 0 }) => (
  <g>
    {/* Ping ring */}
    <circle cx={cx} cy={cy} r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3"
      style={{ animation: `pingExpand 2.5s ease-out ${delay}s infinite` }} />
    {/* Glow blur */}
    <circle cx={cx} cy={cy} r="8" fill={color} opacity="0.15" />
    {/* Node dot */}
    <circle cx={cx} cy={cy} r="5" fill={color}
      style={{ animation: `routeGlowPulse 2s ease-in-out ${delay}s infinite` }} />
    {/* Label */}
    {label && (
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="7" fontWeight="800"
        fill="white" opacity="0.7" fontFamily="Inter, sans-serif" letterSpacing="0.05em">
        {label}
      </text>
    )}
  </g>
);

const TravelingDot = ({ pathId, duration, delay, color = '#818cf8' }) => (
  <circle r="3.5" fill={color}
    style={{
      offsetPath: `path('${pathId}')`,
      offsetRotate: '0deg',
      animation: `scooterRide ${duration}s linear ${delay}s infinite`,
      filter: `drop-shadow(0 0 4px ${color})`,
    }}
  />
);

const AnimatedRouteMap = () => {
  /* Approximate South-India + major city coordinates on a 400×320 viewBox */
  const routes = [
    { id: 'r1', d: 'M 185 80 Q 200 130 210 180', color: '#818cf8', dur: 4,  delay: 0   },
    { id: 'r2', d: 'M 210 180 Q 230 210 220 250', color: '#38bdf8', dur: 4.5,delay: 1   },
    { id: 'r3', d: 'M 185 80 Q 155 130 150 175', color: '#34d399', dur: 3.8,delay: 0.5 },
    { id: 'r4', d: 'M 150 175 Q 155 210 160 250', color: '#f472b6', dur: 5,  delay: 1.5 },
    { id: 'r5', d: 'M 185 80 Q 240 100 270 130', color: '#fb923c', dur: 4.2,delay: 0.8 },
  ];

  const nodes = [
    { cx: 185, cy: 80,  label: 'Krishnagiri', color: '#818cf8', delay: 0   },
    { cx: 270, cy: 130, label: 'Bangalore',   color: '#38bdf8', delay: 0.4 },
    { cx: 210, cy: 180, label: 'Chennai',     color: '#34d399', delay: 0.8 },
    { cx: 150, cy: 175, label: 'Hyderabad',   color: '#fb923c', delay: 1.2 },
    { cx: 220, cy: 250, label: 'Coimbatore',  color: '#f472b6', delay: 1.6 },
    { cx: 160, cy: 250, label: 'Kochi',       color: '#818cf8', delay: 2.0 },
  ];

  const floatingBadges = [
    { x: 280, y: 170, icon: Briefcase, label: '120 Jobs',    color: '#6366f1' },
    { x: 90,  y: 190, icon: Zap,       label: '45 Services', color: '#0d9488' },
    { x: 235, y: 280, icon: ShoppingBag,label: '20 Products', color: '#f59e0b' },
  ];

  return (
    <div className="relative w-full aspect-[5/4] max-w-md mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-[2rem] blob-glow-indigo opacity-30" />

      <svg viewBox="0 0 400 320" className="w-full h-full relative z-10" overflow="visible">
        <defs>
          {routes.map(r => (
            <path key={`def-${r.id}`} id={r.id} d={r.d} />
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Route lines — dashed */}
        {routes.map(r => (
          <path
            key={r.id}
            d={r.d}
            fill="none"
            stroke={r.color}
            strokeWidth="1.5"
            strokeDasharray="4 5"
            opacity="0.35"
            style={{
              animation: `routeDotMove ${r.dur * 1.5}s linear infinite`,
              strokeDashoffset: 300,
            }}
          />
        ))}

        {/* Static route outline */}
        {routes.map(r => (
          <path key={`s-${r.id}`} d={r.d} fill="none" stroke={r.color} strokeWidth="0.5" opacity="0.15" />
        ))}

        {/* Traveling glowing dots */}
        {routes.map(r => (
          <TravelingDot key={`dot-${r.id}`} pathId={r.d} duration={r.dur} delay={r.delay} color={r.color} />
        ))}

        {/* City nodes */}
        {nodes.map(n => (
          <RouteNode key={n.label} {...n} />
        ))}

        {/* Floating service badges */}
        {floatingBadges.map((b, i) => (
          <g key={i} style={{ animation: `float ${3.5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` }}>
            <rect x={b.x - 38} y={b.y - 12} width="76" height="22" rx="11"
              fill="rgba(15,23,42,0.85)" stroke={b.color} strokeWidth="0.8" opacity="0.9" />
            <text x={b.x + 4} y={b.y + 4} textAnchor="middle" fontSize="7.5" fontWeight="800"
              fill="white" fontFamily="Inter, sans-serif" opacity="0.9">
              {b.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Live badge */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-xl z-20"
        style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">6 Active Regions</span>
      </motion.div>
    </div>
  );
};

/* ── Main Component ── */
const ServiceCoverage = () => {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/locations');
        setLocations(Array.isArray(data) ? data.filter(loc => loc.isServiceable) : []);
      } catch (err) {
        console.error('Failed to fetch service areas');
      }
    };
    fetchLocations();
  }, []);

  const displayLocations = locations.length > 0 ? locations : [
    { city: 'Chennai',     pincode: '600001' },
    { city: 'Bangalore',   pincode: '560001' },
    { city: 'Hyderabad',   pincode: '500001' },
    { city: 'Mumbai',      pincode: '400001' },
    { city: 'Pune',        pincode: '411001' },
    { city: 'Krishnagiri', pincode: '635001' },
  ];

  return (
    <section id="coverage" className="py-24 bg-[#FAFBFD] dark:bg-[#050B15] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* ── Header + Map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
            >
              <Globe size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Regional Presence</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-6"
            >
              Service{' '}
              <span className="gradient-heading-dark dark:gradient-heading">Coverage</span>
              {' '}& Network
            </motion.h2>

            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
              We are rapidly expanding our footprint across India. Discover our active service
              hubs where we bridge excellence with opportunity.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-white leading-none">100%</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Operational Uptime</p>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-white leading-none">6+</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Active Regions</p>
              </div>
            </motion.div>
          </div>

          {/* Animated Route Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AnimatedRouteMap />
          </motion.div>
        </div>

        {/* ── Location Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {displayLocations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-400 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Pulsing icon */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-slate-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-400 relative z-10">
                  <MapPin size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </div>

              <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">{loc.city}</h3>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">
                {loc.pincode}
              </p>

              <div className="mt-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-full text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 bg-primary rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black mb-2">Can't find your location?</h3>
            <p className="text-white/80 font-medium">We are constantly adding new zones. Send us a request!</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 btn-glass px-10 py-5 rounded-full uppercase tracking-widest text-sm font-black shadow-xl hover:bg-white hover:text-primary"
          >
            Request Integration
          </button>
        </motion.div>

        <LocationRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  );
};

export default ServiceCoverage;

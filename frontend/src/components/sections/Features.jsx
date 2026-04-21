import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, Globe } from 'lucide-react';
import gsap from 'gsap';

const features = [
  { icon: Zap, title: 'Smart Connections', desc: 'AI-driven matchmaking to find the right business partners instantly.' },
  { icon: ShieldCheck, title: 'Verified Businesses', desc: 'Every profile is manually verified to ensure trust and reliability.' },
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Access exclusive deals, jobs, and investment opportunities.' },
  { icon: Globe, title: 'Real-time Networking', desc: 'Chat and collaborate with industry peers in real-time.' },
];

const AnimatedCounter = ({ from, to, duration, text }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return (
    <div ref={nodeRef} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
        {count}
      </div>
      <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{text}</div>
    </div>
  );
};

const Features = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach(card => {
      // GSAP Hover
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: 'power2.out', borderColor: '#FFC107', boxShadow: '0 20px 40px rgba(255,193,7,0.1)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' });
      });
    });
  }, []);

  return (
    <section className="py-12 bg-white dark:bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 py-12 border-y border-gray-100 dark:border-gray-800">
          <AnimatedCounter from={0} to={1248} duration={2} text="Active Members" />
          <AnimatedCounter from={0} to={85} duration={2} text="Events Hosted" />
          <AnimatedCounter from={0} to={300} duration={2} text="Business Deals" />
          <AnimatedCounter from={0} to={25} duration={2} text="Industries" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                className="p-10 bg-gradient-to-br from-[#0a1128] to-[#020617] rounded-[2.5rem] border border-primary/20 hover:border-primary/50 transition-all duration-500 shadow-2xl shadow-primary/5 group"
              >
                <div className="w-14 h-14 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center mb-6 shadow-sm shadow-primary/10">
                  <feat.icon className="text-secondary" size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-secondary transition-colors">{feat.title}</h4>
                <p className="text-zinc-300 leading-relaxed font-medium group-hover:text-white transition-colors">{feat.desc}</p>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Powerful Features for <br/> <span className="text-primary tracking-tight">Ambitious Teams.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Experience a sophisticated networking environment designed for performance and scale. Real-time updates, secure connections, and verified profiles ensure your growth is our absolute priority.
            </p>
            <Link to="/register" className="inline-block px-8 py-4 rounded-full font-bold text-white bg-primary hover:bg-blue-700 shadow-xl shadow-primary/30 transition-all transform hover:-translate-y-1">
              Discover All Features
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

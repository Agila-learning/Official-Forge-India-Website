import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const statItems = [
  { value: '500+', label: 'Verified Partners', color: 'text-primary' },
  { value: '10k+', label: 'Placed Candidates', color: 'text-secondary' },
];

const About = () => {
  const statsRef = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger in the stat boxes when they scroll into view
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      ScrollTrigger.refresh();

      // Hover glow on stat boxes
      statsRef.current.forEach(el => {
        if (!el) return;
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { y: -6, scale: 1.05, duration: 0.3, ease: 'power2.out', boxShadow: '0 0 30px rgba(10,102,194,0.15)' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', boxShadow: 'none' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-10 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            Leading with <span className="animated-text-gradient">Impact</span>, Scaling with <span className="animated-text-gradient">Growth</span>
          </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              At Forge India Connect, we believe in the power of networking. We are dedicated to providing a premium platform where businesses, startups, and professionals can connect, collaborate, and grow globally.
            </p>
            <ul className="space-y-4">
              {['Empowering Startups', 'Fostering B2B Connections', 'Accelerating Industry Growth'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-200 font-medium">
                  <CheckCircle className="text-secondary mr-3" size={20} />
                  {item}
                </li>
              ))}
            </ul>

            {/* GSAP-Animated Stat Boxes */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {statItems.map((stat, i) => (
                <div
                  key={i}
                  ref={el => (statsRef.current[i] = el)}
                  className="p-4 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 cursor-default"
                >
                  <h4 className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/20 z-10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Business Meeting" 
                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h4 className="text-white font-bold text-lg mb-1">Corporate Strategy</h4>
                <p className="text-white/80 text-sm">Empowering the next generation of industry leaders through collaborative networking.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

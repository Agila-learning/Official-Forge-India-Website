import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Briefcase, 
  ShieldCheck, 
  BarChart3, 
  Gamepad2, 
  Globe, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { title: 'Job Consulting', desc: 'Expert guidance for your career paths and opportunities.', icon: Briefcase, color: 'text-blue-500', slug: 'job-consulting' },
  { title: 'Insurance Services', desc: 'Secure your future and business with premium plans.', icon: ShieldCheck, color: 'text-green-500', slug: 'insurance-services' },
  { title: 'Digital Marketing', desc: 'Data-driven marketing to scale your brand presence.', icon: BarChart3, color: 'text-purple-500', slug: 'digital-marketing' },
  { title: 'App Development', desc: 'High-performance mobile applications for iOS & Android.', icon: Gamepad2, color: 'text-red-500', slug: 'app-development' },
  { title: 'Website Development', desc: 'Modern, scalable web platforms built for speed.', icon: Globe, color: 'text-primary', slug: 'website-development' },
];

const Services = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Background Parallax
      gsap.to(".bg-circle", {
        y: 100,
        opacity: 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });

      // Entrance Animation for Header
      gsap.from(".services-header > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".services-header",
          start: "top 90%",
        }
      });

      // Cinematic Card Entrance - Refined for robustness
      const cards = gsap.utils.toArray(".service-card");
      if (cards.length > 0) {
        gsap.fromTo(cards, 
          { 
            y: 40, 
            opacity: 0, 
            filter: "blur(15px)"
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".services-grid",
              start: "top 95%",
              toggleActions: "play none none none",
              once: true
            }
          }
        );
      }
      
      // Delayed refresh to handle Lenis initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      // Safety Fallback: Ensure visibility even if ScrollTrigger fails
      setTimeout(() => {
        gsap.to(".service-card", {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto"
        });
      }, 3000);

      // Continuous Floating
      gsap.to(".service-icon", {
        y: -15,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-24 bg-[#020617] overflow-hidden flex flex-col justify-center border-t border-white/5">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-circle absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="bg-circle absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-20 services-header">
        <div className="text-center">
          <h2 className="text-sm font-black text-secondary uppercase tracking-[0.3em] mb-4">Industrial Solutions</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Expert Services <span className="animated-text-gradient">Engineered</span> for Scale</h3>
          <p className="text-zinc-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">Access verified industry expertise through our specialized service hubs.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 services-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Link 
              key={idx} 
              to={`/services/${service.slug}`}
              style={{ opacity: 1, visibility: 'visible' }}
              className={`service-card group relative bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 hover:border-primary/50 transition-all duration-700 overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/50`}
            >
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="relative z-10">
                  <div className="service-icon w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary transition-colors duration-500">
                    <service.icon size={36} className={`${service.color} group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed mb-10 group-hover:text-zinc-300 transition-colors">{service.desc}</p>
               </div>
               
               <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">View Details</span>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-2">
                    <ArrowRight size={20} />
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

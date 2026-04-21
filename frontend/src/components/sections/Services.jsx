import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, ShieldCheck, BarChart3, 
  Gamepad2, Globe, ArrowRight, Sparkles, Wrench
} from 'lucide-react';

const services = [
  { 
    title: 'Job Consulting', 
    desc: 'Expert placement services for IT, Banking, and Core Engineering sectors across South India.', 
    icon: Briefcase, 
    slug: 'job-consulting',
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  { 
    title: 'Digital Marketing', 
    desc: 'Full-funnel strategies, SEO, and social commerce solutions to scale your business footprint.', 
    icon: BarChart3, 
    slug: 'digital-marketing',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  { 
    title: 'Web & App Dev', 
    desc: 'Modern, scalable digital platforms built with cutting-edge tech stacks by Antigraviity.', 
    icon: Gamepad2, 
    slug: 'website-development',
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  { 
    title: 'Insurance', 
    desc: 'Comprehensive life and business insurance plans through our verified partner networks.', 
    icon: ShieldCheck, 
    slug: 'insurance-services',
    color: 'from-amber-500/20 to-orange-500/20'
  },
  { 
    title: 'Home Services', 
    desc: 'Book verified experts for maintenance, cleaning, and professional domestic assistance.', 
    icon: Wrench, 
    slug: 'home-services',
    color: 'from-sky-500/20 to-blue-500/20'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white dark:bg-dark-bg overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <div className="container-xl">
        <div className="section-header !items-start !text-left lg:!items-center lg:!text-center">
          <span className="section-eyebrow">Enterprise Solutions</span>
          <h2 className="section-title">Verified Services for <span className="text-primary">Growth.</span></h2>
          <p className="section-subtitle lg:mx-auto">Access a curated ecosystem of professional services designed to solve industrial and domestic challenges.</p>
        </div>

        {/* Desktop Grid / Mobile Scrollable */}
        <div className="relative group">
          {/* Scroll indicators for mobile */}
          <div className="flex lg:hidden justify-end mb-4 gap-2">
            <div className="w-8 h-1 bg-primary/20 rounded-full overflow-hidden">
               <motion.div 
                animate={{ x: [-32, 32] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-full bg-primary"
               />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Swipe to explore</span>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-12 lg:pb-0 hide-scrollbar snap-x snap-mandatory px-4 lg:px-0 -mx-4 lg:mx-0">
            {services.map((service, idx) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[280px] sm:min-w-[340px] lg:min-w-0 snap-center group"
              >
                <Link 
                  to={`/services/${service.slug}`}
                  className="block h-full bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                >
                  {/* Decorative background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white dark:bg-dark-bg rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <service.icon size={28} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                      {service.desc}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">Learn More</span>
                      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {/* View All Card (Mobile only) */}
            <div className="lg:hidden min-w-[280px] snap-center">
              <Link 
                to="/services"
                className="h-full flex flex-col items-center justify-center gap-4 bg-primary rounded-[2.5rem] p-10 text-white text-center shadow-xl shadow-primary/20"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={32} />
                </div>
                <p className="font-black uppercase tracking-widest text-xs">Explore All Services</p>
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

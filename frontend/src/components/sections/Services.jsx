import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, ShieldCheck, BarChart3, 
  Smartphone, Globe, ArrowRight, Sparkles, Code2, Palette
} from 'lucide-react';

const services = [
  { 
    title: 'Software Development', 
    desc: 'Scalable. Secure. Future-ready. Custom enterprise solutions tailored for business efficiency.', 
    icon: Code2, 
    slug: 'software-development',
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  { 
    title: 'Web Development', 
    desc: 'Modern, high-performance business websites and SaaS platforms built with modern tech stacks.', 
    icon: Globe, 
    slug: 'web-development',
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  { 
    title: 'Mobile App Development', 
    desc: 'Native and hybrid mobile applications designed for seamless user experiences on all devices.', 
    icon: Smartphone, 
    slug: 'mobile-app-dev',
    color: 'from-indigo-500/20 to-blue-500/20'
  },
  { 
    title: 'AI / ML Solutions', 
    desc: 'Intelligent chatbots, automation tools, and data analytics to future-proof your brand.', 
    icon: Sparkles, 
    slug: 'ai-ml-solutions',
    color: 'from-violet-500/20 to-purple-500/20'
  },
  { 
    title: 'UI/UX Design Services', 
    desc: 'User-centric design thinking to create intuitive, engaging, and beautiful digital products.', 
    icon: Palette, 
    slug: 'ui-ux-design',
    color: 'from-pink-500/20 to-rose-500/20'
  },
  { 
    title: 'Digital Marketing', 
    desc: 'Performance marketing and SEO strategies to scale your business footprint rapidly.', 
    icon: BarChart3, 
    slug: 'digital-marketing',
    color: 'from-purple-500/20 to-pink-500/20'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white dark:bg-dark-bg overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <div className="container-xl">
        <div className="section-header !items-start !text-left lg:!items-center lg:!text-center">
          <span className="section-eyebrow">Your Technology Partner for Growth</span>
          <h2 className="section-title">Transforming Businesses with <span className="text-primary">Smart IT.</span></h2>
          <p className="section-subtitle lg:mx-auto">Scalable. Secure. Future-ready. Access a premium ecosystem of IT solutions, professional training, and business consulting.</p>
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
                  
                  {/* Background Image Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                    <img 
                      src={
                        service.slug === 'software-development' ? '/images/it_solutions_service_1774516061270.png' :
                        service.slug === 'web-development' ? '/images/web_app_dev_service_1774516108629.png' :
                        service.slug === 'mobile-app-dev' ? '/images/real_web_app_dev_1774517609172.png' :
                        service.slug === 'ai-ml-solutions' ? '/images/carousel_hero_1_1774517488962.png' :
                        service.slug === 'ui-ux-design' ? '/images/carousel_hero_3_1774517521046.png' :
                        service.slug === 'digital-marketing' ? '/images/real_digital_marketing_1774517574524.png' :
                        '/images/real_it_solutions_1774517558506.png'
                      }
                      alt="" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    />
                  </div>

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

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, TrendingUp, Handshake, ArrowRight, Briefcase, Building, ShoppingBag, Store } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    title: 'Connecting Businesses. Creating Opportunities.',
    subtitle: 'India’s fastest-growing platform for business networking, collaboration, and industry growth.',
    icon: Network,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // 4K Glass Architecture
    color: 'from-blue-900/80 to-primary/40'
  },
  {
    id: 2,
    title: 'Scale Your Enterprise with Precision.',
    subtitle: 'Access verified IT, Digital Marketing, and Consulting services from top-tier industry leaders.',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', // 4K Modern Office
    color: 'from-gray-900/80 to-secondary/30'
  },
  {
    id: 3,
    title: 'Global Partnerships & Collaboration.',
    subtitle: 'Expand your reach overseas and form strategic alliances through our premium networking hub.',
    icon: Handshake,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', // 4K Business Meeting
    color: 'from-primary/60 to-gray-900/80'
  }
];

const Hero = () => {
  return (
    <section className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-dark-bg pt-0">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.img 
                src={slide.image} 
                alt="Background" 
                className="w-full h-full object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
            
            {/* Multi-layered overlays for depth and legibility */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} mix-blend-multiply z-10 opacity-90`}></div>
            <div className="absolute inset-0 bg-black/40 z-10 backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-10 opacity-90"></div>

            <div className="relative z-20 h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl">
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.05] tracking-tighter drop-shadow-2xl">
                   {slide.title.split(' ').map((word, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                        className={`inline-block ${i % 2 === 1 ? 'animated-text-gradient' : ''}`}
                      >
                        {word}&nbsp;
                      </motion.span>
                   ))}
                </h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-base md:text-xl text-gray-200 mb-10 drop-shadow-lg font-medium max-w-3xl mx-auto leading-relaxed opacity-90"
                >
                  {slide.subtitle}
                </motion.p>
                
                  <div className="mt-12">
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/jobs" className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                <Briefcase size={18} /> Job Consulting
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </Link>
                        
                        <Link to="/home-services" className="group relative px-8 py-4 bg-secondary text-dark-bg rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-secondary/20 hover:scale-105 transition-all overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                <Store size={18} /> Home Services
                            </span>
                            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </Link>

                        <Link to="/explore-shop" className="group px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] backdrop-blur-md transition-all">
                            Industrial Shop
                        </Link>
                    </div>
                  </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style dangerouslySetInnerHTML={{__html: `
        .swiper-pagination-bullet { background: rgba(255,255,255,0.5) !important; width: 14px; height: 14px; margin: 0 8px !important; transition: all 0.3s ease; }
        .swiper-pagination-bullet-active { background: #FFC107 !important; transform: scale(1.4); opacity: 1; }
      `}} />
    </section>
  );
};

export default Hero;

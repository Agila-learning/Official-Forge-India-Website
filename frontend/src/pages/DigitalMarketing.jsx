import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Search, BarChart, Users, ArrowRight, TrendingUp, Target, Globe } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const DigitalMarketing = () => {
  return (
    <div className="bg-orange-50 min-h-screen pb-32 pt-20">
      <SEOMeta title="Digital Marketing & Branding | Forge India Connect" description="Data-driven digital marketing, SEO, social media, and brand identity solutions." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-10" 
            alt="Digital Marketing" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-orange-50/90 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                  <Megaphone size={24} className="text-orange-500" />
                </div>
                <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-xs">Growth Agency</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                Amplify Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Brand Voice</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl">
                Data-driven digital marketing strategies that increase visibility, engage audiences, and drive measurable conversions for your brand.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#inquiry"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all flex items-center gap-3 hover:gap-5"
                >
                  Start Marketing Campaign <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 mt-12">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-100 border border-orange-50">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="text-orange-500" />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 mb-1">+240%</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Traffic Growth</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-900/10">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-white" />
                  </div>
                  <h3 className="font-black text-2xl text-white mb-1">15M+</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audience Reached</p>
                </div>
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=600&auto=format&fit=crop" className="w-full h-64 object-cover rounded-3xl shadow-xl border-4 border-white" alt="Marketing" />
                <div className="bg-amber-400 p-6 rounded-3xl shadow-xl shadow-amber-400/20">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-4">
                    <Target className="text-slate-900" />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 mb-1">3.5x</h3>
                  <p className="text-[10px] font-bold text-slate-900/60 uppercase tracking-widest">ROI Average</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-xl px-6 relative z-20 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Search, title: "SEO Optimization", desc: "Rank higher on search engines and drive organic traffic." },
            { icon: Users, title: "Social Media", desc: "Build community and brand loyalty across platforms." },
            { icon: Target, title: "Paid Advertising", desc: "Targeted PPC campaigns that maximize your ROI." },
            { icon: Globe, title: "Brand Identity", desc: "Logo, guidelines, and visual identity that stands out." }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group text-center"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon size={28} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">{service.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Growth Strategy</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">
              Let's Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Business</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Tell us about your marketing goals, target audience, and current challenges. Our experts will craft a data-driven strategy to accelerate your growth.
            </p>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
              <h4 className="font-black text-slate-900 uppercase mb-4 text-sm">What happens next?</h4>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0">1</div>
                  <p className="text-sm font-bold text-slate-600">Free initial consultation & audit.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0">2</div>
                  <p className="text-sm font-bold text-slate-600">Custom marketing proposal & strategy.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0">3</div>
                  <p className="text-sm font-bold text-slate-600">Campaign launch & continuous optimization.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ServiceInquiryForm 
              serviceType="Marketing & Branding" 
              themeColor="orange" 
              title="Request Marketing Proposal"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DigitalMarketing;

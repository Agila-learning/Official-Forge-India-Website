import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, Zap, Apple, Compass, ArrowRight, Layers, LayoutGrid } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const MobileAppDevelopment = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-20">
      <SEOMeta title="Mobile App Development | Forge India Connect" description="Native iOS and Android application development services. Build powerful mobile experiences." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20 bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-5" 
            alt="Mobile App Development" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(2,132,199,0)", "0 0 20px rgba(2,132,199,0.5)", "0 0 0px rgba(2,132,199,0)"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center"
                >
                  <Smartphone size={24} className="text-sky-600" />
                </motion.div>
                <span className="text-sky-600 font-black uppercase tracking-[0.3em] text-xs">Mobile Engineering</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                Build Powerful <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Mobile Apps</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl">
                We design and develop native and cross-platform mobile applications that users love. Deliver high-performance experiences on both iOS and Android.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#inquiry"
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all flex items-center gap-3 hover:gap-5"
                >
                  Discuss Your App Idea <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:flex justify-center relative"
            >
              <div className="absolute inset-0 bg-sky-400/10 rounded-full blur-3xl" />
              <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop" alt="App UI" className="relative z-10 w-2/3 rounded-[3rem] shadow-2xl border-8 border-white" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-xl px-6 relative z-20 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Apple,
              title: "Native iOS Apps",
              desc: "High-performance applications built specifically for the Apple ecosystem using Swift.",
              bg: "bg-slate-100",
              color: "text-slate-900",
              slug: "ios-development"
            },
            {
              icon: Layers,
              title: "Cross-Platform",
              desc: "Reach both iOS and Android users simultaneously with React Native or Flutter.",
              bg: "bg-sky-50",
              color: "text-sky-600",
              slug: "cross-platform-apps"
            },
            {
              icon: Apple, // You could change this to an Android icon if available, but Apple/Android mix or generic is fine.
              title: "Android Development",
              desc: "Robust native Android applications built with Kotlin to reach billions of users.",
              bg: "bg-emerald-50",
              color: "text-emerald-600",
              slug: "android-development"
            }
          ].map((service, idx) => (
            <Link to={`/services/sub/${service.slug}`} key={idx} className="h-full block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group h-full flex flex-col justify-start"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon size={24} className={service.color} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:text-sky-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <span className="text-sky-400 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Launch Your App</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                Turn Your Vision <br />Into A <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Reality</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Provide us with the details of your mobile app idea. Our team of expert developers and UI/UX designers will craft a strategy to bring it to life.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['App Store Optimization (ASO)', 'Seamless API Integration', 'Scalable Cloud Backend', 'Post-launch Support & Maintenance'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-200">
                    <Compass size={20} className="text-sky-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <ServiceInquiryForm 
                serviceType="Mobile App Development" 
                themeColor="slate" 
                title="Get An App Estimate"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileAppDevelopment;

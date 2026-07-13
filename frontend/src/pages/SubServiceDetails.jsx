import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';
import { subServicesData } from '../data/subServices';

const colorThemes = {
  orange: {
    bgLight: 'bg-orange-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-orange-500',
    bgBadge: 'bg-orange-100',
    gradientText: 'from-orange-500 to-amber-500',
    buttonHover: 'hover:bg-orange-600',
    buttonBg: 'bg-orange-500',
    shadow: 'shadow-orange-500/20'
  },
  blue: {
    bgLight: 'bg-blue-50',
    bgDark: 'bg-[#0c0f1a]',
    textPrimary: 'text-blue-500',
    bgBadge: 'bg-blue-100',
    gradientText: 'from-blue-400 to-indigo-500',
    buttonHover: 'hover:bg-blue-600',
    buttonBg: 'bg-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  cyan: {
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-[#0f172a]',
    textPrimary: 'text-cyan-400',
    bgBadge: 'bg-cyan-100',
    gradientText: 'from-cyan-400 to-blue-500',
    buttonHover: 'hover:bg-cyan-600',
    buttonBg: 'bg-cyan-500',
    shadow: 'shadow-cyan-500/20'
  },
  indigo: {
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-indigo-500',
    bgBadge: 'bg-indigo-100',
    gradientText: 'from-indigo-500 to-purple-500',
    buttonHover: 'hover:bg-indigo-600',
    buttonBg: 'bg-indigo-500',
    shadow: 'shadow-indigo-500/20'
  },
  emerald: {
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-emerald-500',
    bgBadge: 'bg-emerald-100',
    gradientText: 'from-emerald-400 to-teal-500',
    buttonHover: 'hover:bg-emerald-600',
    buttonBg: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/20'
  },
  violet: {
    bgLight: 'bg-violet-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-violet-500',
    bgBadge: 'bg-violet-100',
    gradientText: 'from-violet-500 to-fuchsia-500',
    buttonHover: 'hover:bg-violet-600',
    buttonBg: 'bg-violet-500',
    shadow: 'shadow-violet-500/20'
  },
  rose: {
    bgLight: 'bg-rose-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-rose-500',
    bgBadge: 'bg-rose-100',
    gradientText: 'from-rose-500 to-pink-500',
    buttonHover: 'hover:bg-rose-600',
    buttonBg: 'bg-rose-500',
    shadow: 'shadow-rose-500/20'
  }
};

const SubServiceDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const service = subServicesData[slug];

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  const theme = colorThemes[service.color] || colorThemes.blue;

  return (
    <div className={`min-h-screen pb-32 pt-20 ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? theme.bgDark : theme.bgLight}`}>
      <SEOMeta title={`${service.title} | Forge India Connect`} description={service.description} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={service.heroImage} 
            className={`w-full h-full object-cover ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'opacity-20' : 'opacity-10'}`} 
            alt={service.title} 
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? `from-${theme.bgDark.replace('bg-', '')} via-${theme.bgDark.replace('bg-', '')}/80` : `from-${theme.bgLight.replace('bg-', '')} via-${theme.bgLight.replace('bg-', '')}/90`} to-transparent`} />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <motion.button 
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 mb-8 ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors font-bold text-sm uppercase tracking-wider`}
          >
            <ArrowLeft size={16} /> Back to {service.category}
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`px-4 py-1.5 rounded-full ${theme.bgBadge} ${theme.textPrimary} text-[10px] font-black uppercase tracking-[0.3em] inline-block shadow-sm`}
                >
                  {service.category}
                </motion.div>
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6 ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-white' : 'text-slate-900'}`}>
                {service.title.split(' ')[0]} <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
                  {service.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-gray-400' : 'text-slate-600'}`}>
                {service.description}
              </p>
              
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-3xl z-10" />
               <img src={service.heroImage} className="w-full h-80 object-cover rounded-3xl shadow-2xl" alt={service.title} />
               {/* Decorative elements */}
               <motion.div 
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className={`absolute -bottom-6 -left-6 ${theme.bgBadge} p-6 rounded-2xl shadow-xl backdrop-blur-sm z-20`}
               >
                 <p className={`font-black text-2xl ${theme.textPrimary}`}>100%</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quality Assured</p>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="container-xl px-6 relative z-20 mt-12">
        <div className="text-center mb-16">
           <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-white' : 'text-slate-900'}`}>
             Core <span className={theme.textPrimary}>Capabilities</span>
           </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`border p-8 rounded-[2rem] shadow-sm transition-all group ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-xl'}`}
            >
              <div className={`w-12 h-12 rounded-full ${theme.bgBadge} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <CheckCircle2 size={24} className={theme.textPrimary} />
              </div>
              <h3 className={`text-lg font-black uppercase tracking-tight mb-3 ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-white' : 'text-slate-900'}`}>
                {feature}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className={`${theme.textPrimary} font-black uppercase tracking-[0.3em] text-xs mb-4 block`}>Get Started</span>
            <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-white' : 'text-slate-900'}`}>
              Ready for <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>Success?</span>
            </h2>
            <p className={`text-lg mb-8 leading-relaxed ${['blue', 'cyan', 'indigo', 'violet'].includes(service.color) ? 'text-gray-400' : 'text-slate-600'}`}>
              Contact us today to learn more about our {service.title} services and how we can help your business grow.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ServiceInquiryForm 
              serviceType={service.title} 
              themeColor={service.color} 
              title={`Request ${service.title}`}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SubServiceDetails;

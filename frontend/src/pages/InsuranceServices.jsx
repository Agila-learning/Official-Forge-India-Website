import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ShieldCheck, HeartPulse, Building2, Umbrella, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const InsuranceServices = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-20">
      <SEOMeta title="Insurance & Business Support | Forge India Connect" description="Comprehensive insurance solutions, corporate coverage, health, and business compliance support." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20 bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="/insurance_bg.png" 
            className="w-full h-full object-cover opacity-10" 
            alt="Insurance & Protection" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-transparent" />
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
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(37,99,235,0)", "0 0 20px rgba(37,99,235,0.5)", "0 0 0px rgba(37,99,235,0)"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200"
                >
                  <ShieldCheck size={24} className="text-blue-600" />
                </motion.div>
                <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">Risk Management</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                Protect What <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Matters Most</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl">
                Comprehensive insurance coverage and business compliance solutions. We secure your future, employees, and enterprise against unforeseen risks.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#inquiry"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3 hover:gap-5"
                >
                  Get A Free Quote <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              <div className="space-y-6 mt-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <HeartPulse className="text-rose-500 mb-4" size={32} />
                  <h3 className="font-black text-xl text-slate-900 mb-2">Health & Life</h3>
                  <p className="text-sm text-slate-500 font-medium">Individual and corporate group health coverage policies.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600&auto=format&fit=crop" className="w-full h-48 object-cover rounded-[2rem] shadow-lg" alt="Client Support" />
              </div>
              <div className="space-y-6">
                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop" className="w-full h-48 object-cover rounded-[2rem] shadow-lg" alt="Corporate" />
                <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-600/20 text-white">
                  <Building2 className="text-blue-200 mb-4" size={32} />
                  <h3 className="font-black text-xl text-white mb-2">Commercial</h3>
                  <p className="text-sm text-blue-100 font-medium">Business liability, property, and professional indemnity.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-xl px-6 relative z-20 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: HeartPulse, title: "Health Insurance", desc: "Comprehensive health coverage plans tailored for individuals and corporate teams.", color: "text-rose-500", bg: "bg-rose-50", slug: "health-insurance" },
            { icon: Umbrella, title: "Life Insurance", desc: "Secure your family's future with robust term life and whole life insurance policies.", color: "text-blue-500", bg: "bg-blue-50", slug: "life-insurance" },
            { icon: Building2, title: "Business Insurance", desc: "Protect your enterprise against operational risks, liabilities, and unforeseen disruptions.", color: "text-emerald-500", bg: "bg-emerald-50", slug: "business-insurance" }
          ].map((service, idx) => (
            <Link to={`/services/sub/${service.slug}`} key={idx} className="h-full block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group h-full flex flex-col justify-start"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon size={28} className={service.color} />
                </div>
                <h3 className={`text-xl font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:${service.color} transition-colors`}>{service.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="bg-white border border-slate-100 shadow-xl rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Secure Your Future</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">
                Get A Comprehensive <span className="text-blue-600">Risk Assessment</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Provide us with your specific requirements. Our insurance experts will analyze your risk profile and recommend the most optimal coverage at the best premium.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Multiple provider comparisons', 'Fast claim settlement assistance', 'Dedicated relationship manager', 'Zero hidden fees or commissions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ServiceInquiryForm 
                serviceType="Insurance & Business Support" 
                themeColor="blue" 
                title="Request Free Consultation"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsuranceServices;

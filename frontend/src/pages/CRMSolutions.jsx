import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Workflow, Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';
import ServiceInquiryForm from '../components/forms/ServiceInquiryForm';

const CRMSolutions = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-20">
      <SEOMeta title="CRM Solutions & Implementation | Forge India Connect" description="Intelligent CRM implementations, sales automation, and customer analytics solutions." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20 bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-10" 
            alt="CRM Dashboard" 
          />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.5)", "0 0 0px rgba(16,185,129,0)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block"
              >
                Customer Intelligence
              </motion.span>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                Turn Data Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Relationships.</span>
              </h1>
              
              <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
                Implement powerful CRM systems that automate your sales pipeline, track customer interactions, and drive unprecedented revenue growth.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <a 
                  href="#inquiry"
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-3 hover:gap-5"
                >
                  Request CRM Demo <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl" />
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" alt="CRM Interface" className="relative z-10 rounded-3xl shadow-2xl border border-slate-200" />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 z-20">
                <p className="text-4xl font-black text-emerald-500 mb-1">+140%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sales Conversion</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="container-xl px-6 relative z-20 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">CRM <span className="text-emerald-500">Capabilities</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: "Salesforce Integration", desc: "Seamless setup and integration.", slug: "salesforce-integration" },
              { icon: Workflow, title: "HubSpot CRM Setup", desc: "Inbound marketing and CRM configuration.", slug: "hubspot-crm" },
              { icon: Search, title: "Custom CRM Dev", desc: "Bespoke CRM solutions.", slug: "custom-crm" },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Custom dashboards and forecasting.", slug: "custom-crm" }
            ].map((f, i) => (
              <Link to={`/services/sub/${f.slug}`} key={i}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all group h-full flex flex-col justify-start"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon size={24} className="text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{f.title}</h4>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="order-1 md:order-2 pl-0 md:pl-12">
            <h3 className="text-3xl font-black text-slate-900 mb-6">Stop losing leads to spreadsheet chaos.</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our CRM implementation services take you from zero to fully automated. We don't just sell software; we map your entire sales process, configure the platforms, migrate your legacy data, and train your staff.
            </p>
            <ul className="space-y-4">
              {['Custom Lead Pipelines', 'Automated Email Sequences', 'Role-based Access Control', 'Mobile App Access'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                  <CheckCircle2 size={20} className="text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="container-xl px-6 mt-32">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white">
          <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-6">Certified Implementation Partners</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-16">Platform Integrations</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70">
            <div className="text-2xl font-black tracking-widest">SALESFORCE</div>
            <div className="text-2xl font-black tracking-widest">HUBSPOT</div>
            <div className="text-2xl font-black tracking-widest">ZOHO</div>
            <div className="text-2xl font-black tracking-widest">FRESHWORKS</div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200">
              <Zap size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">
              Ready to multiply your <span className="text-emerald-500">revenue?</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Contact our CRM specialists today for a free workflow analysis and custom deployment strategy.
            </p>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-black text-slate-900 uppercase mb-4 text-sm">Implementation Guarantee</h4>
              <ul className="space-y-3">
                <li className="flex gap-3 items-center">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-sm font-medium text-slate-600">Zero data loss during migration.</p>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-sm font-medium text-slate-600">Full staff training and onboarding.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ServiceInquiryForm 
              serviceType="CRM Solutions" 
              themeColor="emerald" 
              title="Request Workflow Analysis"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CRMSolutions;

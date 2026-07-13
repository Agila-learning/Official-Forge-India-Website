import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import { 
  Building2, ArrowRight, Server, Database, 
  Workflow, Zap, ShieldCheck, CheckCircle2,
  TrendingUp, Users, Factory, ShoppingCart, 
  Settings, LineChart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const erpModules = [
  { icon: Factory, title: 'Manufacturing', desc: 'End-to-end production tracking, BOM management, and quality control.' },
  { icon: ShoppingCart, title: 'Supply Chain', desc: 'Real-time inventory visibility, vendor portals, and procurement automation.' },
  { icon: Users, title: 'Human Resources', desc: 'Complete HRMS with payroll, attendance, and employee lifecycle management.' },
  { icon: LineChart, title: 'Financials', desc: 'Unified ledger, automated tax compliance, and predictive financial analytics.' },
  { icon: Database, title: 'CRM & Sales', desc: 'Lead tracking, pipeline management, and omnichannel customer engagement.' },
  { icon: Settings, title: 'Asset Management', desc: 'Predictive maintenance, asset tracking, and depreciation calculation.' },
];

const ERPSolutions = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Manufacturing',
    employeeSize: '1-50',
    contactName: '',
    contactNumber: '',
    email: '',
    requirements: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactNumber) {
      toast.error('Mission Parameters Incomplete: Company name and contact number are required.');
      return;
    }

    setLoading(true);
    // Mock API call for inquiry submission
    setTimeout(() => {
      toast.success('System Assessment Request Received. Our architects will contact you within 24 hours.', { duration: 4000 });
      setLoading(false);
      setFormData({
        companyName: '', industry: 'Manufacturing', employeeSize: '1-50', contactName: '', contactNumber: '', email: '', requirements: ''
      });
    }, 1500);
  };

  return (
    <>
      <SEOMeta 
        title="Enterprise Resource Planning | Forge India Connect"
        description="Scalable, cloud-native ERP solutions designed to unify operations, automate workflows, and drive unprecedented enterprise growth."
      />

      {/* --- 🚀 HERO SECTION --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-[#050505]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
        
        <div className="max-w-[1536px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/10 dark:bg-secondary/20 text-secondary border border-secondary/20 rounded-full mb-8"
              >
                <Server size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Next-Gen Digital Backbone</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8 uppercase">
                Unify Your <br />
                <span className="text-primary relative inline-block mt-2">
                  Enterprise.
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-secondary" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl">
                Replace fragmented legacy systems with a singular, intelligent core. Our custom ERP integrations synchronize your entire operation, driving radical efficiency and actionable intelligence.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('erp-inquiry-section').scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest text-xs flex items-center gap-3"
                >
                  Request Assessment <ArrowRight size={18} />
                </button>
              </div>
              
              <div className="mt-16 flex items-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                {[
                  { v: '40%', l: 'OpEx Reduction' },
                  { v: '10x', l: 'Data Visibility' },
                  { v: '99.9%', l: 'Uptime SLA' }
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{s.v}</p>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-primary rounded-[3rem] blur-2xl opacity-20 transform -rotate-3 scale-105 pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" 
                alt="ERP Dashboard" 
                className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl"
              />
              <div className="absolute top-10 -right-10 bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Workflow size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900 dark:text-white">Seamless</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Workflow Automation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ⚙️ MODULE ARCHITECTURE --- */}
      <section className="py-24 bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Core <span className="text-secondary">Modules</span></h2>
            <p className="text-gray-500 font-medium">Modular architecture designed to scale. Deploy what you need today, seamlessly expand tomorrow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {erpModules.map((mod, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-secondary/30 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 mb-8 group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all duration-500 shadow-inner">
                  <mod.icon size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-4">{mod.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 📝 INQUIRY FORM --- */}
      <section id="erp-inquiry-section" className="py-24 bg-white dark:bg-[#050505] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1536px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Value Proposition */}
            <div className="lg:col-span-5 space-y-8 sticky top-32">
              <div className="bg-gradient-to-br from-gray-900 to-black p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">Enterprise Audit Protocol</h3>
                <p className="text-gray-400 font-medium mb-10 text-sm leading-relaxed">
                  Initiate a comprehensive digital infrastructure audit. Our architects will analyze your operational bottlenecks and design a tailored ERP blueprint.
                </p>

                <div className="space-y-5 mb-12">
                  {[
                    'Free Operational Assessment',
                    'Custom Workflow Mapping',
                    'ROI & TCO Projection',
                    'Phased Deployment Strategy'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                      <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center text-secondary shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-gray-50 dark:bg-dark-card rounded-[2.5rem] border border-gray-200 dark:border-gray-800 flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">Data Sovereignty</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    End-to-end military-grade encryption with guaranteed data localization and compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-dark-card p-10 md:p-16 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl relative">
                <div className="absolute top-0 left-16 w-32 h-1.5 bg-secondary rounded-b-lg" />
                <div className="mb-12">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3">System Assessment</h3>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Input enterprise data to initiate the architecture review.</p>
                </div>
                
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Company Name</label>
                      <input 
                        type="text" required placeholder="Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Contact Person</label>
                      <input 
                        type="text" required placeholder="John Doe"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Industry Vertical</label>
                      <select 
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all appearance-none"
                      >
                        <option>Manufacturing</option>
                        <option>Retail & E-commerce</option>
                        <option>Healthcare</option>
                        <option>Logistics</option>
                        <option>Education</option>
                        <option>Real Estate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Employee Size</label>
                      <select 
                        value={formData.employeeSize}
                        onChange={(e) => setFormData({...formData, employeeSize: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all appearance-none"
                      >
                        <option>1-50</option>
                        <option>51-200</option>
                        <option>201-500</option>
                        <option>500+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <input 
                        type="email" required placeholder="john@acmecorp.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                      <input 
                        type="tel" required placeholder="+91 XXXXX XXXXX"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Operational Challenges / Requirements</label>
                    <textarea 
                      rows="5" required placeholder="What current systems are you using? What are the main bottlenecks?"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      className="w-full px-6 py-5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-secondary text-dark-bg font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-secondary/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-3"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin"/> Processing Request...</span>
                    ) : (
                      <>Submit Assessment Request <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
};

export default ERPSolutions;

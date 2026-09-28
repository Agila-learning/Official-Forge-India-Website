import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import { 
  Users, ArrowRight, Target, ShieldCheck, 
  CheckCircle2, Briefcase, Network, Rocket, 
  BarChart2, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const recruitmentFeatures = [
  { icon: Target, title: 'Executive Search', desc: 'Targeted headhunting for C-suite and leadership roles.' },
  { icon: Network, title: 'Mass Hiring', desc: 'Scalable recruitment drives for entry-level and bulk requirements.' },
  { icon: ShieldCheck, title: 'Background Verification', desc: 'Comprehensive BGV including criminal, academic, and employment history.' },
  { icon: Rocket, title: 'Campus Placements', desc: 'End-to-end management of university recruitment drives.' },
  { icon: BarChart2, title: 'Talent Mapping', desc: 'Industry benchmarking and talent pool analysis.' },
  { icon: FileText, title: 'RPO Services', desc: 'Recruitment Process Outsourcing for complete hiring lifecycle management.' },
];

const RecruitmentSolutions = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'IT/Technology',
    hiringVolume: '1-10',
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
    setTimeout(() => {
      toast.success('Hiring Request Received. Our recruitment experts will contact you within 24 hours.', { duration: 4000 });
      setLoading(false);
      setFormData({
        companyName: '', industry: 'IT/Technology', hiringVolume: '1-10', contactName: '', contactNumber: '', email: '', requirements: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-[#0c0f1a] min-h-screen pb-32 pt-20">
      <SEOMeta title="Recruitment & Staffing Solutions | Forge India Connect" description="End-to-end recruitment, staffing, and HR consulting services for modern enterprises." />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20" 
            alt="Recruitment Solutions" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f1a] via-[#0c0f1a]/80 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.5)", "0 0 0px rgba(59,130,246,0)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-blue-500/30"
              >
                <Briefcase size={24} className="text-blue-400" />
              </motion.div>
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">Enterprise Staffing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Growth</span> with Top Talent
            </h1>
            
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl">
              From executive search to volume hiring, we provide strategic recruitment solutions that align with your business objectives.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#consultation" className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 group">
                Schedule Consultation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <CheckCircle2 size={18} className="text-green-500" /> 95% Placement Retention
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 relative z-10">
        <div className="container-xl px-6">
          <div className="text-center mb-16">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Core Competencies</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Comprehensive Staffing Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recruitmentFeatures.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <module.icon size={28} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{module.title}</h3>
                <p className="text-gray-400 leading-relaxed">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation" className="py-20 relative z-10 border-t border-white/10">
        <div className="container-xl px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Request a Staffing Proposal</h2>
              <p className="text-gray-400">Tell us about your hiring needs and our recruitment strategists will design a custom solution.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Company Name *</label>
                  <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Industry</label>
                  <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors appearance-none">
                    <option>IT/Technology</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Finance/Banking</option>
                    <option>Retail/E-commerce</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Contact Person</label>
                  <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Contact Number *</label>
                  <input type="tel" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors" placeholder="+91 XXX XXX XXXX" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Hiring Volume / Year</label>
                  <select value={formData.hiringVolume} onChange={e => setFormData({...formData, hiringVolume: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors appearance-none">
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>200+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors" placeholder="you@company.com" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Specific Requirements / Roles</label>
                <textarea value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Describe the roles you are hiring for..."></textarea>
              </div>

              <div className="flex justify-center mt-8">
                <button type="submit" disabled={loading} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Processing Request...' : 'Submit Staffing Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecruitmentSolutions;

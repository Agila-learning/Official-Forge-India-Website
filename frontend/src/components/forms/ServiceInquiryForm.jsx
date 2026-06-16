import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceInquiryForm = ({ serviceType, themeColor = 'blue', title = 'Request a Consultation' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    specificRequirement: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const themeClasses = {
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30',
      icon: 'text-blue-500',
      border: 'focus:border-blue-500 focus:ring-blue-500/20',
      bgLight: 'bg-blue-50/50 dark:bg-blue-900/10'
    },
    emerald: {
      button: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30',
      icon: 'text-emerald-500',
      border: 'focus:border-emerald-500 focus:ring-emerald-500/20',
      bgLight: 'bg-emerald-50/50 dark:bg-emerald-900/10'
    },
    indigo: {
      button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30',
      icon: 'text-indigo-500',
      border: 'focus:border-indigo-500 focus:ring-indigo-500/20',
      bgLight: 'bg-indigo-50/50 dark:bg-indigo-900/10'
    },
    violet: {
      button: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/30',
      icon: 'text-violet-500',
      border: 'focus:border-violet-500 focus:ring-violet-500/20',
      bgLight: 'bg-violet-50/50 dark:bg-violet-900/10'
    },
    slate: {
      button: 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30',
      icon: 'text-slate-700',
      border: 'focus:border-slate-500 focus:ring-slate-500/20',
      bgLight: 'bg-slate-50/50 dark:bg-slate-800/30'
    },
    orange: {
      button: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30',
      icon: 'text-orange-500',
      border: 'focus:border-orange-500 focus:ring-orange-500/20',
      bgLight: 'bg-orange-50/50 dark:bg-orange-900/10'
    },
    sky: {
      button: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/30',
      icon: 'text-sky-500',
      border: 'focus:border-sky-500 focus:ring-sky-500/20',
      bgLight: 'bg-sky-50/50 dark:bg-sky-900/10'
    }
  };

  const currentTheme = themeClasses[themeColor] || themeClasses.blue;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await api.post('/inquiries', {
        ...formData,
        serviceType
      });
      
      setStatus('success');
      setFormData({
        name: '', email: '', contactNumber: '', specificRequirement: '', message: ''
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden bg-white dark:bg-dark-card`}>
      {/* Decorative gradient blob */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${currentTheme.bgLight}`} />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm font-medium text-gray-500 mb-8">Our specialists will review your requirements and get back to you shortly.</p>
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100 dark:bg-green-900/30`}>
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter mb-2 text-gray-900 dark:text-white">Inquiry Received</h4>
              <p className="text-gray-500 text-sm">Thank you! We've logged your request in our system and will contact you soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Submit another request
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-600">{errorMsg}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className={`w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none transition-all font-bold text-sm ${currentTheme.border}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className={`w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none transition-all font-bold text-sm ${currentTheme.border}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Number *</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.contactNumber}
                    onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                    placeholder="+91 9876543210"
                    className={`w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none transition-all font-bold text-sm ${currentTheme.border}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Project/Requirement Type *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.specificRequirement}
                    onChange={e => setFormData({...formData, specificRequirement: e.target.value})}
                    placeholder="e.g. E-commerce Website"
                    className={`w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none transition-all font-bold text-sm ${currentTheme.border}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Additional Details *</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us a bit more about your requirements, timeline, and goals..."
                  className={`w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none transition-all font-bold text-sm resize-none ${currentTheme.border}`}
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-4 px-6 rounded-2xl text-white font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${currentTheme.button}`}
              >
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={16} /> Submit Request</>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceInquiryForm;

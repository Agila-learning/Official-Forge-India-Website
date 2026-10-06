import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SurveyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [category, setCategory] = useState('');
  const [requirement, setRequirement] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already submitted in this session
    if (sessionStorage.getItem('survey_completed')) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStage(1);
  };

  const handleSubmit = async () => {
    if (!requirement.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/inquiries', {
        name: name || 'Website Survey User',
        email: email || 'survey@forgeindiaconnect.com',
        contactNumber: mobile || 'N/A',
        serviceType: `Survey: ${category}`,
        message: requirement,
        requestType: 'General',
        projectType: 'General Inquiry'
      });
      sessionStorage.setItem('survey_completed', 'true');
      setStage(2);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      toast.error('Something went wrong. Please email us directly.');
      // Still move to stage 2 so user can see the email
      setStage(2);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9999] w-[90vw] max-w-sm"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider">Quick Survey</h4>
                  <p className="text-[10px] font-medium opacity-80">We're here to help!</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {stage === 0 && (
                  <motion.div
                    key="stage0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop" alt="Helpful" className="w-full h-32 object-cover rounded-xl mb-4" />
                    <h5 className="text-lg font-black text-slate-800 dark:text-white mb-2">Still confused? Don't worry, I am here to help!</h5>
                    <p className="text-sm text-slate-500 mb-4">Please choose the category that best describes you:</p>
                    
                    <div className="space-y-2">
                      {['Student', 'Organisation', 'College'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl font-bold text-sm transition-colors text-slate-700 dark:text-slate-300"
                        >
                          I am a {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {stage === 1 && (
                  <motion.div
                    key="stage1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h5 className="text-lg font-black text-slate-800 dark:text-white mb-2">Almost there!</h5>
                    <p className="text-xs text-slate-500 mb-4">Tell us your exact requirement and how we can reach you.</p>
                    
                    <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-1">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name *"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        required
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        required
                      />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile Number *"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        required
                      />
                      <textarea
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                        placeholder="E.g., Looking for internship programs..."
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium resize-none focus:outline-none focus:border-primary h-24 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !requirement.trim() || !name.trim() || !email.trim() || !mobile.trim()}
                      className="w-full py-3 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Submitting...' : 'Submit'} <Send size={16} />
                    </button>
                  </motion.div>
                )}

                {stage === 2 && (
                  <motion.div
                    key="stage2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={32} />
                    </div>
                    <h5 className="text-xl font-black text-slate-800 dark:text-white mb-2">Thank You!</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      For a quick response, you can also mail us directly at:
                      <br/>
                      <a href="mailto:info@forgeindiaconnect.com" className="text-primary font-black mt-2 inline-block">info@forgeindiaconnect.com</a>
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SurveyPopup;

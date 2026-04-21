import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare, Phone, Info } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const serviceSpecs = {
  'digital-marketing': {
    label: 'What exactly are you looking for?',
    options: ['SEO Optimization', 'Social Media Marketing', 'PPC / Google Ads', 'Content Strategy', 'Full Digital Transformation']
  },
  'website-development': {
    label: 'What type of website do you need?',
    options: ['Corporate Website', 'E-commerce Platform', 'Portfolio / Personal', 'Custom Web Application (PWA)']
  },
  'app-development': {
    label: 'Target Platform?',
    options: ['iOS App', 'Android App', 'Cross-platform (Flutter/RN)', 'UI/UX Design Only']
  },
  'insurance-services': {
    label: 'Insurance Category?',
    options: ['Health Insurance', 'Life Insurance', 'General / Asset Insurance', 'Corporate Liability']
  },
  'it-solutions': {
    label: 'Service Needed?',
    options: ['Cloud Infrastructure', 'Cybersecurity Audit', 'Managed IT Support', 'Internal Software / ERP']
  }
};

const ServiceInquiryForm = ({ isOpen, onClose, serviceId, serviceName }) => {
  const [formData, setFormData] = useState({
    specificRequirement: '',
    message: '',
    contactNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const specs = serviceSpecs[serviceId] || { label: 'Requirement', options: ['Consultation', 'Standard Service', 'Custom Request'] };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inquiries', {
        serviceType: serviceName,
        specificRequirement: formData.specificRequirement,
        message: formData.message,
        contactNumber: formData.contactNumber
      });
      setIsSuccess(true);
      toast.success('Inquiry submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {isSuccess ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4 dark:text-white">Request Received!</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                Our specialists will analyze your requirement and reach out within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black transition-transform active:scale-95"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black dark:text-white">Service Inquiry</h2>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{serviceName}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{specs.label}</label>
                  <select
                    required
                    value={formData.specificRequirement}
                    onChange={(e) => setFormData({ ...formData, specificRequirement: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    {specs.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message / Details</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-5 text-gray-400" size={18} />
                    <textarea
                      required
                      rows="4"
                      placeholder="Tell us more about your project needs..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary/20 outline-none font-bold resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                  <Info size={16} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                    By submitting, you agree to FIC's Privacy Policy. Your data is secure and used only for service consultation.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Processing Request...'
                  ) : (
                    <>
                      Submit Inquiry <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ServiceInquiryForm;

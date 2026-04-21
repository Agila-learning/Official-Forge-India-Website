import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Building, Mail, Phone, User, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LocationRequestModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    industry: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/location-requests', formData);
      toast.success('Integration request submitted successfully!');
      onClose();
      setFormData({ name: '', email: '', mobile: '', location: '', industry: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="relative h-32 bg-primary flex items-center px-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                  Request <span className="text-secondary italic">Integration</span>
                </h2>
                <p className="text-white/80 font-bold text-[10px] uppercase tracking-widest mt-1">
                  Tell us where you want Forge India Connect next
                </p>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input
                    required
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Requested City / Area"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <Building className="absolute left-4 top-4 text-gray-400" size={18} />
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Industry / Business Type (Optional)"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Additional details or requirements..."
                rows="4"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? 'Processing...' : 'Submit Integration Request'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationRequestModal;

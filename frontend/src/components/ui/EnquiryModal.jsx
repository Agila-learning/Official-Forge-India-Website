import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EnquiryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourcePage, setSourcePage] = useState('Website');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    companyOrCollege: '',
    location: '',
    userType: '',
    interest: '',
    message: ''
  });

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail?.source) setSourcePage(e.detail.source);
      if (e.detail?.interest) setFormData(prev => ({ ...prev, interest: e.detail.interest }));
      setIsOpen(true);
    };
    window.addEventListener('open-enquiry', handleOpen);
    return () => window.removeEventListener('open-enquiry', handleOpen);
  }, []);

  const onClose = () => setIsOpen(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', {
        ...formData,
        sourcePage,
        category: 'Enquiry'
      });
      setSuccess(true);
      toast.success('Enquiry submitted successfully!');
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          firstName: '', email: '', phone: '', companyOrCollege: '', location: '', userType: '', interest: '', message: ''
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:items-start pt-10 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-4 sm:mt-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-10">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Request Received!</h3>
              <p className="text-slate-500 font-medium max-w-md">
                Thank you for reaching out. Our team will review your enquiry and get back to you shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 mt-4 md:mt-0">Let's Get Started</h2>
              <p className="text-slate-500 font-medium mb-6">Fill out the form below and our team will get in touch with you.</p>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Mobile Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Company / College Name</label>
                  <input 
                    type="text" 
                    name="companyOrCollege"
                    value={formData.companyOrCollege}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Your Organization or Institute"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">I am a:</label>
                    <select 
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="">Select Profile</option>
                      <option value="Student">Student</option>
                      <option value="Job Seeker">Job Seeker</option>
                      <option value="College / Institution">College / Institution</option>
                      <option value="Company / Business">Company / Business</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Interested In:</label>
                    <select 
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="">Select Interest</option>
                      <option value="IT Solutions">IT Solutions</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="ERP">ERP</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Recruitment">Recruitment & Staffing</option>
                      <option value="Career Guidance">Career Guidance</option>
                      <option value="Internship">Internship</option>
                      <option value="Final-Year Project">Final-Year Project</option>
                      <option value="Banking Career">Banking Career</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Message (Optional)</label>
                  <textarea 
                    name="message"
                    rows="2"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Tell us more about your requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Submit Enquiry'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;

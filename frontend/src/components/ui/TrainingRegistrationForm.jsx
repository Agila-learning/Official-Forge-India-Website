import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Upload, MapPin, User, Mail, Phone, GraduationCap, Clock, Monitor } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TrainingRegistrationForm = ({ isOpen, onClose, selectedCourse = '' }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    location: '',
    preferredCourse: selectedCourse,
    mode: 'Online',
    qualification: '',
    preferredBatchTiming: 'Morning (10 AM - 12 PM)',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    'Web Development', 'App Development', 'Cloud Engineer', 'Full Stack Development', 
    'UI/UX Design', 'Digital Marketing', 'Software Testing', 'DevOps Basics', 'Data Analytics Basics'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumeUrl = '';
      if (resume) {
        const uploadData = new FormData();
        uploadData.append('file', resume);
        const { data: uploadRes } = await api.post('/upload', uploadData);
        resumeUrl = uploadRes;
      }

      await api.post('/training/register', {
        ...formData,
        resumeUrl
      });

      setSubmitted(true);
      toast.success('Registration successful!');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md z-[2000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[90vh] bg-white dark:bg-dark-card z-[2001] rounded-[3rem] shadow-3xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-dark-bg/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Register for Training</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Accelerate your career with FIC</p>
              </div>
              <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-dark-bg rounded-2xl text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle size={48} />
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Registration Complete!</h4>
                  <p className="text-gray-500 font-medium max-w-xs mx-auto">
                    We've received your application. Our academic coordinator will contact you within 24 hours for the next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} /> Full Name
                      </label>
                      <input 
                        required
                        name="candidateName"
                        value={formData.candidateName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} /> Email Address
                      </label>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone size={12} /> Phone Number
                      </label>
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                      />
                    </div>
                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> Current Location
                      </label>
                      <input 
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Chennai, TN"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={12} /> Preferred Course
                    </label>
                    <select 
                      name="preferredCourse"
                      value={formData.preferredCourse}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-black uppercase text-[11px] tracking-widest"
                    >
                      <option value="">Select a course</option>
                      {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mode */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Monitor size={12} /> Training Mode
                      </label>
                      <div className="flex gap-2">
                        {['Online', 'Offline'].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setFormData({ ...formData, mode: m })}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${formData.mode === m ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 dark:bg-dark-bg text-gray-400 border-gray-100 dark:border-gray-800'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Timing */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> Preferred Timing
                      </label>
                      <select 
                        name="preferredBatchTiming"
                        value={formData.preferredBatchTiming}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-xs"
                      >
                        <option>Morning (10 AM - 12 PM)</option>
                        <option>Afternoon (2 PM - 4 PM)</option>
                        <option>Evening (6 PM - 8 PM)</option>
                        <option>Weekend Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={12} /> Educational Qualification
                    </label>
                    <input 
                      required
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g. B.E Computer Science"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
                    />
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Upload size={12} /> Resume (Optional)
                    </label>
                    <div className="relative group">
                      <input 
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full px-5 py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-primary/50 transition-all bg-gray-50/50 dark:bg-dark-bg/50">
                        <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {resume ? resume.name : 'Upload Resume (PDF/DOC)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Confirm Registration
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TrainingRegistrationForm;

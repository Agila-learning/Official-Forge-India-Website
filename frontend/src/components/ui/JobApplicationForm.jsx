import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, CheckCircle2, User, Mail, Phone, Briefcase, FileText } from 'lucide-react';
import api from '../../services/api';

const JobApplicationForm = ({ isOpen, onClose, jobId, onSuccess, jobTitle = "General Application" }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    domain: '',
    jobRole: jobTitle,
    resume: null,
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (userInfo && (userInfo.role === 'Candidate' || userInfo.role === 'Customer')) {
      setFormData(prev => ({
        ...prev,
        fullName: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        phone: userInfo.mobile || '',
        resumeUrl: userInfo.resumeUrl || null
      }));
      setHasAutoFilled(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalResumeUrl = formData.resumeUrl;

      // Handle resume upload if a new file is uploaded
      if (formData.resume) {
        const uploadData = new FormData();
        uploadData.append('file', formData.resume);
        // Using api instead of axios to hit http://localhost:5000/api/upload
        const { data: uploadPath } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalResumeUrl = uploadPath;
      }

      // POST to backend API - using api instead of axios
      const response = await api.post('/applications/apply', {
          ...formData,
          resumeUrl: finalResumeUrl,
          userId: userInfo?._id,
          jobId: jobId
      });
      console.log('Submission Success:', response.data);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-dark-bg w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative border border-gray-100 dark:border-gray-800"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-primary transition-colors z-10">
          <X size={32} />
        </button>

        <div className="p-8 md:p-12">
          {!isSuccess ? (
            <>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-black mb-2">Apply for {jobTitle}</h2>
                <p className="text-gray-500 font-medium">Step {step} of 2: {step === 1 ? 'Personal Details' : 'Professional Info'}</p>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                        initial={{ width: "50%" }}
                        animate={{ width: step === 1 ? "50%" : "100%" }}
                        className="h-full bg-primary"
                    />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          required
                          type="text" 
                          placeholder="Full Name"
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          required
                          type="email" 
                          placeholder="Email Address"
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          required
                          type="tel" 
                          placeholder="Phone Number"
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                      >
                        Next Step
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select 
                          required
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium appearance-none"
                          value={formData.domain}
                          onChange={(e) => setFormData({...formData, domain: e.target.value})}
                        >
                          <option value="">Select Domain</option>
                          <option value="IT">IT & Infrastructure</option>
                          <option value="Marketing">Digital Marketing</option>
                          <option value="Banking">Banking & Finance</option>
                          <option value="Manufacturing">Manufacturing</option>
                        </select>
                      </div>
                      
                      <div className="relative">
                        {formData.resumeUrl ? (
                            <div className="flex items-center gap-4 p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800">
                                <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                                <div className="flex-1">
                                    <p className="text-sm font-black text-green-700 dark:text-green-300">Using Saved Resume</p>
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Auto-attached from your profile</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, resumeUrl: null})}
                                    className="text-xs font-black text-primary hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary cursor-pointer group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className={`w-10 h-10 mb-3 ${formData.resume ? 'text-green-500' : 'text-gray-400 group-hover:text-primary'} transition-colors`} />
                                    <p className="text-sm font-bold text-gray-500">
                                        {formData.resume ? formData.resume.name : 'Upload Resume (PDF/DOC)'}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({...formData, resume: e.target.files[0]})} />
                            </label>
                        )}
                      </div>

                      <div className="relative">
                        <FileText className="absolute left-5 top-5 text-gray-400" size={20} />
                        <textarea 
                          placeholder="Cover Letter (Optional)"
                          rows="3"
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium resize-none"
                          value={formData.coverLetter}
                          onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 py-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black rounded-2xl"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-5 bg-secondary text-dark-bg font-black rounded-2xl shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg"></span>
                            ) : (
                                <><Send size={20} /> Submit Application</>
                            )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-green-500" size={60} />
              </div>
              <h2 className="text-4xl font-black mb-4">Application Received!</h2>
              <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
                Thank you for applying. Our team will reach out shortly to discuss the next steps in your career journey!
              </p>
              <button 
                onClick={onClose}
                className="px-10 py-4 bg-primary text-white font-black rounded-full"
              >
                Close Window
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JobApplicationForm;

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Upload, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../services/api';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-input', {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      attachmentUrl: ''
    };

    try {
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        const uploadRes = await api.post('/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        data.attachmentUrl = uploadRes.data;
      }

      await api.post('/contacts', data);
      setStatus({ loading: false, success: true, error: '' });
      e.target.reset();
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-dark-bg/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Get in <span className="text-primary tracking-tight">Touch</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Have questions or need assistance? Fill out the form, attach any relevant documents, and our tech specialists will assist you shortly.
            </p>

            <div className="space-y-8 mb-10">
              <div className="flex items-start group">
                <div className="w-14 h-14 bg-white dark:bg-dark-card shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-primary mr-5 shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">+91 63694-06416</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-14 h-14 bg-white dark:bg-dark-card shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-primary mr-5 shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">info@forgeindiaconnect.com</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-14 h-14 bg-white dark:bg-dark-card shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-primary mr-5 shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Physical Address</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 shadow-xl shadow-primary/5 border border-white/40 dark:border-gray-800 rounded-3xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Send us a Message</h3>
            
            {status.success ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 p-6 rounded-2xl flex items-center text-lg font-medium">
                <CheckCircle className="mr-3 shrink-0" size={24} /> Message & document sent successfully! We will contact you soon.
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {status.error && <div className="text-red-500 font-medium mb-4 p-4 bg-red-50 rounded-xl">{status.error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="contact-input">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">First Name</label>
                    <input name="firstName" required type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" placeholder="John" />
                  </div>
                  <div className="contact-input">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">Last Name</label>
                    <input name="lastName" required type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="contact-input">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">Email Address</label>
                    <input name="email" required type="email" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" placeholder="john@company.com" />
                  </div>
                  <div className="contact-input">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">Phone Number</label>
                    <input name="phone" required type="tel" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className="contact-input">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">Message</label>
                  <textarea name="message" required rows="4" className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <div className="contact-input">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">Attach Documents (Optional)</label>
                  <div className="relative group cursor-pointer bg-white dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors overflow-hidden">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex flex-col items-center justify-center p-6 text-center pointer-events-none relative z-0">
                      <Upload size={28} className="text-primary mb-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {file ? <span className="text-primary font-bold">{file.name}</span> : 'Click or drag files here to upload'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="contact-input pt-4">
                  <button type="submit" disabled={status.loading} className="w-full flex justify-center items-center py-4 rounded-xl font-bold text-white bg-primary hover:bg-blue-700 shadow-xl shadow-primary/30 transition-all transform hover:-translate-y-1 text-lg disabled:opacity-70 disabled:hover:translate-y-0">
                    {status.loading ? <span className="animate-pulse">Sending...</span> : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

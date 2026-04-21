import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2, Phone, Fingerprint, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'mobile'
  const [formData, setFormData] = useState({ email: '', password: '', mobile: '', otp: '' });
  const [status, setStatus] = useState({ loading: false, error: '', otpSent: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: '' });
    
    try {
      let response;
      if (loginMethod === 'email') {
          const normalizedEmail = formData.email?.toLowerCase().trim();
          response = await api.post('/auth/login', {
            email: normalizedEmail,
            password: formData.password
          });
      } else {
          // Mobile OTP Verification
          response = await api.post('/auth/verify-otp', {
            mobile: formData.mobile,
            otp: formData.otp
          });
      }

      const { data } = response;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success(`Welcome back, ${data.firstName}!`, { 
        duration: 4000,
        icon: '👋'
      });
      
      if (data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'Vendor') {
        navigate('/vendor');
      } else if (data.role === 'HR') {
        navigate('/hr');
      } else if (data.role === 'Delivery Partner') {
        navigate('/delivery');
      } else if (data.role === 'Candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setStatus({ 
        ...status,
        loading: false, 
        error: err.response?.data?.message || 'Authentication failed. Please check credentials.' 
      });
    }
  };

  const handleSendOTP = async () => {
    if (!formData.mobile) {
        setStatus({ ...status, error: 'Please enter mobile number' });
        return;
    }
    setStatus({ ...status, loading: true, error: '' });
    try {
        await api.post('/auth/send-otp', { mobile: formData.mobile });
        setStatus({ ...status, loading: false, otpSent: true, error: '' });
        toast.success('OTP sent to your mobile!');
    } catch (err) {
        setStatus({ 
            ...status, 
            loading: false, 
            error: err.response?.data?.message || 'Failed to send OTP' 
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-white dark:bg-dark-bg">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-dark-card rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 overflow-hidden relative z-10"
      >
        {/* Left Side: Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-primary to-blue-700 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-10"
            >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20 text-secondary">
                    <Fingerprint size={32} />
                </div>
                <h2 className="text-5xl font-black mb-6 leading-tight">Secure Access <br/> Simplified.</h2>
                <p className="text-xl text-white/80 mb-10 leading-relaxed font-medium">Choose your preferred login method for a seamless experience on Forge India Connect.</p>
                
                <div className="space-y-6">
                    {['256-bit Encryption', 'Instant OTP Verification', 'Multi-role Dashboard Access'].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <CheckCircle2 size={24} className="text-secondary" />
                            <span className="font-bold text-lg">{item}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-16 flex flex-col justify-center">
          <div className="text-center lg:text-left mb-8">
            <div className="flex justify-center lg:justify-start mb-6">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 group-hover:rotate-12 transition-transform shadow-lg border border-gray-100 dark:border-gray-800">
                        <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none uppercase">FORGE <span className="text-primary italic">INDIA</span></span>
                        <span className="text-[10px] text-[#FFC107] font-black uppercase tracking-[0.2em]">Connect</span>
                    </div>
                </Link>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Enter your credentials to continue your journey</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex p-1 bg-gray-50 dark:bg-dark-bg rounded-2xl mb-8 border border-gray-100 dark:border-gray-800">
            <button 
                onClick={() => { setLoginMethod('email'); setStatus({ ...status, error: '', otpSent: false }); }}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-dark-card text-primary shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Email
            </button>
            <button 
                onClick={() => { setLoginMethod('mobile'); setStatus({ ...status, error: '', otpSent: false }); }}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'mobile' ? 'bg-white dark:bg-dark-card text-primary shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Mobile / OTP
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <AnimatePresence mode="wait">
                {loginMethod === 'email' ? (
                    <motion.div 
                        key="email-form"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-16 pr-6 py-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold" 
                                    placeholder="admin@forgeindia.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Lost access?</Link>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full pl-16 pr-6 py-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold" 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="mobile-form"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                            <div className="relative group flex gap-3">
                                <div className="relative flex-grow">
                                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type="tel" 
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold" 
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                {!status.otpSent && (
                                    <button 
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={status.loading || !formData.mobile}
                                        className="px-6 py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black uppercase text-[10px] tracking-widest rounded-3xl transition-all hover:bg-primary hover:text-white whitespace-nowrap"
                                    >
                                        Send OTP
                                    </button>
                                )}
                            </div>
                        </div>

                        {status.otpSent && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2 text-left"
                            >
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">One-Time Password (OTP)</label>
                                <div className="relative group">
                                    <ShieldCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type="text" 
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-[1em] text-center" 
                                        placeholder="000000"
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleSendOTP}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 hover:underline"
                                >
                                    Resend Code?
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {status.error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-3xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest"
              >
                <AlertCircle size={18} /> {status.error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={status.loading || (loginMethod === 'mobile' && !status.otpSent)}
              className="w-full bg-primary hover:bg-blue-700 disabled:opacity-50 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {status.loading ? (
                <>Authenticating... <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Sign In to Account <LogIn size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center lg:text-left">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
                New to FIC? {' '}
                <Link to="/register" className="text-secondary hover:text-yellow-600 transition-colors underline-offset-4 underline decoration-2 font-black uppercase tracking-widest text-[11px]">
                    Create account
                </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

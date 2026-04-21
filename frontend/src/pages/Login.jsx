import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, Loader2, Phone, Fingerprint, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

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
      
      const roleMap = {
        'Admin': '/admin/dashboard',
        'Vendor': '/vendor',
        'HR': '/hr',
        'Delivery Partner': '/delivery',
        'Candidate': '/candidate/dashboard'
      };
      
      navigate(roleMap[data.role] || '/');
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
    <>
      <SEOMeta 
        title="Login | Forge India Connect Member Portal"
        description="Securely sign in to your Forge India Connect account. Access job consulting, business services, and manage your profile."
        canonical="/login"
      />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-slate-50 dark:bg-dark-bg">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10"
        >
          {/* Left Side: Marketing (Hidden on mobile) */}
          <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-indigo-900 to-primary text-white relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/20 text-secondary shadow-xl">
                <Fingerprint size={32} />
              </div>
              <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter">Access the <br/>Connect Hub.</h2>
              <p className="text-xl text-white/70 mb-12 leading-relaxed">Your gateway to high-trust networking and career excellence in South India.</p>
              
              <div className="space-y-6">
                {[
                  'Enterprise-grade Security',
                  'One-click OTP Verification',
                  'Personalized Experience'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="font-bold text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            {/* Logo Mobile */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-lg border border-slate-100">
                  <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-left leading-none">
                  <span className="text-xl font-black text-slate-900 dark:text-white block tracking-tighter uppercase">FORGE INDIA</span>
                  <span className="text-[9px] text-secondary font-black uppercase tracking-[0.2em] mt-1 block">Connect</span>
                </div>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Sign in to your FIC account</p>
            </div>

            {/* Toggle Method */}
            <div className="flex p-1 bg-slate-50 dark:bg-dark-bg rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
              {['email', 'mobile'].map((method) => (
                <button 
                  key={method}
                  onClick={() => { setLoginMethod(method); setStatus({ ...status, error: '', otpSent: false }); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === method ? 'bg-white dark:bg-dark-card text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {method === 'email' ? 'Email Address' : 'Mobile / OTP'}
                </button>
              ))}
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <AnimatePresence mode="wait">
                {loginMethod === 'email' ? (
                  <motion.div 
                    key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" required placeholder="name@company.com"
                          value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="form-input pl-16 py-5 !rounded-2xl w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                        <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot?</Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="password" required placeholder="••••••••"
                          value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="form-input pl-16 py-5 !rounded-2xl w-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="mobile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                          <input 
                            type="tel" required placeholder="+91 00000 00000"
                            value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            className="form-input pl-16 py-5 !rounded-2xl"
                          />
                        </div>
                        {!status.otpSent && (
                          <button 
                            type="button" onClick={handleSendOTP} disabled={status.loading || !formData.mobile}
                            className="btn-primary !py-5 !px-8 !rounded-2xl !bg-slate-900 !text-white whitespace-nowrap active:scale-95 transition-transform"
                          >
                            Get OTP
                          </button>
                        )}
                      </div>
                    </div>
                    {status.otpSent && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
                        <input 
                          type="text" required maxLength="6" placeholder="000000"
                          value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})}
                          className="form-input py-5 !rounded-2xl text-center tracking-[1em] font-black"
                        />
                        <button type="button" onClick={handleSendOTP} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline ml-1">Resend Code?</button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {status.error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold"
                >
                  <AlertCircle size={16} /> {status.error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={status.loading || (loginMethod === 'mobile' && !status.otpSent)}
                className="btn-primary w-full !py-5 !rounded-2xl !text-sm group"
              >
                {status.loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <p className="mt-10 text-center text-slate-500 font-bold text-sm">
              Don't have an account? {' '}
              <Link to="/register" className="text-secondary hover:underline underline-offset-4 decoration-2 font-black uppercase tracking-widest text-[11px]">
                Register Now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;

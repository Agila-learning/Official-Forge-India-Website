import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OTPVerification = ({ onVerify, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current.focus();
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Auto verify when full
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = (code) => {
    setIsVerifying(true);
    // Simulate network delay
    setTimeout(() => {
      setIsVerifying(false);
      if (code === '1234') { // Mock correct OTP
        toast.success('Mission Verified Successfully!');
        onVerify();
      } else {
        toast.error('Invalid PIN. Please ask the customer.');
        setOtp(['', '', '', '']);
        inputRefs[0].current.focus();
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-white dark:bg-[#0F1115] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-auto"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
          <ShieldCheck size={32} className="text-blue-500" />
        </div>
        
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Verify Mission PIN</h3>
          <p className="text-gray-500 text-xs font-bold mt-2">Ask the customer for the 4-digit PIN to complete the mission.</p>
        </div>

        <div className="flex gap-3 justify-center my-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-16 text-center text-2xl font-black bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
              disabled={isVerifying}
            />
          ))}
        </div>

        <div className="w-full flex gap-3">
          <button 
            onClick={onCancel}
            disabled={isVerifying}
            className="flex-1 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <XCircle size={16} /> Cancel
          </button>
          
          <button 
            onClick={() => handleVerify(otp.join(''))}
            disabled={isVerifying || otp.some(d => d === '')}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isVerifying ? (
              <motion.div 
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            ) : (
              <>
                <CheckCircle2 size={16} /> Verify
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OTPVerification;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MembershipPromptModal = ({ isOpen, onClose, onSuccess, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const planPrice = 199; // Demo price in INR

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create Order
      const { data: orderData } = await api.post('/payments/create-order', {
        amount: planPrice,
        currency: 'INR',
        type: 'membership',
        receipt: `receipt_mem_${Date.now()}`
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo123',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FIC Membership Hub',
        description: 'Premium Service Membership',
        image: '/assets/logo.png', // Add logo if available
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify Payment
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: 'membership',
              planType: 'Premium',
              amount: planPrice
            });
            
            toast.success('Membership activated successfully!', { icon: '🎉' });
            onSuccess();
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@gmail.com',
          contact: '9999999999'
        },
        theme: {
          color: '#2563EB'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error('Failed to initialize payment.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-[#0F1117] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10">
          
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 rounded-full transition-colors backdrop-blur-md">
              <X size={18} className="text-gray-900 dark:text-white" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <Crown size={150} />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">FIC Premium Membership</h2>
            <p className="text-blue-100 text-sm font-medium">Unlock exclusive discounts on Rides, Stays & Services.</p>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm font-bold text-gray-400 line-through">₹499</span>
              <span className="text-4xl font-black text-gray-900 dark:text-white">₹{planPrice}</span>
              <span className="text-xs font-bold text-gray-500">/ month</span>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'Zero Convenience Fees on all bookings',
                'Priority Matching with top-rated partners',
                'Up to 20% discount on Intercity Rides',
                'Exclusive access to premium rentals'
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 shadow-xl shadow-gray-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                {loading ? 'Processing...' : 'Activate Membership Now'}
              </button>
              <button 
                onClick={onSkip} 
                disabled={loading}
                className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-70"
              >
                Skip for Now
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Secured by Razorpay</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MembershipPromptModal;

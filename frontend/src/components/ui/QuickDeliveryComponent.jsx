import React, { useState } from 'react';
import { Package, MapPin, Truck, Calendar, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const QuickDeliveryComponent = ({ userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    packageType: 'Document',
    weight: 'Up to 1kg',
    instructions: '',
    paymentMethod: 'Cash'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pickupAddress || !formData.dropoffAddress) {
      toast.error('Pickup and Dropoff addresses are required');
      return;
    }
    
    setLoading(true);
    try {
      // Formulate a Quick Delivery Order
      const deliveryOrder = {
        orderItems: [{
          name: `Quick Delivery - ${formData.packageType} (${formData.weight})`,
          price: 150, // Base price for local delivery
          qty: 1,
          isService: true,
          category: 'Logistics',
        }],
        shippingAddress: {
          address: formData.dropoffAddress,
          city: 'Local',
          postalCode: '000000',
          country: 'India',
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: 150,
        instructions: `Pickup: ${formData.pickupAddress} | Instructions: ${formData.instructions}`,
        fulfillmentType: 'Delivery Partner'
      };

      const { data } = await api.post('/orders', deliveryOrder);

      if (formData.paymentMethod === 'Online') {
        const rzpResponse = await api.post('/payments/create-order', { orderId: data._id });
        const options = {
          key: rzpResponse.data.keyId,
          amount: rzpResponse.data.amount,
          currency: 'INR',
          name: 'Forge India Connect',
          description: 'Quick Delivery Payment',
          order_id: rzpResponse.data.id,
          handler: async function (response) {
            try {
              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data._id
              });
              toast.success(`Quick Delivery Booked & Paid! Order ID: #${data._id.slice(-6).toUpperCase()}`);
            } catch (err) {
              toast.error('Payment verification failed, but order was created.');
            }
          },
          prefill: {
            name: userInfo?.firstName,
            email: userInfo?.email,
            contact: userInfo?.mobile || ''
          },
          theme: { color: '#f97316' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.success(`Quick Delivery Booked! Order ID: #${data._id.slice(-6).toUpperCase()}`);
      }
      
      // Reset form
      setFormData({
        pickupAddress: '',
        dropoffAddress: '',
        packageType: 'Document',
        weight: 'Up to 1kg',
        instructions: '',
        paymentMethod: 'Cash'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Logistics</p>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Quick <span className="text-primary">Delivery</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2 flex items-center gap-2"><MapPin size={14} className="text-primary" /> Pickup Location</label>
                <input 
                  type="text" 
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Enter full pickup address"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2 flex items-center gap-2"><Navigation size={14} className="text-red-500" /> Dropoff Location</label>
                <input 
                  type="text" 
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({...formData, dropoffAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Enter full destination address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2"><Package size={14} className="inline mr-1"/> Package Type</label>
                  <select 
                    value={formData.packageType}
                    onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  >
                    <option>Document</option>
                    <option>Electronics</option>
                    <option>Food</option>
                    <option>Clothes</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Estimated Weight</label>
                  <select className="w-full p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  >
                    <option>Up to 1kg (Documents)</option>
                    <option>1kg - 5kg</option>
                    <option>5kg - 10kg</option>
                    <option>Heavy (&gt;10kg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Special Instructions</label>
                <textarea 
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  placeholder="e.g. Fragile, ring doorbell, etc."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">Payment Method</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border ${formData.paymentMethod === 'Cash' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-gray-200 text-gray-500'} cursor-pointer transition-all`}>
                    <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === 'Cash'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="hidden" />
                    Cash on Pickup/Delivery
                  </label>
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border ${formData.paymentMethod === 'Online' ? 'border-green-500 bg-green-500/10 text-green-600 font-bold' : 'border-gray-200 text-gray-500'} cursor-pointer transition-all`}>
                    <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === 'Online'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="hidden" />
                    Pay Online Now
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              <Truck size={18} />
              {loading ? 'Booking Agent...' : 'Book Delivery Now'}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Instant Dispatch</h3>
              <p className="text-white/80 text-sm mb-6">Our fleet of verified Delivery Partners is on standby. Book a Quick Delivery and an agent will be assigned immediately.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                  <Clock size={20} className="text-amber-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/70">Avg. Assignment Time</p>
                    <p className="font-bold">&lt; 3 Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                  <Truck size={20} className="text-emerald-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/70">Local Rate</p>
                    <p className="font-bold">₹150 Base Fare</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickDeliveryComponent;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { CheckCircle2, Truck, Package, PackageOpen, ChevronLeft, AlertCircle, XCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data);
      } catch (err) {
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase">Order Not Found</h2>
        <button onClick={() => navigate('/profile')} className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">Back to Profile</button>
      </div>
    );
  }

  // Map backend status to stepper index
  const stages = [
    { title: 'Order Confirmed', icon: CheckCircle2 },
    { title: 'Processing & Packed', icon: Package },
    { title: 'In Transit', icon: Truck },
    { title: 'Out for Delivery', icon: Truck },
    { title: 'Delivered', icon: PackageOpen }
  ];

  let currentStageIndex = 0;
  const s = order.status;
  
  if (s === 'Packed' || s === 'Packing Started' || s === 'Ready for Pickup') {
    currentStageIndex = 1;
  } else if (s === 'Picked Up' || s === 'In Transit' || s === 'Reached Hub' || s === 'Partner Assigned') {
    currentStageIndex = 2;
  } else if (s === 'Out for Delivery') {
    currentStageIndex = 3;
  } else if (s === 'Delivered' || s === 'Completed' || s === 'Settled' || s === 'Settlement Pending') {
    currentStageIndex = 4;
  }

  const isCancelled = s.includes('Cancel') || s.includes('Return') || s.includes('Refund');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-blue-600 uppercase tracking-widest mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">Track Order</h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{order.totalPrice?.toLocaleString()}</p>
            </div>
          </div>

          {/* Cancelled State */}
          {isCancelled ? (
            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20 text-center">
              <XCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-red-600 uppercase tracking-tighter mb-2">Order {s}</h3>
              <p className="text-sm font-bold text-red-400">This order cannot be fulfilled or has been returned.</p>
            </div>
          ) : (
            /* Stepper */
            <div className="relative py-8">
              {/* Vertical Line for Mobile, Horizontal for Desktop */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 dark:bg-gray-800 md:hidden z-0"></div>
              <div className="hidden md:block absolute left-12 right-12 top-14 h-1 bg-gray-100 dark:bg-gray-800 z-0"></div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
                {stages.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isActive = idx === currentStageIndex;
                  const Icon = stage.icon;

                  return (
                    <div key={idx} className="flex md:flex-col items-center md:items-center gap-6 md:gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-blue-600 border-blue-100 dark:border-blue-900/30 text-white shadow-lg shadow-blue-600/30' 
                          : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-400'
                      } ${isActive ? 'scale-110 ring-4 ring-blue-600/20' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                          {stage.title}
                        </p>
                        {isActive && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] font-bold text-gray-500 uppercase mt-1"
                          >
                            Current Stage
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-dark-bg p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={14}/> Shipping Address
              </h3>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{order.shippingAddress?.address}</p>
              <p className="text-sm font-bold text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p className="text-sm font-bold text-gray-500">{order.shippingAddress?.country}</p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-bg p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Package size={14}/> Order Items ({order.orderItems?.length})
              </h3>
              <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px] sm:max-w-[200px]">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-500">Qty: {item.qty} • ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

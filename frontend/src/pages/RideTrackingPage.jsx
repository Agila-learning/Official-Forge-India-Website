import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Car, Phone, Star, Check,
  ChevronRight, Navigation, Loader2, X, CreditCard, Banknote,
  MessageSquare, ShieldAlert, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';
import InAppChat from '../components/ui/InAppChat';

const STATUSES = ['Searching', 'Accepted', 'Arrived', 'InRide', 'Completed'];
const STATUS_LABELS = {
  Searching: 'Finding Driver...',
  Accepted:  'Driver Assigned',
  Arrived:   'Driver at Pickup',
  InRide:    'On the Way',
  Completed: 'Ride Completed'
};
const STATUS_COLORS = {
  Searching: 'text-yellow-500',
  Accepted:  'text-blue-500',
  Arrived:   'text-purple-500',
  InRide:    'text-green-500',
  Completed: 'text-green-600'
};
const SERVER_TO_LOCAL = {
  'Searching Driver':       'Searching',
  'Driver Assigned':        'Accepted',
  'Driver Reached Pickup':  'Arrived',
  'Ride Started':           'InRide',
  'Completed':              'Completed',
};

const RideTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSafetyMode = searchParams.get('safety') === 'true';
  const socketRef = useRef(null);

  const [isChatOpen, setIsChatOpen]   = useState(false);
  const [statusIdx, setStatusIdx]     = useState(0);
  const [driver, setDriver]           = useState(null);
  const [otp, setOtp]                 = useState('----');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [fareAmt, setFareAmt]         = useState(0);
  const [elapsed, setElapsed]         = useState(0);
  const [vehiclePos, setVehiclePos]   = useState({ x: 20, y: 70 });
  const [showRating, setShowRating]   = useState(false);
  const [ratingVal, setRatingVal]     = useState(5);
  const [feedback, setFeedback]       = useState('');
  const [rideData, setRideData]       = useState(null);
  const [pickupAddr, setPickupAddr]   = useState('India');
  const [dropAddr, setDropAddr]       = useState('India');

  const currentStatus = STATUSES[statusIdx];

  // ── Load ride OR demo ─────────────────────────────────────────
  useEffect(() => {
    const isDemo = !id || id.startsWith('demo-');
    if (isDemo) {
      setFareAmt(Math.floor(80 + Math.random() * 200));
      setOtp(Math.floor(1000 + Math.random() * 9000).toString());
      setPickupAddr('Tirupur Bus Stand');
      setDropAddr('Chennai Airport');
      simulateProgress();
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setRideData(data);
        setFareAmt(data.totalPrice);
        setOtp(data.rideMetadata?.otp || '----');
        if (data.pickupDetails?.location) setPickupAddr(data.pickupDetails.location);
        if (data.shippingAddress?.address) setDropAddr(data.shippingAddress.address);
        const local = SERVER_TO_LOCAL[data.status] || 'Searching';
        setStatusIdx(STATUSES.indexOf(local));
        if (data.deliveryPartner) setDriver(data.deliveryPartner);
        if (data.status === 'Completed') setShowPayment(true);
      } catch (err) {
        console.error('Ride Fetch Error:', err);
        toast.error('Could not load ride details');
      }
    })();
  }, [id]);

  // ── Real-time socket ──────────────────────────────────────────
  useEffect(() => {
    if (!id || id.startsWith('demo-')) return;
    const socketUrl = import.meta.env.VITE_API_URL ? 
      import.meta.env.VITE_API_URL.replace('/api', '') : '';
    
    const socket = io(socketUrl, {
      path: '/api/fic-socket/',
      auth: { token: localStorage.getItem('token') }
    });
    socketRef.current = socket;

    socket.on('ride_accepted', (r) => {
      if (r._id !== id) return;
      setStatusIdx(STATUSES.indexOf('Accepted'));
      if (r.rideMetadata) setDriver(r.rideMetadata);
      toast.success('🚗 Driver assigned and on the way!');
    });

    socket.on('ride_status_updated', (r) => {
      if (r._id !== id) return;
      const local = SERVER_TO_LOCAL[r.status];
      if (local) {
        const idx = STATUSES.indexOf(local);
        setStatusIdx(idx);
      }
      if (r.deliveryPartner) setDriver(r.rideMetadata || r.deliveryPartner);
      if (r.status === 'Completed') setTimeout(() => setShowPayment(true), 1000);
    });

    return () => socket.disconnect();
  }, [id]);

  // ── Polling fallback (every 5s) ──────────────────────────────────────────
  useEffect(() => {
    if (!id || id.startsWith('demo-')) return;
    const poll = setInterval(async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        const local = SERVER_TO_LOCAL[data.status] || 'Searching';
        const idx = STATUSES.indexOf(local);
        setStatusIdx(prev => (idx > prev ? idx : prev)); // Only advance forward
        setFareAmt(data.totalPrice);
        setOtp(data.rideMetadata?.otp || '----');
        if (data.rideMetadata?.driverName || data.rideMetadata?.vehicleModel) {
          setDriver(data.rideMetadata);
        } else if (data.deliveryPartner) {
          setDriver(data.deliveryPartner);
        }
        if (data.status === 'Completed' && !paymentDone) {
          setTimeout(() => setShowPayment(true), 1000);
        }
      } catch { /* silent */ }
    }, 5000);
    return () => clearInterval(poll);
  }, [id, paymentDone]);

  const simulateProgress = () => {
    [5000, 13000, 20000, 32000].forEach((ms, i) => {
      setTimeout(() => {
        setStatusIdx(i + 1);
        if (i === 3) setTimeout(() => setShowPayment(true), 1000);
      }, ms);
    });
  };

  // Vehicle position
  useEffect(() => {
    const pts = [{ x:20,y:70 }, { x:35,y:55 }, { x:50,y:40 }, { x:65,y:30 }, { x:80,y:20 }];
    if (pts[statusIdx]) setVehiclePos(pts[statusIdx]);
  }, [statusIdx]);

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handlePayment = async (method) => {
    const isDemo = !id || id.startsWith('demo-');
    if (isDemo) {
      setPaymentProcessing(true);
      setTimeout(() => {
        toast.success(`₹${fareAmt} via ${method} — payment successful!`, { duration: 4000 });
        setPaymentProcessing(false);
        setPaymentDone(true);
        setShowPayment(false);
        setTimeout(() => setShowRating(true), 800);
      }, 2500);
      return;
    }

    try {
      setPaymentProcessing(true);
      
      if (method === 'Cash' || method === 'Cash on Delivery') {
        toast.success(`Please pay ₹${fareAmt} cash to the driver.`);
        setPaymentDone(true);
        setShowPayment(false);
        setTimeout(() => setShowRating(true), 800);
        setPaymentProcessing(false);
        return;
      }

      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      const { data: orderData } = await api.post('/payments/create-order', {
        orderId: id,
        amount: fareAmt,
        type: 'Ride'
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (orderData.keyId === 'test_mode_bypass') {
        console.log('Bypassing Razorpay for Development Testing (Ride)');
        const mockResponse = {
          razorpay_order_id: orderData.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature_for_testing'
        };
        
        setTimeout(async () => {
          try {
            await api.post('/payments/verify', {
              ...mockResponse,
              orderId: id,
              amount: fareAmt,
              type: 'Ride'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            toast.success('Payment verified successfully!');
            setPaymentDone(true);
            setShowPayment(false);
            setTimeout(() => setShowRating(true), 800);
          } catch (err) {
            toast.error('Payment verification failed.');
          }
          setPaymentProcessing(false);
        }, 1500);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Forge India Connect',
        description: 'Ride Service Payment',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: id,
              amount: fareAmt,
              type: 'Ride'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            toast.success('Payment verified successfully!');
            setPaymentDone(true);
            setShowPayment(false);
            setTimeout(() => setShowRating(true), 800);
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: `${userInfo.firstName || 'User'} ${userInfo.lastName || ''}`,
          email: userInfo.email || '',
          contact: userInfo.mobile || ''
        },
        theme: {
          color: '#2563eb'
        }
      };
      
      setPaymentProcessing(false);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentProcessing(false);
      toast.error('Failed to initiate Razorpay transaction.');
    }
  };

  const submitRating = async () => {
    try {
      if (rideData?._id) await api.put(`/rides/${rideData._id}/rate`, { rating: ratingVal, feedback });
      
      // Phase 2: Submit Safety Score
      if (rideData?._id) await api.post(`/rides/${rideData._id}/safety-score`, { score: ratingVal * 20 });
      
      toast.success('Thanks for your feedback!');
    } catch { /* silent */ }
    setShowRating(false);
    navigate('/rides/history');
  };

  const triggerSOS = async () => {
    toast.success("SOS Alert Triggered! Emergency Contacts Notified.");
    try {
      if (rideData?._id) {
        await api.post(`/rides/${rideData._id}/emergency`, {
          eventType: 'Manual SOS',
          location: { lat: vehiclePos.x, lng: vehiclePos.y }
        });
      }
    } catch (err) {
      console.log('Failed to log SOS', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row pt-24">
      <SEOMeta title="Ride Tracking | Forge India Connect" description="Track your ride in real-time." />

      {/* Left Panel */}
      <div className="w-full lg:w-[400px] bg-white dark:bg-dark-card shadow-2xl z-10 flex flex-col overflow-y-auto">

        {/* Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${currentStatus === 'Completed' ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${STATUS_COLORS[currentStatus]}`}>
              {currentStatus === 'Searching' && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse inline-block"/>}
              {STATUS_LABELS[currentStatus]}
            </span>
            <span className="text-[10px] font-black text-slate-400">{fmt(elapsed)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            {currentStatus === 'Completed' ? '🎉 Ride Complete!'
              : currentStatus === 'Searching' ? 'Finding Best Match...'
              : currentStatus === 'Arrived'   ? 'Driver is Here — Share OTP!'
              : 'Your driver is en route'}
          </h1>
        </div>

        {/* Stepper */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          {STATUSES.map((s, i) => {
            const isPast = i < statusIdx, isCurrent = i === statusIdx;
            return (
              <div key={s} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all shrink-0 ${isPast ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'border-blue-600 bg-blue-600 text-white animate-pulse' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                  {isPast ? <Check size={12}/> : i + 1}
                </div>
                <p className={`text-sm font-black flex-1 ${isCurrent ? 'text-blue-600' : isPast ? 'text-green-600' : 'text-slate-400'}`}>
                  {STATUS_LABELS[s]}
                </p>
                {isCurrent && s !== 'Completed' && <Loader2 size={14} className="text-blue-600 animate-spin"/>}
                {isPast && <Check size={14} className="text-green-500"/>}
              </div>
            );
          })}
        </div>

        {/* OTP */}
        {['Arrived','InRide'].includes(currentStatus) && (
          <div className="mx-6 my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Share OTP with Driver</p>
            <div className="flex justify-center gap-2">
              {otp.split('').map((d, i) => (
                <div key={i} className="w-12 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black">{d}</div>
              ))}
            </div>
          </div>
        )}

        {/* Driver Card */}
        {currentStatus !== 'Searching' && (
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-600 uppercase">
                  {driver?.vehicleModel?.[0] || 'D'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"/>
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 dark:text-white text-lg">
                  {driver?.name || 'Your Driver'}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400"/>
                  <span className="text-sm font-black text-slate-500">{driver?.driverRating || '4.8'}</span>
                </div>
              </div>
              {driver?.phone && (
                <a href={`tel:${driver.phone}`} className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all">
                  <Phone size={18}/>
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl">
              <Car size={18} className="text-blue-600"/>
              <div>
                <p className="font-black text-sm text-slate-900 dark:text-white">{driver?.vehicleModel || 'Vehicle'}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{driver?.vehicleNumber || '— Verified —'}</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">Verified</div>
            </div>
            
            {/* Quick Actions (Chat, SOS) */}
            <div className="flex items-center gap-3 mt-4">
               <button 
                 onClick={() => setIsChatOpen(true)}
                 className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
               >
                 <MessageSquare size={16} /> Chat
               </button>
               {isSafetyMode && (
                 <button 
                   onClick={triggerSOS}
                   className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors animate-pulse border border-red-200"
                 >
                   <ShieldAlert size={16} /> SOS
                 </button>
               )}
            </div>
          </div>
        )}

        {/* Fare + pay */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Fare</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">₹{fareAmt}</span>
          </div>
          {currentStatus === 'Completed' && !paymentDone && (
            <button onClick={() => setShowPayment(true)}
              className="w-full py-4 bg-green-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest animate-pulse">
              Pay ₹{fareAmt} Now
            </button>
          )}
          {paymentDone && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 text-center">
              <Check className="text-green-500 mx-auto mb-2" size={24}/>
              <p className="font-black text-green-700 dark:text-green-400 uppercase text-sm">Payment Successful!</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Real Routing Map */}
      <div className="flex-1 relative bg-[#0f172a] overflow-hidden min-h-[300px] lg:min-h-0">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) opacity(0.9)' }}
          src={`https://maps.google.com/maps?saddr=${encodeURIComponent(pickupAddr)}&daddr=${encodeURIComponent(dropAddr)}&output=embed`}
          allowFullScreen
          title="Ride Tracking Map"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-dark-card to-transparent w-24 z-10 pointer-events-none" />

        {/* Floating ETA Details */}
        <div className="absolute top-6 right-6 space-y-3 z-20 pointer-events-none">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white shadow-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 text-blue-400">Time Duration for Arrival</p>
            <span className="font-black text-sm">
              {currentStatus === 'Searching' ? 'Searching...'
               : currentStatus === 'Accepted' ? 'ETA: ~5 mins (Arrival)' 
               : currentStatus === 'Arrived' ? 'Arrived (At Pickup)'
               : currentStatus === 'InRide' ? 'ETA: ~10 mins (Destination)' 
               : currentStatus === 'Completed' ? 'Completed' : 'Calculating...'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y:100 }} animate={{ y:0 }} exit={{ y:100 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 w-full max-w-md">
              {paymentProcessing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="relative">
                     <div className="w-20 h-20 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
                     <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <CreditCard className="text-blue-600 animate-pulse" size={24} />
                     </div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Processing Payment</h3>
                     <p className="text-sm font-bold text-slate-500">Connecting to secure gateway...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Pay for Ride</h3>
                    <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
                  </div>
                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Fare</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white">₹{fareAmt}</p>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => handlePayment('UPI/Online')}
                      className="w-full flex items-center gap-4 p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl group">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><CreditCard size={20}/></div>
                      <div className="text-left flex-1">
                        <p className="font-black text-sm uppercase">Pay Online (UPI/Card)</p>
                        <p className="text-xs opacity-70">Secure — instant confirmation</p>
                      </div>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <button onClick={() => handlePayment('Cash')}
                      className="w-full flex items-center gap-4 p-5 bg-slate-100 dark:bg-dark-bg text-slate-800 dark:text-white rounded-2xl hover:bg-slate-200 transition-all group">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-dark-card rounded-xl flex items-center justify-center"><Banknote size={20}/></div>
                      <div className="text-left flex-1">
                        <p className="font-black text-sm uppercase">Pay Cash to Driver</p>
                        <p className="text-xs text-slate-500">Hand cash directly</p>
                      </div>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[2100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y:100, scale:0.95 }} animate={{ y:0, scale:1 }} exit={{ y:100 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 w-full max-w-md">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">⭐</div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Rate Your Driver</h3>
                <p className="text-sm text-slate-500 mt-1">How was your experience?</p>
              </div>
              <div className="flex justify-center gap-2 mb-6">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRatingVal(n)}>
                    <Star size={36} className={`transition-all ${n <= ratingVal ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-slate-300'}`}/>
                  </button>
                ))}
              </div>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                placeholder="Leave a comment (optional)..."
                className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none resize-none mb-4"
                rows={3}/>
              <button onClick={submitRating}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl">
                Submit Rating & Finish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <InAppChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userRole="customer" 
        receiverName={driver?.name || 'Driver'} 
        receiverPhone={driver?.phone || '+91 9876543210'} 
      />
    </div>
  );
};

export default RideTrackingPage;

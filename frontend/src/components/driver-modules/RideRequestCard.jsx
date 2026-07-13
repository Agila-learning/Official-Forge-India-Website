import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, MapPin, Clock, Car, Bike, User, Phone } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RideStages = ['Searching Driver', 'Driver Assigned', 'Driver Arriving', 'Ride Started', 'Completed'];

const StageProgressBar = ({ currentStatus }) => {
  const idx = RideStages.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 mt-4 mb-6">
      {RideStages.map((stage, i) => (
        <div key={stage} className="flex items-center flex-1">
          <div className={`flex-1 h-1 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          {i < RideStages.length - 1 && null}
        </div>
      ))}
    </div>
  );
};

const RideRequestCard = ({ request, onAccept, onDecline }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [status, setStatus] = useState('pending'); // pending, accepted, declined, accepting
  const [rideStage, setRideStage] = useState('Searching Driver');
  const timerRef = useRef(null);

  useEffect(() => {
    if (status !== 'pending') return;
    if (timeLeft <= 0) {
      handleDecline();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, status]);

  const handleAccept = async () => {
    clearInterval(timerRef.current);
    setStatus('accepting');
    try {
      const rideId = request._id || request.id;
      if (rideId && !String(rideId).startsWith('req_')) {
        await api.put(`/rides/${rideId}/accept`);
        toast.success('Ride accepted! Navigate to pickup.', { duration: 5000 });
      }
      setStatus('accepted');
      setRideStage('Driver Assigned');
      setTimeout(() => onAccept(request), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept ride');
      setStatus('pending');
    }
  };

  const handleDecline = () => {
    clearInterval(timerRef.current);
    setStatus('declined');
    setTimeout(() => onDecline(request), 400);
  };

  const isWarning = timeLeft <= 5;
  const fare = request.fare || request.totalPrice || request.estimatedFare || 150;
  const pickup = request.pickup || request.pickupAddress || request.pickupDetails?.location || 'Pickup Point';
  const drop = request.drop || request.dropAddress || request.shippingAddress?.address || 'Drop Point';
  const vehicleType = request.vehicleType || request.serviceType || 'Car';

  return (
    <AnimatePresence>
      {status !== 'declined' && (
        <motion.div
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[92vw] md:w-[420px] bg-white dark:bg-[#0F1115] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl z-[2000] overflow-hidden"
        >
          {/* Pulse background warning */}
          {isWarning && status === 'pending' && (
            <motion.div
              className="absolute inset-0 bg-red-500/10"
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          {status === 'accepting' && (
            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {status === 'accepted' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-green-500">Mission Accepted!</h3>
              <p className="text-gray-500 text-sm font-bold">Navigate to pickup now.</p>
              <StageProgressBar currentStatus="Driver Assigned" />
            </motion.div>
          ) : (
            <>
              {/* Timer Bar */}
              <div className="relative h-1.5 bg-gray-100 dark:bg-gray-800">
                <motion.div
                  className={`absolute top-0 left-0 h-full rounded-r-full ${isWarning ? 'bg-red-500' : 'bg-blue-500'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 20) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5 w-fit mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      New {vehicleType} Request
                    </span>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">₹{fare}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-lg ${isWarning ? 'border-red-500 text-red-500 animate-pulse' : 'border-blue-500 text-blue-500'}`}>
                    {timeLeft}s
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-3 mb-5 relative">
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-dashed border-l-2 border-dashed border-gray-200 dark:border-gray-700" />
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full z-10 shrink-0 shadow-lg shadow-green-500/30 flex items-center justify-center">
                      <MapPin size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{pickup}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-red-500 rounded-full z-10 shrink-0 shadow-lg shadow-red-500/30 flex items-center justify-center">
                      <MapPin size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Drop-off</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{drop}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={handleDecline} className="flex-1 py-4 bg-gray-100 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <XCircle size={16} /> Skip
                  </button>
                  <button onClick={handleAccept} disabled={status === 'accepting'} className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60">
                    <CheckCircle size={16} /> Accept
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideRequestCard;

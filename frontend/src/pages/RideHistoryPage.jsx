import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Clock, Star, ArrowRight, Loader2, Bike, Download, Plus } from 'lucide-react';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';

const STATUS_COLORS = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  InRide: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Accepted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Searching: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const DEMO_HISTORY = [
  { _id: 'r1', rideType: 'Car', pickupLocation: { address: 'Tirupur Bus Stand' }, dropLocation: { address: 'Chennai Airport' }, estimatedFare: 850, actualFare: 870, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: 'r2', rideType: 'Bike', pickupLocation: { address: 'Coimbatore Railway Station' }, dropLocation: { address: 'Gandhipuram' }, estimatedFare: 65, actualFare: 70, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 'r3', rideType: 'Auto', pickupLocation: { address: 'Home' }, dropLocation: { address: 'Office - Tech Park' }, estimatedFare: 120, status: 'Cancelled', paymentStatus: 'Unpaid', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { _id: 'r4', rideType: 'Car', pickupLocation: { address: 'Hosur Road' }, dropLocation: { address: 'Electronic City' }, estimatedFare: 340, actualFare: 355, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const RideHistoryPage = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/rides/mine', { headers: { Authorization: `Bearer ${token}` } });
        setRides(data.length > 0 ? data : DEMO_HISTORY);
      } catch {
        setRides(DEMO_HISTORY);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const totalSpent = rides.filter(r => r.status === 'Completed').reduce((sum, r) => sum + (r.actualFare || r.estimatedFare || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <SEOMeta title="Ride History | Forge India Connect" description="View your ride booking history." />

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-1">Ride <span className="text-blue-600">History</span></h1>
            <p className="text-slate-500 font-medium">All your past rides in one place.</p>
          </div>
          <button onClick={() => navigate('/rides/book')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all whitespace-nowrap">
            <Plus size={14} /> Book Ride
          </button>
        </div>

        {/* Summary Stats */}
        {!loading && rides.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Rides', value: rides.length },
              { label: 'Completed', value: rides.filter(r => r.status === 'Completed').length },
              { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}` },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-lg text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-black text-blue-600">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : rides.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg">
            <Car size={64} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight mb-4">No Rides Yet</h3>
            <button onClick={() => navigate('/rides/book')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">
              Book Your First Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, i) => {
              const Icon = ride.rideType === 'Bike' || ride.rideType === 'Scooter' ? Bike : Car;
              const fare = ride.actualFare || ride.estimatedFare || 0;
              const date = new Date(ride.createdAt);
              return (
                <motion.div key={ride._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden">
                  <div className="flex items-stretch">
                    {/* Left Color Bar */}
                    <div className={`w-1.5 shrink-0 ${ride.status === 'Completed' ? 'bg-green-500' : ride.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'}`} />

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                            <Icon size={22} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{ride.rideType} Ride</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${STATUS_COLORS[ride.status] || STATUS_COLORS.Searching}`}>
                          {ride.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 line-clamp-1">{ride.pickupLocation?.address || 'Pickup Location'}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-sm rotate-45 mt-1.5 shrink-0" />
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 line-clamp-1">{ride.dropLocation?.address || 'Drop Location'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-black text-slate-900 dark:text-white">₹{fare}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${ride.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {ride.paymentStatus || 'Unpaid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ride.status === 'Completed' && (
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                              <Download size={12} /> Invoice
                            </button>
                          )}
                          <button onClick={() => navigate('/rides/book')} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg">
                            Rebook <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistoryPage;

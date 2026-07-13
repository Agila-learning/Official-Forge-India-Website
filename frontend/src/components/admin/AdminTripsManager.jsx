import React, { useState, useEffect } from 'react';
import { 
  Navigation2, Search, Filter, Download, 
  MapPin, Clock, CheckCircle2, XCircle, 
  IndianRupee, TrendingUp, Users, Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AdminTripsManager = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fake data for fallback/UI showcase
  const mockTrips = [
    { id: 'TRP-9921', customer: 'John Doe', driver: 'Mike Smith', status: 'In-Progress', pickup: 'Cyber City, Gurugram', dropoff: 'Terminal 3, IGI Airport', amount: 850, time: '10:30 AM' },
    { id: 'TRP-9920', customer: 'Sarah Connor', driver: 'T-800', status: 'Completed', pickup: 'Koramangala, BLR', dropoff: 'Indiranagar, BLR', amount: 320, time: '09:15 AM' },
    { id: 'TRP-9919', customer: 'Bruce Wayne', driver: 'Alfred', status: 'Completed', pickup: 'Wayne Manor', dropoff: 'Gotham City', amount: 1500, time: 'Yesterday' },
    { id: 'TRP-9918', customer: 'Peter Parker', driver: 'Tony Stark', status: 'Cancelled', pickup: 'Queens, NY', dropoff: 'Avengers HQ', amount: 0, time: 'Yesterday' },
  ];

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/rides');
      const formatted = data.map(item => {
        const customerName = item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Anonymous';
        const driverName = item.deliveryPartner ? `${item.deliveryPartner.firstName} ${item.deliveryPartner.lastName}` : 'Searching...';
        
        let mappedStatus = item.status;
        if (item.status === 'Searching Driver') mappedStatus = 'Searching';
        else if (item.status === 'Driver Assigned') mappedStatus = 'Accepted';
        else if (item.status === 'Driver Reached Pickup') mappedStatus = 'Arrived';
        else if (item.status === 'Ride Started') mappedStatus = 'In-Progress';
        else if (item.status === 'Completed') mappedStatus = 'Completed';
        else if (item.status === 'Cancelled') mappedStatus = 'Cancelled';

        return {
          id: item._id,
          customer: customerName,
          driver: driverName,
          status: mappedStatus,
          pickup: item.pickupDetails?.location || item.shippingAddress?.address || 'Pickup',
          dropoff: item.shippingAddress?.address || 'Dropoff',
          amount: item.totalPrice || 0,
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.createdAt).toLocaleDateString()
        };
      });
      setTrips(formatted);
    } catch (err) {
      console.error('Failed to fetch real trips, falling back to mock data', err);
      setTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await api.put(`/rides/${tripId}/status`, { status: 'Cancelled', cancellationReason: 'Cancelled by Admin' });
      toast.success('Trip cancelled successfully');
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(t => {
    if (filter !== 'All' && t.status !== filter) return false;
    if (search && !t.customer.toLowerCase().includes(search.toLowerCase()) && !t.driver.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'In-Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><IndianRupee size={64}/></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1">Today's Revenue</p>
          <h3 className="text-4xl font-black mb-2">₹12,840.50</h3>
          <p className="text-xs font-bold text-green-300 flex items-center gap-1"><TrendingUp size={14}/> +14.5% vs yesterday</p>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-dark-card flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active Trips</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
               <Navigation2 size={24} />
             </div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">42</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-dark-card flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Completed (Today)</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
               <CheckCircle2 size={24} />
             </div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">128</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-dark-card flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Cancelled (Today)</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
               <XCircle size={24} />
             </div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">5</h3>
          </div>
        </div>
      </div>

      {/* Live Fleet Map Overview */}
      <div className="glass-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-[#15171A]">
         <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
               <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Live Fleet Heatmap</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time GPS tracking across operational zones</p>
            </div>
            <button className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-colors">
              Expand Map
            </button>
         </div>
         <div className="w-full h-[400px] relative bg-[#F8FAFC] dark:bg-[#0A0A0A]">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.2)' }}
              src="https://maps.google.com/maps?q=India&output=embed"
              allowFullScreen
              title="Admin Fleet Map"
            />
            {/* Overlay Simulated Markers */}
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-xl animate-pulse"></div>
            <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-xl"></div>
            <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-xl animate-pulse"></div>
         </div>
      </div>

      {/* Trips Data Table */}
      <div className="glass-card p-6 sm:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card w-full overflow-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10 w-full">
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Trips Repository</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage and resolve ongoing fleet operations</p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full xl:w-auto">
             <div className="relative flex-1 w-full sm:w-auto">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search trips, customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1D21] outline-none font-bold text-sm text-gray-900 dark:text-white focus:border-primary transition-colors"
                />
             </div>
             <button className="flex-1 sm:flex-none justify-center px-5 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-100 transition-colors shrink-0">
               <Filter size={14} /> Filters
             </button>
             <button className="flex-1 sm:flex-none justify-center px-5 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-blue-700 transition-colors shrink-0">
               <Download size={14} /> Export CSV
             </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar w-full">
          {['All', 'In-Progress', 'Completed', 'Cancelled'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                 filter === f 
                   ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                   : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
               }`}
             >
               {f}
             </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip ID / Time</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer & Driver</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-4">
                     <p className="font-black text-sm text-gray-900 dark:text-white">{trip.id}</p>
                     <p className="text-xs text-gray-500 font-bold">{trip.time}</p>
                  </td>
                  <td className="py-5 px-4">
                     <p className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2"><Users size={12} className="text-blue-500"/> {trip.customer}</p>
                     <p className="text-xs text-gray-500 font-bold flex items-center gap-2 mt-1"><Truck size={12} className="text-orange-500"/> {trip.driver}</p>
                  </td>
                  <td className="py-5 px-4 max-w-[250px]">
                     <div className="flex items-start gap-2">
                        <div className="flex flex-col items-center mt-1">
                           <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                           <div className="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 my-1"></div>
                           <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-bold text-gray-900 dark:text-gray-300 truncate">{trip.pickup}</p>
                           <p className="text-xs font-bold text-gray-900 dark:text-gray-300 mt-2 truncate">{trip.dropoff}</p>
                        </div>
                     </div>
                  </td>
                  <td className="py-5 px-4 font-black text-sm text-gray-900 dark:text-white">
                     {trip.amount > 0 ? `₹${trip.amount}` : '-'}
                  </td>
                  <td className="py-5 px-4">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(trip.status)}`}>
                        {trip.status}
                     </span>
                  </td>
                  <td className="py-5 px-4 text-right space-x-3">
                     {['Searching', 'Accepted', 'Arrived', 'In-Progress'].includes(trip.status) && (
                       <button onClick={() => handleCancelTrip(trip.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                         Cancel
                       </button>
                     )}
                     <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-700 transition-colors">
                       View
                     </button>
                  </td>
                </tr>
              ))}
              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    No trips found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTripsManager;

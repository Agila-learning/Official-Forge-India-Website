import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Truck, MapPin, CheckCircle2, 
  Clock, ShieldCheck, Share2, Info, 
  ArrowLeft, Headset, Download, AlertCircle,
  FileText, Activity, Home, Building
} from 'lucide-react';
import MissionMap from './MissionMap';

const LogisticsTrackingDashboard = ({ order, onBack }) => {
  const meta = order.logisticsMetadata || {
    weight: '450 KG',
    insuranceStatus: 'Active',
    deliveryPriority: 'Express',
    currentHub: 'Tirupur Main Hub',
    inventory: [
      { name: 'Sofa Set', qty: 1 },
      { name: 'Office Desk', qty: 2 },
      { name: 'Packaging Kits', qty: 12 }
    ]
  };

  const steps = [
    { id: 'Order Confirmed', label: 'Booked', date: 'May 16, 09:00 AM', icon: <Package size={18} /> },
    { id: 'Packing Started', label: 'Securing', date: 'May 16, 11:30 AM', icon: <Activity size={18} /> },
    { id: 'Picked Up', label: 'Departed', date: 'May 16, 02:45 PM', icon: <Truck size={18} /> },
    { id: 'In Transit', label: 'En Route', date: 'May 16, 08:20 PM', icon: <Globe size={18} /> },
    { id: 'Reached Hub', label: 'Processing', date: 'May 17, 04:10 AM', icon: <Building size={18} /> },
    { id: 'Out for Delivery', label: 'Approaching', date: 'Expected 10 AM', icon: <Home size={18} /> },
    { id: 'Delivered', label: 'Delivered', date: '---', icon: <CheckCircle2 size={18} /> }
  ];

  const Globe = ({ size }) => <Activity size={size} />; // Fallback

  const currentStatusIndex = steps.findIndex(s => s.id === order.status);
  const activeIndex = currentStatusIndex === -1 ? 3 : currentStatusIndex;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="h-20 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">Shipment <span className="text-primary">Monitor</span></h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {order._id?.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Arrival</p>
              <p className="text-sm font-black uppercase">May 17, 10:00 AM</p>
            </div>
            <div className="h-10 w-px bg-gray-100 dark:bg-gray-800" />
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Priority</p>
              <p className="text-sm font-black text-orange-500 uppercase">{meta.deliveryPriority}</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">Download Invoice</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT SECTION: TRACKING & FEED */}
        <div className="flex-1 flex flex-col border-r border-gray-100 dark:border-gray-800">
          {/* MAP */}
          <div className="h-[400px] lg:h-[500px] relative">
            <MissionMap destination={order.shippingAddress} />
            <div className="absolute top-6 left-6 p-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Velocity</p>
               <h4 className="text-xl font-black">42 <span className="text-[10px] text-primary">KM/H</span></h4>
            </div>
          </div>

          {/* PROGRESS FEED */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-2">Transit Manifest</h3>
            <div className="relative">
              {steps.map((step, idx) => (
                <div key={idx} className={`relative flex items-start gap-8 mb-10 last:mb-0 ${idx > activeIndex ? 'opacity-40 grayscale' : ''}`}>
                  {idx < steps.length - 1 && (
                    <div className={`absolute left-[24px] top-12 w-0.5 h-10 ${idx < activeIndex ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`} />
                  )}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${idx <= activeIndex ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-gray-50 dark:bg-dark-bg text-gray-300'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-lg font-black uppercase tracking-tight ${idx <= activeIndex ? 'text-gray-900 dark:text-white' : 'text-gray-300'}`}>{step.id}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{step.date}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{step.label}</p>
                    {idx === activeIndex && (
                      <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                        <Activity size={16} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Update: Parcel reached {meta.currentHub}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: SHIPMENT DETAILS */}
        <div className="w-full lg:w-[400px] bg-gray-50 dark:bg-dark-bg p-10 overflow-y-auto custom-scrollbar">
          {/* SHIPMENT CARD */}
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h5 className="font-black uppercase tracking-tight">Cargo Specifications</h5>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payload Weight</p>
                  <p className="font-black text-sm">{meta.weight}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Insurance</p>
                  <p className={`font-black text-sm ${meta.insuranceStatus === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{meta.insuranceStatus}</p>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Manifest Inventory</p>
                <div className="space-y-3">
                  {meta.inventory.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-bold py-2 border-b border-gray-50 dark:border-dark-bg last:border-0">
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded-lg text-[9px]">{item.qty} Qty</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DESTINATION CARD */}
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h5 className="font-black uppercase tracking-tight">Target Objective</h5>
            </div>
            <div className="relative pl-8 border-l-2 border-dashed border-gray-100 dark:border-gray-800">
               <div className="mb-8 relative">
                 <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg" />
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Collection Point</p>
                 <p className="text-xs font-black uppercase leading-relaxed">{order.pickupDetails?.location || 'Bengaluru Logistics Hub, Sector 12'}</p>
               </div>
               <div className="relative">
                 <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-lg" />
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Deployment Point</p>
                 <p className="text-xs font-black uppercase leading-relaxed">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
               </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:border-primary transition-all group">
              <Headset className="text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:border-primary transition-all group">
              <Share2 className="text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsTrackingDashboard;

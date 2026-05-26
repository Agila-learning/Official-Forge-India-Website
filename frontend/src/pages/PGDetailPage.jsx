import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Wifi, Car, Shield, Dumbbell, Coffee, Home,
  ChevronLeft, ChevronRight, Check, Calendar, Users, Phone,
  Mail, ArrowRight, Loader2, X, BedDouble, Info, Clock
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const DEMO = {
  _id: 'demo1', name: 'Forge Premium PG - Tirupur North', category: 'PG / Hostel',
  price: 5500, location: 'Tirupur North, Tamil Nadu', rating: 4.8, reviewCount: 124,
  amenities: 'Wifi,Security,Cafeteria,Gym,Parking,Power Backup',
  image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
  description: 'A modern, premium co-living space designed for professionals and students. High-speed Wi-Fi, 24/7 security, daily housekeeping, and all-inclusive rent — electricity, water, and maintenance included.',
  rules: 'No loud music after 10 PM. Visitors allowed until 9 PM. No smoking inside rooms.',
  roomTypes: [
    { type: 'Single Sharing', price: 5500, available: 3 },
    { type: 'Double Sharing', price: 4000, available: 5 },
    { type: 'Triple Sharing', price: 3000, available: 2 },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  ]
};

const PGDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [moveIn, setMoveIn] = useState('');
  const [duration, setDuration] = useState('Monthly');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (id.startsWith('demo')) { setProperty(DEMO); setLoading(false); return; }
        const { data } = await api.get(`/products/${id}`);
        setProperty({ ...data, gallery: [data.image, ...(data.gallery || [])].filter(Boolean) });
      } catch {
        setProperty(DEMO);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedRoom) { toast.error('Please select a room type'); return; }
    setSubmitting(true);
    try {
      const payload = {
        serviceSlug: 'pg',
        serviceName: property.name,
        bookingData: { roomType: selectedRoom.type, moveInDate: moveIn, duration, location: property.location },
        totalPrice: selectedRoom.price,
        name: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : guestName,
        contactNumber: userInfo ? userInfo.mobile : guestPhone,
        paymentMethod: 'Online'
      };
      const token = localStorage.getItem('token');
      await api.post('/bookings', payload, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      toast.success('Booking request submitted! Our team will contact you within 30 mins.', { duration: 5000 });
      setShowBooking(false);
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center"><p>Property not found.</p></div>;

  const gallery = property.gallery?.length ? property.gallery : [property.image || DEMO.image];
  const amenities = (property.amenities || '').split(',').filter(Boolean);
  const roomTypes = property.roomTypes || DEMO.roomTypes;
  const rating = property.rating || 4.8;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 pb-24">
      <SEOMeta title={`${property.name} | FIC Stays`} description={property.description} />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <button onClick={() => navigate('/pg-stays')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black text-[11px] uppercase tracking-widest transition-colors">
          <ChevronLeft size={16} /> All Properties
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Gallery + Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img src={gallery[activeImg]} alt={property.name} className="w-full h-[380px] object-cover" />
              <div className="absolute inset-x-4 bottom-4 flex gap-2 justify-center">
                {gallery.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImg ? 'bg-white scale-125' : 'bg-white/50'}`} />
                ))}
              </div>
              {gallery.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(p => (p - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg(p => (p + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                    className={`w-24 h-16 object-cover rounded-xl cursor-pointer shrink-0 transition-all ${i === activeImg ? 'ring-2 ring-blue-600' : 'opacity-60 hover:opacity-100'}`} />
                ))}
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full">{property.category}</span>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mt-2">{property.name}</h1>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-black text-slate-900 dark:text-white">{rating}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">{property.reviewCount || 124} reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-500">{property.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">About This Stay</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{property.description || DEMO.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(amenities.length ? amenities : ['Wifi', 'Security', 'Parking', 'Gym', 'Cafeteria', 'Power Backup']).map(a => (
                  <div key={a} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight">{a.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Room Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roomTypes.map(room => (
                  <div key={room.type} onClick={() => { setSelectedRoom(room); setShowBooking(true); }}
                    className="p-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group text-center">
                    <BedDouble size={28} className="mx-auto mb-3 text-blue-600" />
                    <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight mb-1">{room.type}</p>
                    <p className="text-2xl font-black text-blue-600">₹{room.price?.toLocaleString()}<span className="text-xs text-slate-400 font-bold">/mo</span></p>
                    <p className="text-[10px] text-green-500 font-black uppercase mt-1">{room.available || 'Few'} Available</p>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Select</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] p-8 border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-3 mb-4">
                <Info size={20} className="text-amber-500" />
                <h2 className="text-lg font-black text-amber-700 dark:text-amber-400 uppercase tracking-tight">House Rules</h2>
              </div>
              <p className="text-amber-700 dark:text-amber-300 font-medium text-sm leading-relaxed">{property.rules || DEMO.rules}</p>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-8">
                <div className="text-center mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                  <p className="text-4xl font-black text-blue-600">₹{(property.price || 5500).toLocaleString()}<span className="text-sm text-slate-400 font-bold">/mo</span></p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-black text-slate-700 dark:text-white">{rating}</span>
                    <span className="text-slate-400 text-xs font-bold">({property.reviewCount || 124} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {roomTypes.map(room => (
                    <button key={room.type} onClick={() => setSelectedRoom(room)}
                      className={`w-full flex justify-between items-center p-4 rounded-2xl border-2 transition-all font-bold text-sm ${selectedRoom?.type === room.type ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-700 dark:text-white hover:border-blue-300'}`}>
                      <span>{room.type}</span>
                      <span className="font-black">₹{room.price?.toLocaleString()}/mo</span>
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowBooking(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                  Book This Property <ArrowRight size={16} />
                </button>

                <div className="mt-6 space-y-3">
                  {['No hidden charges', 'Free cancellation (48hr)', '24/7 Support'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={14} className="text-green-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 w-full max-w-lg shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Confirm Booking</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{property.name}</p>
                </div>
                <button onClick={() => setShowBooking(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
              </div>

              <form onSubmit={handleBook} className="space-y-4">
                {/* Room Selection */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Room Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roomTypes.map(r => (
                      <button type="button" key={r.type} onClick={() => setSelectedRoom(r)}
                        className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all ${selectedRoom?.type === r.type ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-white hover:bg-blue-100'}`}>
                        {r.type.split(' ')[0]}
                        <br />₹{r.price?.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Move-in Date *</label>
                    <input type="date" required value={moveIn} onChange={e => setMoveIn(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Duration *</label>
                    <select value={duration} onChange={e => setDuration(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-blue-500">
                      {['Monthly', '3 Months', '6 Months', '1 Year+'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {!userInfo && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Name *</label>
                      <input required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Full Name"
                        className="w-full p-3 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone Number *</label>
                      <input required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 9XXXXXXXXX" type="tel"
                        className="w-full p-3 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </>
                )}

                {selectedRoom && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedRoom.type}</p>
                        <p className="text-2xl font-black text-blue-600">₹{selectedRoom.price?.toLocaleString()}<span className="text-xs text-slate-400">/mo</span></p>
                      </div>
                      <Check className="text-blue-600" />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-60 hover:bg-blue-700 transition-all">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <><ArrowRight size={18} /> Confirm Booking Request</>}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase">No payment required now · Team will contact you</p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PGDetailPage;

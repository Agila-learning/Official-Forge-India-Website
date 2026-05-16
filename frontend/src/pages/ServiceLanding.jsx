import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, CheckCircle2, Star, Users, 
  ArrowRight, Building2, Zap, Truck, Home, Clock, Shield
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const serviceConfig = {
  'hotels': {
    title: 'Hotel Bookings',
    subtitle: 'Premium Stays Across Tamil Nadu',
    description: 'Discover curated hotels, business stays, and luxury properties. FIC partners with the finest hospitality establishments to offer you the best experience.',
    icon: Building2,
    gradient: 'from-blue-600 to-indigo-700',
    lightBg: 'from-blue-50 to-indigo-50',
    accentColor: 'text-blue-600',
    accentBg: 'bg-blue-600',
    tag: 'STAY',
    features: [
      { icon: <Shield size={20} />, title: 'Verified Properties', desc: 'All hotels are personally inspected and rated' },
      { icon: <Clock size={20} />, title: 'Instant Confirmation', desc: 'Get booking confirmation within minutes' },
      { icon: <Star size={20} />, title: 'Best Price Guarantee', desc: 'No hidden fees, transparent pricing' },
      { icon: <Users size={20} />, title: '24/7 Support', desc: 'Dedicated hospitality concierge team' },
    ],
    fields: [
      { name: 'checkIn', label: 'Check-In Date', type: 'date', required: true },
      { name: 'checkOut', label: 'Check-Out Date', type: 'date', required: true },
      { name: 'guests', label: 'Number of Guests', type: 'number', placeholder: '2', required: true },
      { name: 'city', label: 'City / Location', type: 'text', placeholder: 'Krishnagiri / Vellore / Chennai', required: true },
    ],
    stats: [{ v: '50+', l: 'Partner Hotels' }, { v: '4.8★', l: 'Avg Rating' }, { v: '₹999+', l: 'Starting From' }],
    serviceSlug: 'hotels',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  },
  'pg': {
    title: 'PG & Hostel Rentals',
    subtitle: 'Affordable Long-Stay Options',
    description: 'Find verified PG accommodations and hostels for students and working professionals. Safe, affordable, and conveniently located.',
    icon: Home,
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'from-emerald-50 to-teal-50',
    accentColor: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
    tag: 'RENTAL',
    features: [
      { icon: <Shield size={20} />, title: 'Background Checked', desc: 'All PG owners verified & trusted' },
      { icon: <Clock size={20} />, title: 'Flexible Terms', desc: 'Monthly, quarterly or yearly rentals' },
      { icon: <Star size={20} />, title: 'All Amenities Listed', desc: 'Wi-Fi, meals, laundry and more' },
      { icon: <Users size={20} />, title: 'Student Friendly', desc: 'Special discounts for college students' },
    ],
    fields: [
      { name: 'moveInDate', label: 'Move-In Date', type: 'date', required: true },
      { name: 'duration', label: 'Duration', type: 'select', options: ['1 Month', '3 Months', '6 Months', '1 Year'], required: true },
      { name: 'city', label: 'Preferred Location', type: 'text', placeholder: 'Krishnagiri / Vellore', required: true },
      { name: 'budget', label: 'Monthly Budget (₹)', type: 'text', placeholder: '5000 - 10000', required: false },
    ],
    stats: [{ v: '200+', l: 'PG Listings' }, { v: '₹3K+', l: 'Starting Monthly' }, { v: '2 Cities', l: 'Coverage' }],
    serviceSlug: 'pg-hostels',
    heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  },
  'villas': {
    title: 'Luxury Villa Stays',
    subtitle: 'Exclusive Private Retreats',
    description: 'Book premium villas for family getaways, corporate retreats, or special occasions. Experience luxury living with complete privacy.',
    icon: Building2,
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-600',
    tag: 'LUXURY',
    features: [
      { icon: <Shield size={20} />, title: 'Private Properties', desc: 'Entire villa exclusively for your group' },
      { icon: <Star size={20} />, title: 'Curated Selection', desc: 'Only the finest villas make the cut' },
      { icon: <Users size={20} />, title: 'Event Ready', desc: 'Ideal for parties, weddings & retreats' },
      { icon: <Clock size={20} />, title: 'Caretaker Included', desc: 'Dedicated staff for your stay' },
    ],
    fields: [
      { name: 'checkIn', label: 'Check-In Date', type: 'date', required: true },
      { name: 'checkOut', label: 'Check-Out Date', type: 'date', required: true },
      { name: 'guests', label: 'Number of Guests', type: 'number', placeholder: '10', required: true },
      { name: 'budget', label: 'Budget Range (₹)', type: 'text', placeholder: '20,000 - 50,000 per night', required: false },
    ],
    stats: [{ v: '15+', l: 'Premium Villas' }, { v: '₹15K+', l: 'Per Night' }, { v: '5★', l: 'Experiences' }],
    serviceSlug: 'villas',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  },
  'bike-taxi': {
    title: 'Bike Taxi Service',
    subtitle: 'Fast & Affordable 2-Wheeler Rides',
    description: 'Beat traffic with FIC Bike Taxi. Quick, affordable, and reliable. Our verified riders get you to your destination safely and on time.',
    icon: Zap,
    gradient: 'from-purple-600 to-violet-700',
    lightBg: 'from-purple-50 to-violet-50',
    accentColor: 'text-purple-600',
    accentBg: 'bg-purple-600',
    tag: 'RIDES',
    features: [
      { icon: <Shield size={20} />, title: 'Verified Riders', desc: 'Background-checked, licensed bikers' },
      { icon: <Clock size={20} />, title: 'Arrive in 5 Mins', desc: 'Nearest rider dispatched instantly' },
      { icon: <Star size={20} />, title: 'Helmet Provided', desc: 'Safety first, always' },
      { icon: <MapPin size={20} />, title: 'Live Tracking', desc: 'Real-time GPS tracking' },
    ],
    fields: [
      { name: 'pickup', label: 'Pickup Location', type: 'text', placeholder: 'Enter pickup address', required: true },
      { name: 'drop', label: 'Drop Location', type: 'text', placeholder: 'Enter destination', required: true },
      { name: 'date', label: 'Date & Time (Optional)', type: 'datetime-local', required: false },
    ],
    stats: [{ v: '100+', l: 'Riders' }, { v: '₹30+', l: 'Starting Fare' }, { v: '< 5 Min', l: 'Pickup Time' }],
    serviceSlug: 'bike-taxi',
    heroImage: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800',
  },
  'car-taxi': {
    title: 'Car Taxi Service',
    subtitle: 'Comfortable & Reliable Cab Service',
    description: 'Travel in comfort with FIC Car Taxi. AC cabs, professional drivers, and transparent pricing for city rides, airport transfers, and outstation trips.',
    icon: Zap,
    gradient: 'from-sky-600 to-blue-700',
    lightBg: 'from-sky-50 to-blue-50',
    accentColor: 'text-sky-600',
    accentBg: 'bg-sky-600',
    tag: 'RIDES',
    features: [
      { icon: <Shield size={20} />, title: 'Trained Drivers', desc: 'Professionally trained and verified' },
      { icon: <Star size={20} />, title: 'AC Vehicles', desc: 'Clean, air-conditioned cars' },
      { icon: <Clock size={20} />, title: 'Airport Transfers', desc: 'On-time airport pickup & drop' },
      { icon: <MapPin size={20} />, title: 'Outstation Trips', desc: 'City to city travel at flat rates' },
    ],
    fields: [
      { name: 'pickup', label: 'Pickup Location', type: 'text', placeholder: 'Enter pickup address', required: true },
      { name: 'drop', label: 'Drop Location', type: 'text', placeholder: 'Enter destination', required: true },
      { name: 'tripType', label: 'Trip Type', type: 'select', options: ['City Ride', 'Airport Transfer', 'Outstation', 'Package Tour'], required: true },
      { name: 'date', label: 'Date & Time', type: 'datetime-local', required: false },
    ],
    stats: [{ v: '50+', l: 'Cabs' }, { v: '₹80+', l: 'Starting Fare' }, { v: 'City & Outstation', l: 'Coverage' }],
    serviceSlug: 'car-taxi',
    heroImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  },
  'delivery': {
    title: 'Express Delivery',
    subtitle: 'Fast Parcel & Package Delivery',
    description: 'Send parcels, documents, and packages across the city with same-day delivery. Fast, secure, and trackable.',
    icon: Truck,
    gradient: 'from-rose-500 to-pink-600',
    lightBg: 'from-rose-50 to-pink-50',
    accentColor: 'text-rose-600',
    accentBg: 'bg-rose-600',
    tag: 'DELIVERY',
    features: [
      { icon: <Shield size={20} />, title: 'Insured Parcels', desc: 'All packages fully insured in transit' },
      { icon: <Clock size={20} />, title: 'Same-Day Delivery', desc: 'Order before 2 PM for same-day' },
      { icon: <MapPin size={20} />, title: 'Live GPS Tracking', desc: 'Track your parcel in real-time' },
      { icon: <Star size={20} />, title: 'Proof of Delivery', desc: 'Photo & signature on delivery' },
    ],
    fields: [
      { name: 'pickup', label: 'Pickup Address', type: 'text', placeholder: 'Sender address', required: true },
      { name: 'drop', label: 'Delivery Address', type: 'text', placeholder: 'Recipient address', required: true },
      { name: 'weight', label: 'Package Weight (kg)', type: 'text', placeholder: '0.5', required: false },
      { name: 'notes', label: 'Special Instructions', type: 'text', placeholder: 'Fragile, handle with care...', required: false },
    ],
    stats: [{ v: '500+', l: 'Daily Deliveries' }, { v: '₹50+', l: 'Starting Rate' }, { v: '99%', l: 'On-Time Rate' }],
    serviceSlug: 'express-delivery',
    heroImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?w=800',
  },
};

const ServiceLanding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const config = serviceConfig[slug];
  const [formData, setFormData] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const Icon = config?.icon;

  if (!config) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (userInfo) {
        // Authenticated user -> Create a formal Order
        const payload = {
          orderItems: [{
            name: `${config.title} Booking`,
            qty: 1,
            image: config.heroImage,
            price: 0, // Price to be assigned by admin/provider
            isService: true,
            selectedConfig: formData
          }],
          shippingAddress: {
            address: formData.pickup || formData.city || 'TBD',
            city: formData.city || formData.drop || 'TBD',
            postalCode: '000000',
            country: 'India'
          },
          paymentMethod: 'Pay on Delivery',
          totalPrice: 0,
          instructions: Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join(' | '),
          fulfillmentType: config.serviceSlug === 'hotels' || config.serviceSlug === 'villas' || config.serviceSlug === 'pg-hostels' ? 'Digital Fulfillment' : 'Technician Visit'
        };
        const { data } = await api.post('/orders', payload, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        toast.success(`Booking Confirmed! Order ID: ${data._id.slice(-6)}`, { duration: 5000 });
        navigate(`/track-mission/${data._id}`);
      } else {
        // Guest user -> Save as lead
        const payload = {
          serviceSlug: config.serviceSlug,
          serviceName: config.title,
          name: name,
          email: email,
          phone: phone,
          message: Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join(' | '),
          ...formData,
        };
        await api.post('/service-registrations', payload);
        setSubmitted(true);
        toast.success('Request submitted! We will contact you shortly.', { duration: 5000 });
      }
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pt-24 pb-20">
      <SEOMeta 
        title={`${config.title} | Forge India Connect`}
        description={config.description}
      />

      {/* Hero */}
      <div className={`bg-gradient-to-br ${config.gradient} text-white py-20 px-4`}>
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {config.tag} · FIC Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
              {config.title}
            </h1>
            <p className="text-xl text-white/80 font-bold mb-2">{config.subtitle}</p>
            <p className="text-white/60 text-sm max-w-lg leading-relaxed mb-8">{config.description}</p>
            <div className="flex gap-8">
              {config.stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-black">{s.v}</p>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-auto">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-white/20 rounded-[3rem] flex items-center justify-center mx-auto">
              <Icon size={80} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={`bg-gradient-to-br ${config.lightBg} dark:bg-dark-card py-16 px-4`}>
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl font-black text-center mb-10 uppercase tracking-tighter text-gray-900 dark:text-white">
            Why Choose FIC {config.title}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-dark-bg p-6 rounded-[2rem] shadow-md border border-gray-100 dark:border-gray-800"
              >
                <div className={`w-12 h-12 ${config.accentBg}/10 ${config.accentColor} rounded-2xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2 uppercase tracking-tighter text-gray-900 dark:text-white">
            Book Now
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10 font-bold uppercase tracking-widest">
            Fill the form below — our team will confirm within 30 mins
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-12 bg-green-50 dark:bg-green-900/20 rounded-[2rem] border border-green-200 dark:border-green-800"
            >
              <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-green-700 dark:text-green-400 uppercase mb-2">Request Received!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Our team will call you within 30 minutes to confirm your booking.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({}); setName(''); setPhone(''); setEmail(''); }}
                className={`px-8 py-3 ${config.accentBg} text-white rounded-2xl font-black text-sm uppercase`}
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 space-y-5">
              {/* Contact fields for guests */}
              {!userInfo && (
                <>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Your Name *</label>
                    <input
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                      <input
                        type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+91 9XXXXXXXXX"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                      <input
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific fields */}
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all text-sm font-medium"
                    >
                      <option value="">Select...</option>
                      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all text-sm font-medium"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-5 ${config.accentBg} text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-60`}
              >
                {submitting ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <><ArrowRight size={18} /> Confirm Booking Request</>
                )}
              </button>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                No payment required now · Our team will contact you
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceLanding;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, CheckCircle2, Star, Users, 
  ArrowRight, Building2, Zap, Truck, Home, Clock, Shield, Loader2, User, ShieldCheck
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
    serviceType: 'Bike Taxi',
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
    bgImage: '/images/rides_bg.png'
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
    serviceType: 'Car Taxi',
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
    bgImage: '/images/rides_bg.png'
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
    serviceType: 'Express Delivery',
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
    bgImage: '/images/delivery_bg.png'
  },
  'pg': {
    title: 'Modern PG Stays',
    subtitle: 'Premium Co-living Spaces',
    description: 'Experience world-class co-living with FIC Modern PG. Fully furnished rooms, premium amenities, high-speed Wi-Fi, and 3-tier security for a comfortable stay.',
    icon: Home,
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-600',
    tag: 'STAYS',
    serviceType: 'Rental',
    features: [
      { icon: <Shield size={20} />, title: '3-Tier Security', desc: 'Biometric access & 24/7 CCTV' },
      { icon: <Zap size={20} />, title: 'High-Speed Wi-Fi', desc: 'Dedicated 100 Mbps fiber line' },
      { icon: <Star size={20} />, title: 'Daily Cleaning', desc: 'Professional housekeeping included' },
      { icon: <Clock size={20} />, title: 'All-Inclusive', desc: 'Electricity, water & maintenance' },
    ],
    fields: [
      { name: 'preferred_location', label: 'Preferred Area', type: 'text', placeholder: 'e.g. Tirupur North', required: true },
      { name: 'room_type', label: 'Room Preference', type: 'select', options: ['Single Room', 'Double Sharing', 'Triple Sharing', 'Luxury Suite'], required: true },
      { name: 'occupancy_date', label: 'Expected Move-in', type: 'date', required: true },
      { name: 'duration', label: 'Stay Duration', type: 'select', options: ['Monthly', '3 Months', '6 Months', 'Long Term (1 Year+)'], required: true },
    ],
    stats: [{ v: '10+', l: 'Properties' }, { v: '₹5,500+', l: 'Starting Rent' }, { v: '4.9', l: 'Avg Rating' }],
    serviceSlug: 'pg',
    heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
  },
  'villas': {
    title: 'Luxury Villas',
    subtitle: 'Exclusive Independent Homes',
    description: 'Rent premium luxury villas with private amenities, spacious living areas, and serene surroundings. Perfect for families and executives.',
    icon: Home,
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'from-emerald-50 to-teal-50',
    accentColor: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
    tag: 'STAYS',
    serviceType: 'Rental',
    features: [
      { icon: <Shield size={20} />, title: 'Gated Community', desc: 'Secure environments' },
      { icon: <Star size={20} />, title: 'Premium Amenities', desc: 'Pool, Gym & Club House' },
      { icon: <MapPin size={20} />, title: 'Prime Locations', desc: 'Connectivity & Convenience' },
      { icon: <Home size={20} />, title: 'Spacious Interiors', desc: 'Modern architecture' },
    ],
    fields: [
      { name: 'preferred_location', label: 'Preferred Area', type: 'text', placeholder: 'e.g. Hosur', required: true },
      { name: 'bhk', label: 'BHK Preference', type: 'select', options: ['2 BHK', '3 BHK', '4+ BHK', 'Independent Villa'], required: true },
      { name: 'occupancy_date', label: 'Expected Move-in', type: 'date', required: true },
    ],
    stats: [{ v: '50+', l: 'Villas' }, { v: '₹45,000+', l: 'Starting Rent' }, { v: 'Premium', l: 'Quality' }],
    serviceSlug: 'villas',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
  },
  'hotels': {
    title: 'Business Hotels',
    subtitle: 'Comfortable Corporate Stays',
    description: 'Book premium and budget business hotels with world-class hospitality, high-speed internet, and corporate facilities across India.',
    icon: Building2,
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'from-blue-50 to-indigo-50',
    accentColor: 'text-blue-600',
    accentBg: 'bg-blue-600',
    tag: 'STAYS',
    serviceType: 'Rental',
    features: [
      { icon: <Shield size={20} />, title: 'Verified Properties', desc: 'Strict quality checks' },
      { icon: <Zap size={20} />, title: 'Instant Booking', desc: 'No waiting time' },
      { icon: <Star size={20} />, title: 'Corporate Rates', desc: 'Exclusive pricing' },
      { icon: <Clock size={20} />, title: '24/7 Service', desc: 'Round-the-clock support' },
    ],
    fields: [
      { name: 'destination', label: 'Destination City', type: 'text', placeholder: 'e.g. Chennai', required: true },
      { name: 'check_in', label: 'Check-In Date', type: 'date', required: true },
      { name: 'check_out', label: 'Check-Out Date', type: 'date', required: true },
      { name: 'guests', label: 'Number of Guests', type: 'text', placeholder: 'e.g. 2 Adults', required: true },
    ],
    stats: [{ v: '500+', l: 'Hotels' }, { v: '₹2,500+', l: 'Starting Price' }, { v: 'Pan India', l: 'Presence' }],
    serviceSlug: 'hotels',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
  },
  'cleaning': {
    title: 'Home Cleaning Services',
    subtitle: 'Deep Cleaning & Sanitization',
    description: 'Professional deep cleaning services for your home. Trained experts, eco-friendly products, and a spotless guarantee.',
    icon: Zap,
    gradient: 'from-cyan-500 to-blue-600',
    lightBg: 'from-cyan-50 to-blue-50',
    accentColor: 'text-cyan-600',
    accentBg: 'bg-cyan-600',
    tag: 'SERVICES',
    serviceType: 'Home Service',
    features: [
      { icon: <Shield size={20} />, title: 'Verified Experts', desc: 'Background checked professionals' },
      { icon: <Star size={20} />, title: 'Eco-Friendly', desc: 'Safe cleaning products' },
      { icon: <Clock size={20} />, title: 'On-Time', desc: 'Punctual service delivery' },
    ],
    fields: [
      { name: 'property_type', label: 'Property Type', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', 'Villa / Independent'], required: true },
      { name: 'service_date', label: 'Service Date', type: 'date', required: true },
      { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true },
    ],
    stats: [{ v: '10k+', l: 'Cleaned' }, { v: '₹999+', l: 'Starting' }, { v: '4.8', l: 'Rating' }],
    serviceSlug: 'cleaning',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    bgImage: '/images/rides_bg.png'
  },
  'plumbing': {
    title: 'Plumbing Services',
    subtitle: 'Expert Repairs & Installations',
    description: 'Get reliable plumbing services for leaks, installations, and repairs. Fast response and quality workmanship guaranteed.',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'from-blue-50 to-indigo-50',
    accentColor: 'text-blue-600',
    accentBg: 'bg-blue-600',
    tag: 'SERVICES',
    serviceType: 'Home Service',
    features: [
      { icon: <Shield size={20} />, title: 'Certified Plumbers', desc: 'Experienced and trained' },
      { icon: <Star size={20} />, title: 'Quality Parts', desc: 'Genuine spare parts used' },
      { icon: <Clock size={20} />, title: 'Quick Fix', desc: 'Same-day resolution' },
    ],
    fields: [
      { name: 'issue_type', label: 'Issue Type', type: 'select', options: ['Leakage', 'Installation', 'Blockage', 'Other'], required: true },
      { name: 'service_date', label: 'Service Date', type: 'date', required: true },
      { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true },
    ],
    stats: [{ v: '5k+', l: 'Fixed' }, { v: '₹299+', l: 'Visit Fee' }, { v: '1 Hr', l: 'Response' }],
    serviceSlug: 'plumbing',
    heroImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
    bgImage: '/images/rides_bg.png'
  },
  'carpentry': {
    title: 'Carpentry Services',
    subtitle: 'Custom Furniture & Repairs',
    description: 'Skilled carpenters for furniture assembly, repair, and custom woodwork. Quality craftsmanship for your home.',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-600',
    tag: 'SERVICES',
    serviceType: 'Home Service',
    features: [
      { icon: <Shield size={20} />, title: 'Skilled Craftsmen', desc: 'Expert woodwork' },
      { icon: <Star size={20} />, title: 'Custom Designs', desc: 'Built to your needs' },
      { icon: <Clock size={20} />, title: 'Timely Delivery', desc: 'Project completed on schedule' },
    ],
    fields: [
      { name: 'service_type', label: 'Service Needed', type: 'select', options: ['Repair', 'Assembly', 'Custom Woodwork', 'Other'], required: true },
      { name: 'service_date', label: 'Preferred Date', type: 'date', required: true },
      { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true },
    ],
    stats: [{ v: '2k+', l: 'Projects' }, { v: '₹499+', l: 'Visit Fee' }, { v: 'Premium', l: 'Woodwork' }],
    serviceSlug: 'carpentry',
    heroImage: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800',
    bgImage: '/images/rides_bg.png'
  }
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
          serviceSlug: slug,
          serviceName: config.title,
          serviceType: config.serviceType || 'General',
          name: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : name,
          email: userInfo ? userInfo.email : email,
          phone: userInfo ? userInfo.mobile : phone,
          ...formData, // Flatten the form fields for backend compatibility
          message: formData.message || formData.notes || `Booking for ${config.title}`
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

  if (config.tag === 'DELIVERY') {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-20 overflow-hidden flex flex-col lg:flex-row">
        <SEOMeta 
          title={`${config.title} | Forge India Connect`}
          description={config.description}
        />

        {/* Sidebar Form (Image 2 style) */}
        <div className="w-full lg:w-[450px] bg-white dark:bg-dark-card z-20 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-8 md:p-10 flex-grow">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                Get a <span className="text-primary">{config.title.split(' ')[0]}</span>
              </h1>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Premium Mobility Protocol</p>
            </motion.div>

            {submitted ? (
              <div className="text-center py-20">
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-4">Request Sent!</h3>
                <p className="text-slate-500 font-medium mb-8">Dispatched to command center. A partner will contact you shortly.</p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({}); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
                >
                  New Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!userInfo && (
                   <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" required placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-dark-bg border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-primary/20"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-dark-bg border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-primary/20"
                        />
                      </div>
                   </div>
                )}

                {config.fields.map(field => (
                  <div key={field.name} className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      {field.name.includes('pickup') ? <MapPin size={18} /> : field.name.includes('drop') ? <div className="w-2 h-2 bg-slate-900 dark:bg-white rounded-full mx-auto" /> : <Clock size={18} />}
                    </div>
                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                        className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-dark-bg border-none rounded-2xl font-bold text-sm appearance-none outline-none focus:ring-2 ring-primary/20"
                      >
                        <option value="">{field.label}</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.label}
                        value={formData[field.name] || ''}
                        onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-dark-bg border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-primary/20"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                    <p className="text-[11px] font-black uppercase">Now</p>
                  </div>
                  <div className="flex-1 p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Passenge</p>
                    <p className="text-[11px] font-black uppercase">For Me</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Search Request'}
                </button>
              </form>
            )}
          </div>
          
          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-tight">Insured & Verified</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Safe travels with Forge India Connect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Area (Image 2 style) */}
        <div className="flex-1 relative bg-slate-200 overflow-hidden">
          {/* Stylized Google Map Placeholder with the generated background as overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110" 
            style={{ backgroundImage: `url(${config.bgImage || config.heroImage})` }} 
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          
          {/* Interactive Map Mockup */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124440.30154085465!2d80.1411326!3d13.0475255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d333f%3A0x6d394a6544957e!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1715878000000!5m2!1sen!2sin" 
            className="w-full h-full relative z-10 grayscale invert opacity-60"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>

          {/* Floating UI Elements */}
          <div className="absolute top-8 right-8 z-20 flex flex-col gap-4">
            <div className="glass-premium p-4 rounded-3xl text-white">
              <p className="text-[9px] font-black uppercase tracking-widest mb-1">Nearest Partner</p>
              <div className="flex items-center gap-3">
                <Zap size={14} className="text-primary animate-pulse" />
                <span className="font-black">2.4 KM · 4 MIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

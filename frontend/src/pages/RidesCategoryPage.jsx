import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, Calendar, Building2, Package, Clock, Bike, 
  ArrowRight, ShieldCheck, MapPin, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/ui/SEOMeta';

const rideCategories = [
  {
    id: 'ride',
    title: 'Ride',
    desc: 'Go anywhere with Forge India Connect. Request a ride, hop in, and go.',
    icon: Car,
    path: '/services/landing/car-taxi',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', // Premium White Car
  },
  {
    id: 'reserve',
    title: 'Reserve',
    desc: 'Reserve your ride in advance so you can relax on the day of your trip.',
    icon: Calendar,
    path: '/services/landing/car-taxi',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800', // Calendar representation
  },
  {
    id: 'intercity',
    title: 'Intercity',
    desc: 'Get convenient, affordable outstation cabs anytime at your door.',
    icon: Building2,
    path: '/services/landing/car-taxi',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', // Road trip
  },
  {
    id: 'parcel',
    title: 'Parcel',
    desc: 'Forge India Connect makes same-day item delivery easier than ever.',
    icon: Package,
    path: '/services/landing/delivery',
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?w=800', // Delivery box
  },
  {
    id: 'rentals',
    title: 'Rentals',
    desc: 'Request a trip for a block of time and make multiple stops with ease.',
    icon: Clock,
    path: '/services/landing/car-taxi',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', // Luxury car steering
  },
  {
    id: 'bike',
    title: 'Bike',
    desc: 'Get affordable motorbike rides in minutes at your doorstep.',
    icon: Bike,
    path: '/services/landing/bike-taxi',
    image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800', // Modern bike
  }
];

const RidesCategoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <SEOMeta 
        title="Forge India Connect Rides | Smart Mobility Solutions"
        description="Smart, reliable, and affordable mobility solutions, built for India. Book rides, parcels, and intercity cabs with FIC."
      />

      {/* Header Section */}
      <section className="px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Forge India Connect <span className="text-primary">Rides</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-gray-400 font-medium">
            Smart, reliable, and affordable mobility solutions, built for India.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rideCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group cursor-pointer"
              onClick={() => navigate(cat.path)}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <cat.icon size={28} />
                  </div>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 -mr-12 -mt-12 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                  
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-primary transition-all shadow-lg">
                    Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="px-6 mt-20">
        <div className="max-w-7xl mx-auto bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your safety is our priority</h4>
              <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">All rides are insured. Drivers are verified. 24/7 support across India.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">In Collaboration with</p>
                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">FORGE INDIA <span className="text-primary">CONNECT</span></p>
             </div>
             <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black text-2xl">F</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RidesCategoryPage;

import React from 'react';
import { Settings, ShoppingBag, Car, Home, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FICServiceEcosystem = () => {
  const services = [
    { name: 'Service Booking', desc: 'Book verified home and business services', icon: <Settings size={32} />, path: '/services', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop' },
    { name: 'Product Ordering', desc: 'Shop from local businesses and vendors', icon: <ShoppingBag size={32} />, path: '/explore-shop', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Ride Booking', desc: 'Book cabs, autos, and rental vehicles', icon: <Car size={32} />, path: '/services/rides', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Stay Booking', desc: 'Find PGs, hotels, and rentals', icon: <Home size={32} />, path: '/pg-stays', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <section className="py-24 px-6 bg-white relative z-10 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">More From <span className="text-primary">Forge India Connect</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">FIC also provides access to digital services beyond its core IT and career offerings through our integrated digital service ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((svc, i) => (
            <Link to={svc.path} key={i} className="bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all group overflow-hidden flex flex-col">
              <div className="w-full h-48 overflow-hidden relative">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex-1 flex flex-col relative z-10 -mt-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-lg mb-6 group-hover:scale-110 group-hover:text-primary transition-all">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{svc.name}</h3>
                <p className="text-sm font-medium text-slate-500">{svc.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors">
            Explore All Services <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FICServiceEcosystem;

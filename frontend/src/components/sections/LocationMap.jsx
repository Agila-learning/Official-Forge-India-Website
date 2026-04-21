import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone } from 'lucide-react';

const LocationMap = () => {
  return (
    <section className="py-24 bg-white dark:bg-dark-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-dark-card rounded-[4rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col lg:flex-row shadow-primary/5">
          {/* Info Side */}
          <div className="lg:w-1/3 p-12 md:p-16 flex flex-col justify-center bg-primary text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="relative z-10"
             >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                    <MapPin size={32} />
                </div>
                <h2 className="text-4xl font-black mb-6 tracking-tight">Visit Our <br/><span className="text-secondary italic">Headquarters</span></h2>
                <div className="space-y-6 text-lg font-medium opacity-90">
                    <p className="flex items-start gap-4">
                        <Navigation className="shrink-0 mt-1" size={20} />
                        G6G2+RW Krishnagiri,<br/>Tamil Nadu, India
                    </p>
                    <p className="flex items-center gap-4">
                        <Phone size={20} />
                        +91 6369406416
                    </p>
                </div>
                
                <a 
                    href="https://www.google.com/maps/search/G6G2%2BRW+Krishnagiri,+Tamil+Nadu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-black rounded-full hover:bg-secondary hover:text-dark-bg transition-all shadow-xl"
                >
                    Get Directions
                </a>
             </motion.div>
          </div>

          {/* Map Side */}
          <div className="lg:w-2/3 h-[500px] lg:h-auto relative">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15582.493836791557!2d78.2044!3d12.5275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac4979e2c7104d%3A0x6a1b2b3c4d5e6f7a!2sKrishnagiri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1711456789012!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale dark:invert dark:brightness-90 contrast-125"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;

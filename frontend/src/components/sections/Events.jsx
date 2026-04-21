import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../../services/api';

const Events = () => {
  const [filter, setFilter] = useState('Upcoming');
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        // Add default 'Upcoming' type if not provided by backend
        const formatted = data.map(e => ({ ...e, id: e._id, type: e.type || 'Upcoming' }));
        setEventsList(formatted);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = eventsList.filter(e => e.type === filter);

  return (
    <section className="py-12 bg-gray-50 dark:bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Discover <span className="text-primary">Events</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Join exclusive networking sessions and curated summits.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex bg-white dark:bg-dark-card p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 w-max"
          >
            {['Upcoming', 'Past'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${filter === type ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {type}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pb-12"
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="events-swiper py-8 px-4 -mx-4"
          >
            {filteredEvents.map((event) => (
              <SwiperSlide key={event.id} className="h-auto">
                <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:shadow-primary/10 transition-all duration-300">
                  <div className="h-56 overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="bg-secondary text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="space-y-3 mb-8 mt-auto">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
                        <Calendar size={18} className="mr-3 text-secondary" /> {event.date}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
                        <MapPin size={18} className="mr-3 text-primary" /> {event.location}
                      </div>
                    </div>
                    {event.title.toLowerCase().includes('innovathon') ? (
                       <a href="https://innovathonevent.antigraviity.in/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full py-4 px-6 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all group-hover:gap-2">
                          Register for Event
                          <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                       </a>
                    ) : (
                      <Link to="/register" className="flex items-center justify-between w-full py-4 px-6 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all group-hover:gap-2">
                         {filter === 'Upcoming' ? 'Register Now' : 'View Highlights'}
                         <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
      
      {/* Custom Styles for Swiper inside React without breaking Tailwind scope */}
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-button-next, .swiper-button-prev { color: #0A66C2 !important; }
        .swiper-pagination-bullet-active { background: #0A66C2 !important; }
      `}} />
    </section>
  );
};

export default Events;

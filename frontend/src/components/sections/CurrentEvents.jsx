import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Calendar, MapPin } from 'lucide-react';

const CurrentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        // Optionally sort by date or just display all. Let's show top 3 latest
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-slate-50 relative overflow-hidden border-y border-slate-100">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4"
          >
            What's Happening Now
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4"
          >
            Current <span className="text-emerald-500">Events & Trends</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Don't miss out on our upcoming summer internships, industrial visits, and corporate events. Explore the latest opportunities posted by our admins.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div 
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              {event.image ? (
                <div className="h-48 overflow-hidden relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {event.type || 'Event'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-32 shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                   <div className="absolute bottom-4 left-4">
                     <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm border border-white/20">
                       {event.type || 'Event'}
                     </span>
                   </div>
                </div>
              )}
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight">{event.title}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1">{event.description}</p>
                
                <div className="space-y-3 mb-8 shrink-0">
                  {event.date && (
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar size={14} />
                      </div>
                      {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <MapPin size={14} />
                      </div>
                      {event.location}
                    </div>
                  )}
                </div>
                
                <a href="/contact" className="w-full block text-center py-3.5 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all group-hover:bg-emerald-500 group-hover:text-white border border-slate-200 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20 shrink-0">
                  Enquire Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentEvents;

import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewCard = ({ name, location, delay = 0, review, rating, image }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
            viewport={{ once: true }}
            className="p-10 bg-white dark:bg-dark-card rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-2xl hover:shadow-4xl transition-all group overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
                    <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={name} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-gray-900 dark:text-white leading-none italic uppercase tracking-tighter">
                            {name}
                        </h4>
                        <CheckCircle size={14} className="text-secondary" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mt-2">
                        <MapPin size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{location}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= rating ? 'fill-secondary text-secondary' : 'text-gray-200'} />
                ))}
            </div>

            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic line-clamp-3">
                "{review}"
            </p>
            
            <div className="mt-8 flex justify-between items-center pt-8 border-t border-gray-50 dark:border-gray-800">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Verified Booking</span>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white dark:border-dark-card" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;

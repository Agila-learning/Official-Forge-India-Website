import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, PlayCircle } from 'lucide-react';
import CTA from '../components/sections/CTA';

// Swiper imports for advanced carousel UI
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const DOMAINS = ['All', 'IT', 'Banking', 'Non-IT', 'Manufacturing', 'Automobile'];

const Testimonials = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await api.get('/candidates');
                setCandidates(res.data);
            } catch (err) {
                console.error("Failed to fetch candidates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const filtered = activeFilter === 'All'
        ? candidates
        : candidates.filter(c => c.domain === activeFilter);

    return (
        <div className="pt-32 bg-white dark:bg-dark-bg min-h-screen">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 overflow-hidden py-10">
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
                    >
                        Success <span className="animated-text-gradient">Stories</span>
                    </motion.h1>
                    <p className="text-xl md:text-3xl text-gray-500 font-medium max-w-4xl mx-auto leading-relaxed">
                        Real candidates. Real placements. Witness the impact of our elite business network across India.
                    </p>
                </div>

                {/* Domain Filter Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {DOMAINS.map(domain => (
                        <button
                            key={domain}
                            onClick={() => setActiveFilter(domain)}
                            className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 border ${
                                activeFilter === domain
                                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105'
                                    : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:text-primary'
                            }`}
                        >
                            {domain}
                        </button>
                    ))}
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800"
                    >
                        <p className="text-gray-500 font-bold text-lg">
                            {candidates.length === 0
                                ? 'New success stories are being updated. Check back soon!'
                                : `No stories in the "${activeFilter}" domain yet.`}
                        </p>
                        {candidates.length > 0 && (
                            <button onClick={() => setActiveFilter('All')} className="mt-4 text-primary font-bold text-sm hover:underline">
                                View all stories
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                    slideShadows: false,
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1, spaceBetween: 20 },
                                    768: { slidesPerView: 2, spaceBetween: 30 },
                                    1024: { slidesPerView: 3, spaceBetween: 40 }
                                }}
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                modules={[EffectCoverflow, Pagination, Autoplay]}
                                className="w-full pb-20"
                            >
                                {filtered.map((candidate, idx) => (
                                    <SwiperSlide key={candidate._id || idx} className="max-w-md">
                                        <div className="bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none h-full transform transition-all duration-500">
                                            <div className="relative mb-10">
                                                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative z-10">
                                                    <img 
                                                        src={candidate.image} 
                                                        alt={candidate.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <Quote className="absolute -top-4 -left-4 text-primary opacity-20" size={60} />
                                                <div className="absolute top-4 left-16 bg-secondary text-dark-bg text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter z-20">
                                                    Placed in {candidate.domain}
                                                </div>
                                            </div>

                                            <p className="text-lg text-gray-600 dark:text-gray-300 font-bold italic mb-8 leading-relaxed line-clamp-4">
                                                "{candidate.text}"
                                            </p>

                                            <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex items-center justify-between mt-auto">
                                                <div className="overflow-hidden">
                                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white capitalize truncate">{candidate.name}</h3>
                                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest truncate">{candidate.domain} Professional</p>
                                                </div>
                                                {candidate.videoUrl && (
                                                    <a 
                                                        href={candidate.videoUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg shrink-0"
                                                    >
                                                        <PlayCircle size={28} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </AnimatePresence>
                )}
            </section>
            <CTA />
        </div>
    );
};

export default Testimonials;

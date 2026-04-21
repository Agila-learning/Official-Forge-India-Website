import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Quote, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsRes, testimonialsRes] = await Promise.all([
                    api.get('/reviews/public').catch(() => ({ data: [] })),
                    api.get('/testimonials').catch(() => ({ data: [] }))
                ]);
                
                // Merge reviews and admin testimonials, prioritize featured testimonials
                const combined = [
                    ...(testimonialsRes.data || []),
                    ...(reviewsRes.data || [])
                ];
                setReviews(combined);
            } catch (err) {
                console.error('Failed to load testimonials');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mockFallbacks = [
        { name: "Ravi Sharma", comment: "Forge India Connect helped me transition from a local developer to a lead role in a top-tier MNC.", rating: 5, user: { role: 'Candidate' } },
        { name: "Priya Patel", comment: "The guidance I received for my banking certification and placement was beyond my expectations.", rating: 5, user: { role: 'Candidate' } },
        { name: "Amit Desai", comment: "As a production engineer, finding the right industry connections was hard until I joined FIC.", rating: 4, user: { role: 'Candidate' } }
    ];

    const displayReviews = reviews.length > 0 ? reviews : mockFallbacks;

    return (
        <section id="testimonials" className="py-12 bg-[#020617] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-20"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 font-bold text-[10px] uppercase tracking-widest text-primary">
                        <MessageSquare size={14} /> Community Voice
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                        VERIFIED <span className="text-primary italic">TESTIMONIALS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayReviews.map((rev, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="bg-white rounded-[3rem] p-12 flex flex-col justify-between hover:shadow-[0_40px_80px_rgba(59,130,246,0.15)] transition-all group relative overflow-hidden h-full shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={i < (rev.rating || 5) ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-200"} />
                                    ))}
                                </div>
                                <Quote className="text-primary/10 mb-8" size={56} />
                                <p className="text-xl font-bold text-gray-800 mb-10 leading-relaxed italic relative z-10">
                                    "{rev.content || rev.comment}"
                                </p>
                            </div>

                            <div className="flex items-center gap-5 pt-8 border-t border-gray-100 mt-auto">
                                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">
                                    {rev.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 flex items-center gap-2">
                                        {rev.name}
                                        <CheckCircle2 size={16} className="text-blue-500" />
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                                        {rev.role || rev.user?.role || 'Verified Member'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

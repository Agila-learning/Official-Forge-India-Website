import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const TestimonialCard = ({ rev, idx }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
        className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative group h-full"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"} />
            ))}
        </div>

        <div className="relative mb-8">
            <Quote className="text-primary/10 absolute -top-4 -left-4" size={64} />
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic relative z-10">
                "{rev.content || rev.comment}"
            </p>
        </div>

        <div className="flex items-center gap-4 pt-8 border-t border-slate-50 dark:border-slate-800 mt-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 shrink-0">
                {rev.name?.charAt(0)}
            </div>
            <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    {rev.name}
                    <CheckCircle2 size={14} className="text-blue-500" />
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                    {rev.role || rev.user?.role || 'Verified Member'}
                </p>
            </div>
        </div>
    </motion.div>
);

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
                const tData = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : [];
                const rData = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
                const combined = [...tData, ...rData];
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
        { name: "Ravi Kumar", comment: "FIC's job consulting changed my career. I secured a lead position at a top-tier tech firm in Chennai within 3 weeks.", rating: 5, role: 'Software Lead' },
        { name: "Deepa S.", comment: "The home service professionals from FIC are punctual and highly skilled. Best platform in Krishnagiri.", rating: 5, role: 'Premium Member' },
        { name: "Arjun Reddy", comment: "As a vendor, my reach expanded 3x after joining the FIC marketplace. The dashboard is intuitive and powerful.", rating: 5, role: 'Verified Vendor' },
        { name: "Meera Nair", comment: "The digital marketing services helped my local boutique reach customers across Bangalore. Truly exceptional.", rating: 4, role: 'Business Owner' },
        { name: "Vikram Singh", comment: "Secure payments and verified candidate profiles make FIC the best recruitment partner for our HR team.", rating: 5, role: 'HR Manager' },
        { name: "Anjali G.", comment: "The IT solutions provided for our hospital management were seamless and cutting-edge. Highly recommend.", rating: 5, role: 'Enterprise Client' }
    ];

    const displayReviews = reviews.length > 0 ? reviews : mockFallbacks;

    return (
        <section id="testimonials" className="py-24 bg-slate-50 dark:bg-dark-bg relative overflow-hidden border-t border-slate-100 dark:border-slate-800">
            <div className="container-xl relative z-10">
                <div className="section-header">
                    <span className="section-eyebrow">Trust Signals</span>
                    <h2 className="section-title">What the community says</h2>
                    <p className="section-subtitle">Real stories from real members who have grown with the Forge India Connect ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayReviews.slice(0, 6).map((rev, idx) => (
                        <TestimonialCard key={idx} rev={rev} idx={idx} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-card bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            Join <span className="text-primary font-black">5,000+</span> success stories
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const PlacedCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHired = async () => {
            try {
                const { data } = await api.get('/applications/public-hired');
                setCandidates(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load success stories');
            } finally {
                setLoading(false);
            }
        };
        fetchHired();
    }, []);

    if (loading) return null;
    if (candidates.length === 0) return null;

    return (
        <section className="py-12 bg-white dark:bg-[#0a0f1a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest mb-6"
                        >
                            <Award size={14} /> Global Impact
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                            Our Placed <span className="text-primary italic">Candidates</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {candidates.map((cand, idx) => (
                        <motion.div
                            key={cand._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-slate-50 dark:bg-zinc-900/50 rounded-[3rem] p-10 border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-500"
                        >
                            <div className="absolute top-8 right-8 w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-primary border border-slate-100 dark:border-white/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                <Briefcase size={20} />
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Success Story</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                                    {cand.user?.firstName} {cand.user?.lastName}
                                </h3>
                                <p className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                                    {cand.jobRole}
                                </p>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-white/5">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                                    <span>Hired At</span>
                                    <span className="text-primary">{cand.job?.company}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest">
                                    <CheckCircle2 size={12} /> Verified Placement
                                </div>
                            </div>

                            <div className="mt-8 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                    Read Journey <ChevronRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlacedCandidates;

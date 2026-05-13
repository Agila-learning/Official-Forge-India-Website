import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, MapPin, CheckCircle2, ChevronRight, Globe, Zap, Target, ArrowRight } from 'lucide-react';
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

    const mockCandidates = [
        { _id: '1', user: { firstName: 'Rahul', lastName: 'V.' }, jobRole: 'Senior Cloud Architect', job: { company: 'Google Cloud' }, date: 'April 2026' },
        { _id: '2', user: { firstName: 'Sneha', lastName: 'M.' }, jobRole: 'Full Stack Engineer', job: { company: 'Atlassian' }, date: 'May 2026' },
        { _id: '3', user: { firstName: 'Arjun', lastName: 'S.' }, jobRole: 'AI Research Lead', job: { company: 'OpenAI' }, date: 'March 2026' }
    ];

    const displayCandidates = candidates.length > 0 ? candidates : mockCandidates;

    return (
        <section className="py-32 bg-dark-bg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
            
            <div className="container-xl px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-primary/20"
                        >
                            <Target size={14} /> Global Achievement Hub
                        </motion.div>
                        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                            Success <span className="text-primary italic">Deployed.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Live Verification Engine</div>
                        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-dark-bg bg-primary/20" />)}
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">+2.4k Hired</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayCandidates.map((cand, idx) => (
                        <motion.div
                            key={cand._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 relative group border-white/5 hover:border-primary/40 transition-all duration-700 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 transition-colors group-hover:bg-primary/20" />
                            
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-primary border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Briefcase size={28} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Batch Verified</p>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-tight italic">{cand.date || '2026 Cycle'}</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                                    {cand.user?.firstName} {cand.user?.lastName?.[0]}.
                                </h3>
                                <p className="text-sm font-black text-white/40 uppercase tracking-widest leading-relaxed">
                                    {cand.jobRole}
                                </p>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-white/5 relative">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Hired At</span>
                                    <span className="text-xs font-black text-white uppercase tracking-wider">{cand.job?.company}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-black text-secondary uppercase tracking-[0.4em] animate-pulse">
                                    <Globe size={12} /> Global Career Node
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="px-10 py-5 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white/10 hover:text-white hover:border-primary/20 transition-all flex items-center gap-4 mx-auto group">
                        Explore Full Alumni Network <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PlacedCandidates;

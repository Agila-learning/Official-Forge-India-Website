import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, ArrowRight, Search, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobPortal = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20 pb-24 overflow-x-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
                    >
                        <Sparkles size={16} />
                        <span className="text-sm font-black uppercase tracking-widest">Connect Career Ecosystem</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none text-gray-900 dark:text-white uppercase">
                        Forge Your <span className="text-primary italic">Future.</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed italic">
                        "Bridging the gap between India's top talent and high-growth industry leaders through precision recruitment and strategic placements."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Seeker Path */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => navigate('/explore-jobs')}
                        className="group relative p-12 bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl cursor-pointer overflow-hidden transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <img 
                                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop" 
                                className="absolute -top-20 -right-20 w-64 h-64 object-cover opacity-10 group-hover:opacity-20 transition-opacity rounded-full" 
                                alt=""
                            />
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/10">
                                <Search size={40} />
                            </div>
                            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter text-gray-900 dark:text-white">Apply for <span className="text-primary italic">Jobs</span></h3>
                            <p className="text-gray-500 font-bold mb-10 leading-relaxed text-lg">Browse curated opportunities, track applications, and accelerate your career trajectory.</p>
                            <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                                Enter Talent Pool <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Employer Path */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => navigate('/employer/post-job')}
                        className="group relative p-12 bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl cursor-pointer overflow-hidden transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <img 
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop" 
                                className="absolute -top-20 -right-20 w-64 h-64 object-cover opacity-10 group-hover:opacity-20 transition-opacity rounded-full" 
                                alt=""
                            />
                            <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-500 mb-10 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl shadow-purple-500/10">
                                <Building size={40} />
                            </div>
                            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter text-gray-900 dark:text-white">Post a <span className="text-purple-500 italic">Job</span></h3>
                            <p className="text-gray-500 font-bold mb-10 leading-relaxed text-lg">Deploy requisitions, manage candidate pipelines, and hire top-tier industry veterans.</p>
                            <div className="flex items-center gap-3 text-purple-500 font-black uppercase text-xs tracking-widest">
                                Authorize Requisition <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 opacity-50">Trusted by India's fastest growing enterprises</p>
                    <div className="flex justify-center gap-8 grayscale opacity-30 invert dark:invert-0">
                        {/* Placeholder for partner logos */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPortal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Clock, ArrowRight, Filter, ChevronRight, Loader2, Sparkles, XCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import JobApplicationForm from '../components/ui/JobApplicationForm';
import toast from 'react-hot-toast';

const ExploreJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        salaryRange: [0, 50], // in Lakhs
        experience: 'All',
        jobType: 'All'
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const experienceLevels = ['All', 'Fresher', '1-3 Years', '3-5 Years', '5+ Years'];
    const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Remote'];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/applications/mine')
            ]);
            setJobs(jobsRes.data || []);
            setMyApplications(appsRes.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const { data } = await api.get('/applications/mine');
            setMyApplications(data || []);
        } catch (err) {
            console.error('Failed to refresh applications:', err);
        }
    };

    const handleApply = (job) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo && userInfo.role && userInfo.role !== 'Candidate' && userInfo.role !== 'Customer') {
            toast.error(`Only Candidates and Customers can apply for jobs.`, {
                style: { borderRadius: '20px', background: '#333', color: '#fff', fontSize: '10px' }
            });
            return;
        }
        
        setSelectedJob(job);
        setIsFormOpen(true);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
        const matchesExp = filters.experience === 'All' || job.experience?.includes(filters.experience);
        const matchesType = filters.jobType === 'All' || job.status?.includes(filters.jobType);
        
        return matchesSearch && matchesLocation && matchesExp && matchesType;
    });

    const removeTag = (key) => {
        if (key === 'salaryRange') setFilters({...filters, salaryRange: [0, 50]});
        else if (key === 'experience') setFilters({...filters, experience: 'All'});
        else if (key === 'location') setFilters({...filters, location: ''});
        else if (key === 'jobType') setFilters({...filters, jobType: 'All'});
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20 pb-24 px-4 overflow-x-hidden relative">
            <JobApplicationForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                jobId={selectedJob?._id}
                onSuccess={fetchMyApplications}
                jobTitle={selectedJob ? selectedJob.title : "Career at FIC"} 
            />

            {/* Floating Return Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/jobs')}
                className="fixed top-8 left-8 z-[100] flex lg:hidden items-center gap-2 px-6 py-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all group font-black uppercase text-[10px] tracking-widest"
            >
                <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                Return to Career Hub
            </motion.button>

            {/* Premium Header & Path Selection */}
            <div className="max-w-7xl mx-auto mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
                        <Sparkles size={16} />
                        <span className="text-sm font-black uppercase tracking-widest">Connect Career Portal</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic leading-[0.8] font-syne">
                        Forge Your <span className="text-primary tracking-normal">Future.</span>
                    </h1>
                </motion.div>

                {/* Path Duo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 px-4">
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="relative group h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                            alt="Employer Path"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
                            <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Building a <span className="text-primary italic">Team?</span></h3>
                            <p className="text-gray-300 font-bold mb-8 text-sm uppercase tracking-widest leading-relaxed">Access India's premier talent network and scale your business with elite professionals.</p>
                            <button 
                                onClick={() => navigate('/employer')}
                                className="w-fit px-10 py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/40 hover:bg-blue-600 transition-all"
                            >
                                Post a Mission
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="relative group h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                            alt="Candidate Path"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent p-12 flex flex-col justify-end">
                            <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Seeking <span className="text-secondary italic">Growth?</span></h3>
                            <p className="text-gray-300 font-bold mb-8 text-sm uppercase tracking-widest leading-relaxed">Discover high-impact roles at innovative companies within the Forge India network.</p>
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('jobs-scroller');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-fit px-10 py-5 bg-secondary text-dark-bg font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl shadow-secondary/40 hover:bg-yellow-500 transition-all"
                            >
                                Explore Opportunities
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <motion.div 
                    id="jobs-scroller"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-white/80 dark:bg-dark-card/80 backdrop-blur-3xl p-4 rounded-[3rem] shadow-3xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center"
                >
                    <div className="flex-grow flex items-center gap-4 px-6 w-full text-left">
                        <Search className="text-primary" />
                        <input 
                            type="text" 
                            placeholder="Designation, company, or skills..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-5 bg-transparent outline-none font-black text-gray-800 dark:text-white uppercase text-xs tracking-widest placeholder:text-gray-300 placeholder:normal-case h-full"
                        />
                    </div>
                    <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-800 hidden md:block"></div>
                    <div className="flex items-center gap-4 px-6 w-full md:w-auto text-left">
                        <MapPin className="text-secondary" />
                        <input 
                            type="text" 
                            placeholder="Location..." 
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            className="py-5 bg-transparent outline-none font-black text-gray-800 dark:text-white uppercase text-xs tracking-widest placeholder:text-gray-300 placeholder:normal-case w-full md:w-40"
                        />
                    </div>
                    <button className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black rounded-[2rem] shadow-3xl shadow-primary/30 hover:bg-blue-600 transition-all uppercase tracking-[0.4em] text-[10px]">
                        Scan
                    </button>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-12">
                {/* Advanced Filter Sidebar (Desktop) */}
                <aside className="hidden lg:block space-y-8">
                    <FilterPanel 
                        filters={filters} 
                        setFilters={setFilters} 
                        experienceLevels={experienceLevels}
                        jobTypes={jobTypes}
                        onReset={() => setFilters({ location: '', salaryRange: [0, 50], experience: 'All', jobType: 'All' })}
                    />
                </aside>

                {/* Job Listings Grid */}
                <div className="space-y-8">
                    {/* Active Filters Summary */}
                    {(filters.location || filters.experience !== 'All' || filters.salaryRange[1] < 50 || filters.jobType !== 'All') && (
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2 text-left">Results for:</span>
                            <div className="flex flex-wrap gap-2">
                                {filters.location && (
                                    <button onClick={() => removeTag('location')} className="px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-primary hover:text-white transition-all">
                                        {filters.location} <XCircle size={14} className="opacity-50 group-hover:opacity-100" />
                                    </button>
                                )}
                                {filters.experience !== 'All' && (
                                    <button onClick={() => removeTag('experience')} className="px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-primary hover:text-white transition-all">
                                        {filters.experience} <XCircle size={14} className="opacity-50 group-hover:opacity-100" />
                                    </button>
                                )}
                                {filters.salaryRange[1] < 50 && (
                                    <button onClick={() => removeTag('salaryRange')} className="px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-primary hover:text-white transition-all">
                                        Up to ₹{filters.salaryRange[1]}L <XCircle size={14} className="opacity-50 group-hover:opacity-100" />
                                    </button>
                                )}
                                {filters.jobType !== 'All' && (
                                    <button onClick={() => removeTag('jobType')} className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-secondary hover:text-white transition-all">
                                        {filters.jobType} <XCircle size={14} className="opacity-50 group-hover:opacity-100" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="animate-spin text-primary" size={48} />
                            <p className="font-black text-gray-400 uppercase tracking-widest">Fetching Opportunities...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30">
                            <p className="text-red-500 font-black">{error}</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="p-20 text-center bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                             <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Search size={40} />
                             </div>
                             <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">No jobs found</h3>
                             <p className="text-gray-500 font-medium">Try broadening your search or adjusting filters.</p>
                        </div>
                    ) : (
                        filteredJobs.map((job, idx) => (
                            <motion.div 
                                key={job._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-dark-card p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group border-l-8 border-l-transparent hover:border-l-primary"
                            >
                                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                    <Briefcase size={32} className="text-primary" />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight text-gray-900 dark:text-white">{job.title}</h3>
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest self-center md:self-auto font-black">
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="font-bold text-gray-600 dark:text-gray-400 mb-4 italic">{job.companyName}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-bold uppercase tracking-tight">
                                        <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {job.location}</span>
                                        <span className="flex items-center gap-2"><DollarSign size={16} className="text-secondary" /> {job.salary}</span>
                                        <span className="flex items-center gap-2"><Briefcase size={16} className="text-purple-400" /> {job.experience || 'Entry Level'}</span>
                                        <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {(() => {
                                    const alreadyApplied = myApplications.some(app => app.job?._id === job._id);
                                    return (
                                        <button 
                                            onClick={() => !alreadyApplied && handleApply(job)}
                                            disabled={alreadyApplied}
                                            className={`w-full md:w-auto px-10 py-5 font-black rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest text-xs ${
                                                alreadyApplied 
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 cursor-not-allowed shadow-none' 
                                                : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
                                            }`}
                                        >
                                            {alreadyApplied ? <><CheckCircle2 size={20} /> Applied</> : <><ArrowRight size={20} /> Apply Now</>}
                                        </button>
                                    );
                                })()}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-dark-bg/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-dark-card border-l border-white/10 z-[101] lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Refine <span className="text-primary tracking-normal">Search</span></h3>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                <FilterPanel 
                                    filters={filters} 
                                    setFilters={setFilters} 
                                    experienceLevels={experienceLevels}
                                    jobTypes={jobTypes}
                                    onReset={() => setFilters({ location: '', salaryRange: [0, 50], experience: 'All', jobType: 'All' })}
                                    isMobile={true}
                                />
                            </div>
                            <div className="p-6 bg-dark-bg border-t border-white/10 gap-4 flex shrink-0">
                                <button 
                                    onClick={() => { setFilters({ location: '', salaryRange: [0, 50], experience: 'All', jobType: 'All' }); setIsFilterOpen(false); }}
                                    className="flex-1 py-4 bg-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl"
                                >
                                    Clear All
                                </button>
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="flex-[2] py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    Show Jobs
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Filter Trigger (Fixed Bottom) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="px-8 py-4 bg-dark-bg text-white rounded-full shadow-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border border-white/10 hover:scale-105 active:scale-95 transition-all"
                >
                    <Filter size={16} className="text-primary" /> Filter Jobs
                </button>
            </div>
        </div>
    );
};

// Extracted Filter Panel Component
const FilterPanel = ({ filters, setFilters, experienceLevels, jobTypes, onReset, isMobile = false }) => (
    <div className={`${isMobile ? '' : 'p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 sticky top-24'}`}>
        {!isMobile && (
            <h3 className="text-lg font-black mb-10 flex items-center gap-2 text-gray-900 dark:text-white uppercase italic tracking-tighter">
                <Filter size={20} className="text-primary" /> Filter <span className="text-primary tracking-normal font-black">Controls</span>
            </h3>
        )}
        
        <div className="space-y-12">
            <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] block mb-6 flex items-center gap-3 italic">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign size={12} className="text-primary" /></div> Compensation (LPA)
                </label>
                <div className="px-2 text-left">
                    <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        value={filters.salaryRange[1]}
                        onChange={(e) => setFilters({...filters, salaryRange: [filters.salaryRange[0], parseInt(e.target.value)]})}
                        className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-4">
                        <span className="text-[10px] font-black text-gray-400">₹0</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em] bg-primary/5 px-2 py-1 rounded-md">Up to ₹{filters.salaryRange[1]}L</span>
                        <span className="text-[10px] font-black text-gray-400">₹50L+</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] block mb-6 flex items-center gap-3 italic">
                    <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center"><Clock size={12} className="text-secondary" /></div> Seniority
                </label>
                <div className="flex flex-wrap gap-2">
                    {experienceLevels.map(e => (
                        <button 
                            key={e}
                            onClick={() => setFilters({...filters, experience: e})}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filters.experience === e ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary/30'}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] block mb-6 flex items-center gap-3 italic">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center"><Briefcase size={12} className="text-orange-500" /></div> Work Model
                </label>
                <div className="flex flex-wrap gap-2">
                    {jobTypes.map(t => (
                        <button 
                            key={t}
                            onClick={() => setFilters({...filters, jobType: t})}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filters.jobType === t ? 'bg-secondary border-secondary text-dark-bg shadow-lg shadow-secondary/20 scale-105' : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-500 hover:border-secondary/30'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {!isMobile && (
            <div className="mt-12 pt-10 border-t border-gray-50 dark:border-gray-800 flex gap-3">
                <button 
                    onClick={onReset}
                    className="flex-1 py-4 px-4 bg-gray-50 dark:bg-dark-bg text-gray-400 font-black uppercase text-[9px] tracking-[0.2em] rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                >
                    Reset
                </button>
                <button className="flex-[2] py-4 px-4 bg-primary text-white font-black uppercase text-[9px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95">
                    Apply Now
                </button>
            </div>
        )}
    </div>
);

export default ExploreJobs;

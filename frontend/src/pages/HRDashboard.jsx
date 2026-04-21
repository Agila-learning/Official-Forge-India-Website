import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Briefcase, Users, Plus, Edit, Trash2, LogOut, FileText, CheckCircle, Star, XCircle, Menu, X, LayoutDashboard, ShieldCheck, Wrench, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';

const HRDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.view || 'overview');
    const [dashboardStats, setDashboardStats] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [managedSlots, setManagedSlots] = useState([]);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setManagedSlots(editingProduct.slots || []);
        } else {
            setManagedSlots([]);
        }
    }, [editingProduct]);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes, productsRes] = await Promise.all([
                api.get('/jobs').catch(() => ({ data: [] })),
                api.get('/applications').catch(() => ({ data: [] })),
                api.get('/products').catch(() => ({ data: [] }))
            ]);
            setJobs(jobsRes.data || []);
            setApplications(appsRes.data || []);
            setProducts(productsRes.data || []);
        } catch (err) {
            console.error('HR Dashboard Sync Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobs.length > 0 || applications.length > 0) {
            const hired = applications.filter(a => a.status === 'Hired').length;
            const rate = applications.length > 0 ? ((hired / applications.length) * 100).toFixed(1) : '0';
            setDashboardStats({
                activeJobs: jobs.length,
                hiredCount: hired,
                totalApplied: applications.length,
                interviewRate: rate + '%'
            });
        }
    }, [jobs, applications]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmitJob = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob._id}`, data);
                toast.success('Job updated!');
            } else {
                await api.post('/jobs', data);
                toast.success('Job posted!');
            }
            setIsAdding(false);
            setEditingJob(null);
            fetchData();
        } catch (err) {
            toast.error('Failed to save job');
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Delete this job posting?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job deleted');
            fetchData();
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const handleUpdateApplicationStatus = async (appId, status, note = '') => {
        try {
            await api.put(`/applications/${appId}/status`, { status, hrNotes: note });
            toast.success('Status updated');
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleSubmitService = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        payload.isService = true;
        payload.slots = managedSlots;
        payload.price = Number(payload.price);

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, payload);
                toast.success('Service updated!');
            } else {
                await api.post('/products', payload);
                toast.success('Service published!');
            }
            setEditingProduct(null);
            setIsAdding(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to save service');
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Service removed');
            fetchData();
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-12">
                    <div className="w-24 h-24 border-2 border-primary/20 rounded-full animate-spin"></div>
                    <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">FORGE INDIA <span className="text-primary">CONNECT</span></h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">Loading HR Dashboard...</p>
            </div>
        );
    }

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={dashboardStats}>
            <div className="space-y-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Operational Statistics</p>
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">HR <span className="text-primary italic">Intelligence</span></h2>
                                </div>
                                <div className="flex items-center gap-4">
                                     <button onClick={() => { setIsAdding(true); setEditingJob(null); setActiveTab('jobs'); }} className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                                        <Plus size={16} /> Post Job
                                    </button>
                                    <button onClick={() => { setIsAdding(true); setEditingProduct(null); setActiveTab('services'); }} className="px-6 py-3 bg-secondary text-dark-bg rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-yellow-500 shadow-xl shadow-secondary/20 transition-all flex items-center gap-2">
                                        <Wrench size={16} /> New Service
                                    </button>
                                </div>
                            </div>
                            <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card">
                                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Pipeline Overview</h3>
                                        <div className="space-y-4">
                                            {applications.slice(0, 5).map(app => (
                                                <div key={app._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                                    <div>
                                                        <p className="font-bold text-sm uppercase">{app.fullName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Role: {app.jobRole}</p>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Hired' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            ))}
                                            {applications.length === 0 && <p className="text-center text-gray-400 font-bold italic py-10">No applications tracked yet</p>}
                                        </div>
                                    </div>
                                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card">
                                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Active Requisitions</h3>
                                        <div className="space-y-4">
                                            {jobs.slice(0, 5).map(job => (
                                                <div key={job._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black">
                                                            <Briefcase size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm uppercase truncate w-32">{job.title}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase">{job.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 font-bold text-xs">
                                                        {applications.filter(a => a.jobId === job._id).length}
                                                    </div>
                                                </div>
                                            ))}
                                            {jobs.length === 0 && <p className="text-center text-gray-400 font-bold italic py-10">No active job postings</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'jobs' && (
                            <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                <div className="flex justify-end">
                                    <button onClick={() => { setIsAdding(true); setEditingJob(null); }} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 shadow-xl shadow-primary/20">
                                        <Plus size={18} className="inline mr-2" /> Deploy Vacancy
                                    </button>
                                </div>
                                {(isAdding || editingJob) && (
                                    <div className="glass-card p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-dark-card">
                                        <h2 className="text-3xl font-black mb-8 uppercase">Vacancy Parameters</h2>
                                        <form onSubmit={handleSubmitJob} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <input name="title" defaultValue={editingJob?.title} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Designation" />
                                            <input name="companyName" defaultValue={editingJob?.companyName || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Company Name" />
                                            <input name="location" defaultValue={editingJob?.location} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Location" />
                                            <input name="salary" defaultValue={editingJob?.salary} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Salary Package" />
                                            <input name="experience" defaultValue={editingJob?.experience || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="2+ Years" />
                                            <input name="requirements" defaultValue={editingJob?.requirements || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="React, Node.js, AWS" />
                                            <input name="expiryDate" type="date" defaultValue={editingJob?.expiryDate ? new Date(editingJob.expiryDate).toISOString().split('T')[0] : ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" placeholder="Last Day to Apply" />
                                            <select name="recruitmentStatus" defaultValue={editingJob?.recruitmentStatus || 'Active'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                                <option value="Active">Actively Recruiting</option>
                                                <option value="Freezed">Recruitment Freezed</option>
                                            </select>
                                            <textarea name="description" defaultValue={editingJob?.description} rows="4" className="md:col-span-2 w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none resize-none" placeholder="Impact Statement"></textarea>
                                            <div className="md:col-span-2 flex gap-4">
                                                <button type="submit" className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-primary/20">{editingJob ? 'Update' : 'Authorize Publication'}</button>
                                                <button type="button" onClick={() => { setIsAdding(false); setEditingJob(null); }} className="px-10 py-5 bg-gray-100 dark:bg-gray-800 rounded-[2rem] font-black uppercase tracking-widest">Abort</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-6">
                                    {jobs.map(job => (
                                        <div key={job._id} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-all bg-white dark:bg-dark-card">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter truncate">{job.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-sm font-bold text-gray-400 uppercase">{job.location} • {job.salary}</p>
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${job.recruitmentStatus === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {job.recruitmentStatus === 'Active' ? 'Actively Recruiting' : 'Freezed'}
                                                    </span>
                                                    {job.expiryDate && (
                                                        <span className="text-[8px] font-black text-gray-400 uppercase border border-gray-200 px-3 py-1 rounded-full italic">
                                                            Ends: {new Date(job.expiryDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditingJob(job); setIsAdding(true); }} className="p-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all"><Edit size={20} /></button>
                                                <button onClick={() => handleDeleteJob(job._id)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {jobs.length === 0 && (
                                        <div className="text-center py-20 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active vacancies</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'applications' && (
                            <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                {applications.map(app => (
                                    <div key={app._id} className="glass-card p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card">
                                        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 pb-8 border-b border-gray-50 dark:border-gray-800">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter">{app.fullName}</h3>
                                                <p className="text-sm font-bold text-gray-400 uppercase mt-1">{app.email} • {app.phone}</p>
                                                <div className="flex gap-4 mt-6">
                                                    <span className="px-5 py-2 bg-primary text-white text-[9px] font-black uppercase rounded-full">{app.jobRole}</span>
                                                    <div className="flex items-center gap-1">
                                                        {['Applied', 'Shortlisted', 'Interview', 'Hired'].map((step, idx) => (
                                                            <React.Fragment key={step}>
                                                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[8px] font-black ${
                                                                    app.status === step || (idx < ['Applied', 'Shortlisted', 'Interview', 'Hired'].indexOf(app.status))
                                                                        ? 'bg-primary text-white' 
                                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200'
                                                                }`}>
                                                                    {idx + 1}
                                                                </div>
                                                                {idx < 3 && <div className={`w-4 h-0.5 ${idx < ['Applied', 'Shortlisted', 'Interview', 'Hired'].indexOf(app.status) ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}></div>}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {app.resumeUrl && (
                                                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="self-start px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-xl">
                                                    <FileText size={20} /> Review Dossier
                                                </a>
                                            )}
                                        </div>
                                            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                                                {['Shortlisted', 'Interview', 'Hired', 'Rejected'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleUpdateApplicationStatus(app._id, status)}
                                                        className={`flex-1 min-w-[120px] py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                                            app.status === status 
                                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                                : 'bg-white dark:bg-dark-card hover:bg-primary/5 hover:text-primary border-gray-100 dark:border-gray-800 hover:border-primary/30'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                                {app.status === 'Interview' && (
                                                    <button 
                                                        onClick={async () => {
                                                            const link = window.prompt('Enter Interview Link (Zoom/Google Meet/Teams):');
                                                            if (link) {
                                                                try {
                                                                    await api.post('/chat', { 
                                                                        receiver: app.user, 
                                                                        content: `Your interview has been scheduled. Link: ${link}`,
                                                                        messageType: 'interview-link'
                                                                    });
                                                                    toast.success('Interview link shared via chat');
                                                                } catch (err) { toast.error('Failed to share link'); }
                                                            }
                                                        }}
                                                        className="flex-1 min-w-[120px] py-3 bg-secondary text-dark-bg rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        Share Link
                                                    </button>
                                                )}
                                            </div>
                                    </div>
                                ))}
                                {applications.length === 0 && (
                                    <div className="text-center py-32 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <FileText className="mx-auto text-gray-300 mb-6" size={64} />
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">Pipeline Empty</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Awaiting talent signals</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'services' && (
                            <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                <div className="flex justify-end">
                                    <button onClick={() => { setIsAdding(true); setEditingProduct(null); }} className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 shadow-xl shadow-purple-600/20">
                                        <Plus size={18} className="inline mr-2" /> Offer New Service
                                    </button>
                                </div>
                                {(isAdding || editingProduct) && (
                                    <div className="glass-card p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-dark-card">
                                        <h2 className="text-3xl font-black mb-8 uppercase text-purple-600">Service Specification</h2>
                                        <form onSubmit={handleSubmitService} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <input name="name" defaultValue={editingProduct?.name} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Service Name" />
                                            <select name="category" defaultValue={editingProduct?.category || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                                <option value="">Select Category</option>
                                                <option value="Cleaning">Cleaning</option>
                                                <option value="Painting">Painting</option>
                                                <option value="Plumbing">Plumbing</option>
                                                <option value="Electrical">Electrical</option>
                                                <option value="AC Repair">AC Repair</option>
                                            </select>
                                            <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Base Price (INR)" />
                                            <input name="shopName" defaultValue={editingProduct?.shopName || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Service Provider Name" />
                                            <input name="image" defaultValue={editingProduct?.image} required className="md:col-span-2 w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Image URL" />
                                            <div className="md:col-span-2">
                                                <SlotManager slots={managedSlots} setSlots={setManagedSlots} />
                                            </div>
                                            <textarea name="description" defaultValue={editingProduct?.description} rows="4" className="md:col-span-2 w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none resize-none" placeholder="Service Details"></textarea>
                                            <div className="md:col-span-2 flex gap-4">
                                                <button type="submit" className="flex-1 py-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-widest">{editingProduct ? 'Update' : 'Publish Service'}</button>
                                                <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-10 py-5 bg-gray-100 dark:bg-gray-800 rounded-[2rem] font-black uppercase tracking-widest">Abort</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-6">
                                    {products.filter(p => p.isService).map(service => (
                                        <div key={service._id} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-purple-500 transition-all border-l-8 border-l-purple-500 bg-white dark:bg-dark-card">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter truncate">{service.name}</h3>
                                                <p className="text-sm font-bold text-gray-400 uppercase mt-1">{service.category} • ₹{service.price}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditingProduct(service); setIsAdding(true); }} className="p-4 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-2xl transition-all"><Edit size={20} /></button>
                                                <button onClick={() => handleDeleteService(service._id)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {products.filter(p => p.isService).length === 0 && (
                                        <div className="text-center py-20 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                            <Wrench className="mx-auto text-gray-300 mb-4" size={48} />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active services</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl">
                                <div className="glass-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-dark-card">
                                    <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter">Corp Identity</h2>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const profileData = Object.fromEntries(formData.entries());
                                        try {
                                            const payload = { ...profileData, deliveryAvailable: e.target.deliveryAvailable.checked };
                                            await api.put('/users/profile', payload);
                                            toast.success('Corp Sync Successful');
                                            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...payload }));
                                        } catch (err) { toast.error('Sync Failed'); }
                                    }} className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Designation</label>
                                            <input name="businessName" defaultValue={userInfo?.businessName} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Contact</label>
                                            <input name="mobile" defaultValue={userInfo?.mobile} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                                        </div>
                                        <div className="flex items-center gap-4 py-4 px-6 bg-primary/5 rounded-2xl border border-primary/10">
                                            <input 
                                                name="deliveryAvailable" 
                                                type="checkbox" 
                                                defaultChecked={userInfo?.deliveryAvailable} 
                                                className="w-6 h-6 rounded-lg accent-primary cursor-pointer" 
                                            />
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-widest text-primary leading-none mb-1">Enable Customer Delivery</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase italic opacity-60">Authorize FIC logistics to handle your customer deliveries.</p>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all">Secure Updates</button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto space-y-12">
                                <div className="glass-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-3xl text-center relative overflow-hidden bg-white dark:bg-dark-card">
                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-10 rotate-12">
                                            <ShieldCheck size={48} />
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">HR <span className="text-primary">Profile</span></h3>
                                        <p className="text-lg text-gray-500 font-medium mb-12">Personnel Management Access</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
                                            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{userInfo.firstName} {userInfo.lastName}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Designation</p>
                                                <p className="font-bold text-primary italic uppercase tracking-tight">HR Partner</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Email</p>
                                                <p className="font-bold text-gray-900 dark:text-white uppercase">{userInfo.email}</p>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl mb-8">
                                            <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                                                "As an HR Partner, you are the gateway to Forge India Connect's talent ecosystem."
                                            </p>
                                        </div>
                                        <button onClick={() => setActiveTab('settings')} className="w-full py-4 bg-primary/10 text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all">
                                            Edit Identity
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};


const SlotManager = ({ slots, setSlots }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const addDate = () => {
        if (!newDate) return;
        if (slots.find(s => s.date === newDate)) {
            toast.error('Date already exists');
            return;
        }
        setSlots([...slots, { date: newDate, times: [], isAvailable: true }]);
        setNewDate('');
    };

    const addTime = (dateIndex) => {
        if (!newTime) return;
        const updatedSlots = [...slots];
        if (updatedSlots[dateIndex].times.includes(newTime)) {
             toast.error('Time slot already exists');
             return;
        }
        updatedSlots[dateIndex].times.push(newTime);
        setSlots(updatedSlots);
        setNewTime('');
    };

    const removeTime = (dateIndex, timeIndex) => {
        const updatedSlots = [...slots];
        updatedSlots[dateIndex].times.splice(timeIndex, 1);
        setSlots(updatedSlots);
    };

    const removeDate = (dateIndex) => {
        const updatedSlots = [...slots];
        updatedSlots.splice(dateIndex, 1);
        setSlots(updatedSlots);
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-primary" /> Availability Management
            </h4>
            
            <div className="flex gap-4 mb-8">
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                <button type="button" onClick={addDate} className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-blue-700 transition-all text-xs uppercase tracking-widest">Add Date</button>
            </div>

            <div className="space-y-4">
                {slots.map((slot, dIdx) => (
                    <div key={dIdx} className="p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group/date">
                        <button type="button" onClick={() => removeDate(dIdx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-opacity"><XCircle size={14} /></button>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-black text-primary uppercase text-xs tracking-widest">{new Date(slot.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {slot.times.map((time, tIdx) => (
                                <div key={tIdx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg border border-primary/20">
                                    <span className="text-[10px] font-black">{time}</span>
                                    <button type="button" onClick={() => removeTime(dIdx, tIdx)} className="text-primary/40 hover:text-red-500"><XCircle size={12} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                             <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-xs font-bold" />
                             <button type="button" onClick={() => addTime(dIdx)} className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Add Time</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HRDashboard;

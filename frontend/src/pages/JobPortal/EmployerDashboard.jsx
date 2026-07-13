import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, Plus, LayoutDashboard, Search, FileText, CheckCircle2, XCircle, Menu, X, LogOut, Sparkles, Building, Calendar, Edit, Trash2, MapPin, DollarSign, Clock } from 'lucide-react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const EmployerDashboard = () => {
 const [jobs, setJobs] = useState([]);
 const [applications, setApplications] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState('overview');
 const [isAddingJob, setIsAddingJob] = useState(false);
 const [editingJob, setEditingJob] = useState(null);
 
 // Interview Scheduling State
 const [interviewModalData, setInterviewModalData] = useState(null);
 const [interviewForm, setInterviewForm] = useState({ date: '', time: '', link: '' });

 const navigate = useNavigate();

 // Check location properly
 useEffect(() => {
 if (window.location.pathname.includes('post-job')) {
 setActiveTab('post');
 setIsAddingJob(true);
 }
 }, [window.location.pathname]);

 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

 useEffect(() => {
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 setLoading(true);
 const [jobsRes, appsRes] = await Promise.all([
 api.get('/jobs'),
 api.get('/applications')
 ]);
 setJobs(jobsRes.data || []);
 setApplications(appsRes.data || []);
 } catch (err) {
 toast.error('Failed to load dashboard data');
 } finally {
 setLoading(false);
 }
 };

 const handleSubmitJob = async (e) => {
 e.preventDefault();
 const formData = new FormData(e.target);
 const data = Object.fromEntries(formData.entries());
 try {
 if (editingJob) {
 await api.put(`/jobs/${editingJob._id}`, data);
 toast.success('Job requisition updated!');
 } else {
 await api.post('/jobs', data);
 toast.success('Job requisition authorized and published!');
 }
 setIsAddingJob(false);
 setEditingJob(null);
 fetchData();
 } catch (err) {
 toast.error('Strategic authorization failed');
 }
 };

 const handleDeleteJob = async (id) => {
 if (!window.confirm('Terminate this job requisition?')) return;
 try {
 await api.delete(`/jobs/${id}`);
 toast.success('Requisition terminated');
 fetchData();
 } catch (err) {
 toast.error('Termination failed');
 }
 };

 const handleUpdateStatus = async (appId, status, extraData = {}) => {
 try {
 await api.put(`/applications/${appId}/status`, { status, ...extraData });
 toast.success(`Candidate ${status}`);
 fetchData();
 } catch (err) {
 toast.error('Status sync failed');
 }
 };

 const handleScheduleInterview = async (e) => {
   e.preventDefault();
   if (!interviewModalData) return;
   
   const dateTimeStr = `${interviewForm.date}T${interviewForm.time}:00`;
   await handleUpdateStatus(interviewModalData._id, 'Interview Scheduled', {
     interviewDate: dateTimeStr,
     interviewLink: interviewForm.link
   });
   setInterviewModalData(null);
   setInterviewForm({ date: '', time: '', link: '' });
 };

 if (loading) {
 return <div className="min-h-screen flex items-center justify-center bg-dark-bg text-primary uppercase font-black tracking-widest animate-pulse">Initialising Employer Hub...</div>;
 }

 const dashboardStats = {
 activeSpecs: jobs.length,
 totalDossiers: applications.length,
 onboarded: applications.filter(a => a.status === 'Hired').length
 };

 return (
 <DashboardLayout 
 activeTab={activeTab} 
 setActiveTab={(tab) => {
 setActiveTab(tab);
 if (tab === 'post') {
 setIsAddingJob(true);
 setEditingJob(null);
 } else {
 setIsAddingJob(false);
 }
 }} 
 stats={dashboardStats} 
 themeColor="purple-600"
 >
 <div className="space-y-12">
 <AnimatePresence mode="wait">
 {activeTab === 'overview' && (
 <motion.div key="overview" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-12">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { label: 'Active Specs', val: jobs.length, icon: Briefcase, col: 'bg-blue-500', trend: '+12%' },
 { label: 'Total Dossiers', val: applications.length, icon: FileText, col: 'bg-purple-600', trend: '+24%' },
 { label: 'Onboarded', val: applications.filter(a => a.status === 'Hired').length, icon: CheckCircle2, col: 'bg-green-500', trend: '+8%' }
 ].map((s, i) => (
 <div key={i} className="p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
 <div className={`absolute top-0 right-0 w-32 h-32 ${s.col} opacity-5 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
 <div className={`w-14 h-14 ${s.col} rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-gray-500/20`}>
 <s.icon size={28} />
 </div>
 <div className="flex justify-between items-end">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
 <h4 className="text-5xl font-black tracking-tighter">{s.val}</h4>
 </div>
 <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full">{s.trend}</span>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
 <div className="p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
 <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Recent <span className="text-purple-600 font-poppins">Requisitions</span></h3>
 <div className="space-y-4">
 {jobs.slice(0, 4).map(job => (
 <div key={job._id} className="p-6 bg-gray-50 dark:bg-dark-bg/50 rounded-[2rem] border border-transparent hover:border-purple-600/30 transition-all group">
 <div className="flex justify-between items-center">
 <div>
 <h4 className="font-black text-sm uppercase tracking-tight">{job.title}</h4>
 <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{job.location} • {job.salary || 'Competitive'}</p>
 </div>
 <span className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center"><Edit size={16} /></span>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
 <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Top <span className="text-purple-600 font-poppins">Applicants</span></h3>
 <div className="space-y-4">
 {applications.slice(0, 4).map(app => (
 <div key={app._id} className="p-6 bg-gray-50 dark:bg-dark-bg/50 rounded-[2rem] border border-transparent hover:border-purple-600/30 transition-all group">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs">{app.fullName[0]}</div>
 <div>
 <h4 className="font-black text-sm uppercase tracking-tight">{app.fullName}</h4>
 <p className="text-[9px] font-bold text-purple-600 uppercase mt-1 tracking-widest">{app.jobRole}</p>
 </div>
 </div>
 <span className="text-[8px] font-black uppercase px-3 py-1 bg-green-500/10 text-green-500 rounded-full">{app.status}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {(activeTab === 'post' || isAddingJob) && (
 <motion.div key="post" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto">
 <div className="p-12 bg-white dark:bg-dark-card rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
 <div className="mb-12">
 <h2 className="text-3xl font-black uppercase tracking-tighter">{editingJob ? 'Refine' : 'Authorise'} <span className="text-purple-600 font-poppins">Vacancy</span></h2>
 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Strategic Deployment Protocol 08.v2</p>
 </div>
 <form onSubmit={handleSubmitJob} className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Briefcase size={12} /> Designation</label>
 <input name="title" defaultValue={editingJob?.title} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" placeholder="e.g. Lead Industrial Engineer" />
 </div>
 <div className="space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12} /> Logistics Hub</label>
 <input name="location" defaultValue={editingJob?.location} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" placeholder="e.g. Pune, Maharashtra" />
 </div>
 <div className="space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><DollarSign size={12} /> Package (INR)</label>
 <input name="salary" defaultValue={editingJob?.salary} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" placeholder="e.g. 18 LPA - 24 LPA" />
 </div>
 <div className="space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Clock size={12} /> Tenacity</label>
 <select name="type" defaultValue={editingJob?.type || 'Full-time'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-black text-[10px] uppercase tracking-widest">
 <option value="Full-time">Full-time Core</option>
 <option value="Contract">Project Basis</option>
 <option value="Intership">Apprenticeship</option>
 </select>
 </div>
 <div className="md:col-span-2 space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Sparkles size={12} /> Core Competencies (CSV)</label>
 <input name="requirements" defaultValue={editingJob?.requirements} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" placeholder="e.g. Precision Engineering, AI Integration, Leadership" />
 </div>
 <div className="md:col-span-2 space-y-2">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Impact Description</label>
 <textarea name="description" defaultValue={editingJob?.description} rows="4" className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-medium text-sm resize-none" placeholder="Describe the mission scope and societal impact..."></textarea>
 </div>
 <div className="md:col-span-2 flex gap-4 pt-4">
 <button type="submit" className="flex-1 py-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-purple-600/30 hover:bg-purple-700 transition-all flex items-center justify-center gap-3">
 <Sparkles size={18} /> {editingJob ? 'Update Protocol' : 'Deploy Protocol'}
 </button>
 <button type="button" onClick={() => { setIsAddingJob(false); setActiveTab('jobs'); }} className="px-10 py-5 bg-gray-100 dark:bg-dark-bg text-gray-400 rounded-[2rem] font-black uppercase tracking-widest hover:text-red-500 transition-all">Cancel</button>
 </div>
 </form>
 </div>
 </motion.div>
 )}

 {activeTab === 'jobs' && !isAddingJob && (
 <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <div className="flex justify-between items-center mb-8">
 <h3 className="text-3xl font-black uppercase tracking-tighter">Live <span className="text-purple-600 font-poppins">Requisitions</span></h3>
 <button onClick={() => setIsAddingJob(true)} className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-600/20">Add Vacancy</button>
 </div>
 <div className="grid grid-cols-1 gap-6">
 {jobs.map(job => (
 <div key={job._id} className="p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl hover:border-purple-600/30 transition-all group flex flex-col md:flex-row justify-between items-center gap-8">
 <div className="flex-1">
 <div className="flex items-center gap-4 mb-2">
 <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{job.title}</h4>
 <span className="px-3 py-1 bg-purple-600/10 text-purple-600 text-[8px] font-black uppercase rounded-full tracking-widest">Active</span>
 </div>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
 <MapPin size={12} className="text-purple-600" /> {job.location} 
 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
 <DollarSign size={12} className="text-purple-600" /> {job.salary}
 </p>
 </div>
 <div className="flex gap-4">
 <button onClick={() => { setEditingJob(job); setIsAddingJob(true); }} className="w-14 h-14 rounded-2xl bg-primary/5 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all"><Edit size={22} /></button>
 <button onClick={() => handleDeleteJob(job._id)} className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"><Trash2 size={22} /></button>
 <button onClick={() => setActiveTab('candidates')} className="px-8 py-4 bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">View {applications.filter(a => a.jobRole === job.title).length} Candidates</button>
 </div>
 </div>
 ))}
 {jobs.length === 0 && (
 <div className="py-32 text-center bg-white/50 dark:bg-dark-card/50 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
 <Briefcase size={80} className="text-gray-200 mx-auto mb-6" />
 <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-400">No Active Assets</h3>
 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">System awaiting strategic deployment signals</p>
 </div>
 )}
 </div>
 </motion.div>
 )}

 {activeTab === 'candidates' && (
 <motion.div key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Talent <span className="text-purple-600 font-poppins">Dossiers</span></h3>
 <div className="grid grid-cols-1 gap-6">
 {applications.map(app => (
 <div key={app._id} className="p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-600/5 -skew-x-12 translate-x-20"></div>
 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
 <div className="flex items-center gap-8">
 <div className="w-24 h-24 rounded-[2rem] bg-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-purple-600/20">{app.fullName[0]}</div>
 <div>
 <h4 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{app.fullName}</h4>
 <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4">Target: {app.jobRole}</p>
 <div className="flex gap-6 mb-4">
 <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><FileText size={14} className="text-purple-600" /> Resume.pdf</span>
 <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Calendar size={14} className="text-purple-600" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
 </div>
 {/* ATS Visualizer */}
 <div className="space-y-1">
   <div className="flex justify-between items-center">
     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ATS Compatibility</span>
     <span className={`text-[10px] font-black ${app.atsScore > 80 ? 'text-green-500' : app.atsScore > 60 ? 'text-yellow-500' : 'text-red-500'}`}>{app.atsScore}%</span>
   </div>
   <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
     <div className={`h-full ${app.atsScore > 80 ? 'bg-green-500' : app.atsScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${app.atsScore}%` }}></div>
   </div>
   {app.atsFeedback && <p className="text-[8px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{app.atsFeedback}</p>}
 </div>
 </div>
 </div>
 <div className="flex flex-col gap-3 min-w-[200px]">
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1 text-center">Status Control</p>
 <div className="flex gap-2">
 <button onClick={() => handleUpdateStatus(app._id, 'Shortlisted')} className={`flex-1 py-3 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${app.status === 'Shortlisted' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-dark-bg text-gray-500 border-gray-100 dark:border-gray-800 hover:border-blue-500/50'}`}>Shortlist</button>
 <button onClick={() => handleUpdateStatus(app._id, 'Selected')} className={`flex-1 py-3 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${app.status === 'Selected' ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-dark-bg text-gray-500 border-gray-100 dark:border-gray-800 hover:border-green-500/50'}`}>Hire</button>
 </div>
 <button onClick={() => setInterviewModalData(app)} className={`w-full py-4 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all ${app.status === 'Interview Scheduled' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-purple-600 shadow-purple-600/20'}`}>
   {app.status === 'Interview Scheduled' ? 'Interview Set' : 'Schedule Interview'}
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Additional HR Dashboard Tabs */}
 {['search', 'talent-pool', 'shortlists', 'interviews', 'feedback', 'messages', 'campaigns', 'analytics', 'reports', 'subscription', 'company-profile', 'settings', 'profile'].includes(activeTab) && (
   <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-dark-card/50 rounded-[4rem] border border-gray-100 dark:border-gray-800">
     <div className="w-24 h-24 bg-purple-600/10 rounded-full flex items-center justify-center mb-6 text-purple-600">
       <Sparkles size={40} />
     </div>
     <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 capitalize">{activeTab.replace('-', ' ')} <span className="text-purple-600">Module</span></h2>
     <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest max-w-md text-center">
       This module is currently being initialized by the strategic deployment team. The visual interface and API connections will be available shortly.
     </p>
   </motion.div>
 )}

 {/* Interview Scheduling Modal */}
 {interviewModalData && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
     <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-gray-100 dark:border-gray-800">
       <button onClick={() => setInterviewModalData(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
         <X size={20} />
       </button>
       <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-gray-900 dark:text-white">Schedule <span className="text-purple-600">Interview</span></h3>
       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Candidate: {interviewModalData.fullName}</p>
       
       <form onSubmit={handleScheduleInterview} className="space-y-4">
         <div className="space-y-2">
           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
           <input type="date" required value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" />
         </div>
         <div className="space-y-2">
           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
           <input type="time" required value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" />
         </div>
         <div className="space-y-2">
           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Meeting Link (GMeet / Zoom / Teams)</label>
           <input type="url" required value={interviewForm.link} onChange={e => setInterviewForm({...interviewForm, link: e.target.value})} placeholder="https://meet.google.com/..." className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-purple-600 transition-all outline-none font-bold text-sm" />
         </div>
         <button type="submit" className="w-full mt-4 py-4 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/30 hover:bg-purple-700 transition-all">
           Confirm Deployment
         </button>
       </form>
     </div>
   </div>
 )}
 </DashboardLayout>
 );
};

export default EmployerDashboard;

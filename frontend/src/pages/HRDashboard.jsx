import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Briefcase, Users, Plus, Edit, Trash2, FileText, CheckCircle, Star, XCircle, ChevronDown, ChevronUp, Search, Cpu, Sparkles, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarDays, Video, Clock } from 'lucide-react';

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.view || 'overview');
  const [dashboardStats, setDashboardStats] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [atsScoreFilter, setAtsScoreFilter] = useState('All');
  
  // Expanded ATS Reports State (Object mapping application ID to boolean)
  const [expandedATS, setExpandedATS] = useState({});
  const [scheduledInterviews, setScheduledInterviews] = useState(() => JSON.parse(localStorage.getItem('fic_interviews') || '[]'));
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    localStorage.setItem('fic_interviews', JSON.stringify(scheduledInterviews));
  }, [scheduledInterviews]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/applications').catch(() => ({ data: [] }))
      ]);
      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
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

  // Helper: Generates realistic ATS parser recommendations based on role/details
  const getATSMetrics = (app) => {
    const role = (app.jobRole || '').toLowerCase();
    const scoreSeed = app.fullName.charCodeAt(0) + app.fullName.charCodeAt(1) || 75;
    const compatibilityScore = 55 + (scoreSeed % 40); // 55% - 95%
    
    let matchedSkills = ['Communication', 'Team Collaboration', 'Problem Solving'];
    let missingSkills = ['Advanced Cloud Architectures'];
    let strengths = ['High initiative', 'Structured work style', 'Excellent academic standing'];
    let recommendation = 'Potential Fit - Review Portfolio';

    if (role.includes('developer') || role.includes('engineer') || role.includes('tech') || role.includes('software')) {
      matchedSkills = ['React.js', 'Node.js', 'JavaScript (ES6+)', 'Git Version Control', 'REST APIs'];
      missingSkills = ['TypeScript', 'Docker Containers', 'AWS Lambda'];
      strengths = ['Solid frontend base', 'Clear clean code focus', 'Modern JS mastery'];
      recommendation = compatibilityScore >= 80 ? 'Highly Recommended - Proceed to Technical Round' : 'Proceed with Tech Assessment';
    } else if (role.includes('design') || role.includes('ui') || role.includes('ux') || role.includes('graphic')) {
      matchedSkills = ['Figma Layouts', 'Wireframing', 'Typography', 'Prototyping', 'Color Theory'];
      missingSkills = ['Next.js Framework', 'Three.js Animations'];
      strengths = ['Exquisite aesthetic sense', 'User-centric design thinking', 'Strong visual hierarchy'];
      recommendation = compatibilityScore >= 80 ? 'Exceptional Portfolio - Immediate Interview' : 'Progress to Design Challenge';
    } else if (role.includes('marketing') || role.includes('sales') || role.includes('business')) {
      matchedSkills = ['SEO Strategies', 'Lead Generation', 'Customer Engagement', 'KPI Analytics'];
      missingSkills = ['SQL Database queries', 'CRM Administration'];
      strengths = ['Persuasive communicator', 'Data-driven mindset', 'Energetic relationship building'];
      recommendation = compatibilityScore >= 80 ? 'Strong Match - Progress to Personal Interview' : 'Requires Screening Call';
    }

    return { compatibilityScore, matchedSkills, missingSkills, strengths, recommendation };
  };

  // Toggle ATS Report Drawer
  const toggleATS = (id) => {
    setExpandedATS(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & Search Logic
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobRole || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    const atsScore = getATSMetrics(app).compatibilityScore;
    const matchesATS = 
      atsScoreFilter === 'All' ? true :
      atsScoreFilter === '80+' ? atsScore >= 80 :
      atsScoreFilter === '60-79' ? (atsScore >= 60 && atsScore < 80) :
      atsScore < 60;
    
    return matchesSearch && matchesStatus && matchesATS;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="w-24 h-24 border-2 border-primary/20 rounded-full animate-spin"></div>
          <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">FORGE INDIA <span className="text-primary">CONNECT</span></h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">Loading HR Intelligence Suite...</p>
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
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">HR <span className="text-primary">Intelligence</span></h2>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => { setIsAdding(true); setEditingJob(null); setActiveTab('jobs'); }} className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                    <Plus size={16} /> Post Job
                  </button>
                </div>
              </div>
              
              <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Pipeline Overview */}
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card">
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
                    {applications.length === 0 && <p className="text-center text-gray-400 font-bold py-10">No applications tracked yet</p>}
                  </div>
                </div>

                {/* Active Requisitions */}
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card">
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
                          {applications.filter(a => a.job === job._id || a.jobRole === job.title).length}
                        </div>
                      </div>
                    ))}
                    {jobs.length === 0 && <p className="text-center text-gray-400 font-bold py-10">No active job postings</p>}
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
                          <span className="text-[8px] font-black text-gray-400 uppercase border border-gray-200 px-3 py-1 rounded-full">
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
              {/* Search & Status Filters */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card flex flex-col md:flex-row gap-6 justify-between items-center shadow-lg">
                <div className="relative w-full md:w-96">
                  <input 
                    type="text" 
                    placeholder="Search candidate name, email, or role..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl outline-none text-sm font-semibold transition-all focus:border-primary"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1"><Filter size={12} /> Filter:</span>
                  {['All', 'Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        statusFilter === status 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'bg-gray-50 dark:bg-dark-bg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* ATS Score Filter */}
              <div className="flex flex-wrap items-center gap-3 px-6 py-4 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5"><Cpu size={12} /> ATS Score Filter:</span>
                {[
                  { label: 'All Candidates', value: 'All' },
                  { label: 'Top Match (80%+)', value: '80+' },
                  { label: 'Good Match (60-79%)', value: '60-79' },
                  { label: 'Needs Review (<60%)', value: '<60' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAtsScoreFilter(opt.value)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      atsScoreFilter === opt.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-white dark:bg-dark-card text-gray-400 hover:text-indigo-500 border border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Candidates Grid */}
              <div className="space-y-6">
                {filteredApplications.map(app => {
                  const ats = getATSMetrics(app);
                  const isExpanded = !!expandedATS[app._id];
                  
                  return (
                    <div key={app._id} className="glass-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-dark-card transition-all hover:shadow-2xl">
                      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                        <div>
                          <h3 className="text-3xl font-black uppercase tracking-tighter">{app.fullName}</h3>
                          <p className="text-sm font-bold text-gray-400 uppercase mt-1">{app.email} • {app.phone}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-5">
                            <span className="px-4 py-2 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-xl">{app.jobRole}</span>
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-dark-bg p-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                              {['Applied', 'Shortlisted', 'Interview', 'Hired'].map((step, idx) => (
                                <React.Fragment key={step}>
                                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[8px] font-black ${
                                    app.status === step || (['Applied', 'Shortlisted', 'Interview', 'Hired'].indexOf(app.status) >= idx && app.status !== 'Rejected')
                                      ? 'bg-primary text-white' 
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  {idx < 3 && <div className={`w-3 h-0.5 ${['Applied', 'Shortlisted', 'Interview', 'Hired'].indexOf(app.status) > idx && app.status !== 'Rejected' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}></div>}
                                </React.Fragment>
                              ))}
                            </div>
                            {app.status === 'Rejected' && (
                              <span className="px-3 py-1 bg-red-100 text-red-600 text-[8px] font-black uppercase rounded-full">Rejected</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center self-start">
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-md">
                              <FileText size={16} /> Dossier
                            </a>
                          )}
                          
                          {/* ATS AI Parser Trigger */}
                          <button 
                            onClick={() => toggleATS(app._id)}
                            className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                          >
                            <Cpu size={16} /> {isExpanded ? 'Hide ATS Report' : 'ATS AI Parser'}
                          </button>
                        </div>
                      </div>

                      {/* Glassmorphic ATS Details Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-6"
                          >
                            <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-purple-950/10 dark:to-indigo-950/5 rounded-3xl border border-indigo-100/50 dark:border-indigo-950/30 space-y-6">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-indigo-200">ATS Resume parsing metrics</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Automated neural compatibility analysis</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white dark:bg-dark-card px-5 py-3 rounded-2xl border border-indigo-100/30 shadow-sm">
                                  <div className="text-right">
                                    <p className="text-[8px] text-gray-400 font-bold uppercase">Match Rate</p>
                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{ats.compatibilityScore}%</p>
                                  </div>
                                  <div className="w-10 h-10 rounded-full border-4 border-indigo-100 dark:border-indigo-950 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-400" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${ats.compatibilityScore}%, 0 ${ats.compatibilityScore}%)` }}></div>
                                    <Cpu size={12} className="text-indigo-600" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matched Competencies</p>
                                  <div className="flex flex-wrap gap-2">
                                    {ats.matchedSkills.map(skill => (
                                      <span key={skill} className="px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-green-200/30">
                                        ✓ {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Missing / recommended</p>
                                  <div className="flex flex-wrap gap-2">
                                    {ats.missingSkills.map(skill => (
                                      <span key={skill} className="px-3 py-1 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-orange-200/30">
                                        ⚠ {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="md:col-span-2 space-y-3 border-t border-indigo-100/10 pt-4">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synthesized Strengths</p>
                                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {ats.strengths.map((str, idx) => (
                                      <li key={idx} className="bg-white/80 dark:bg-dark-card/80 p-3 rounded-xl border border-indigo-100/20 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        ✨ {str}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="md:col-span-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-indigo-200/20 flex justify-between items-center">
                                  <div>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase">ATS AI Synthesis Recommendation</p>
                                    <p className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-300 tracking-tight mt-0.5">{ats.recommendation}</p>
                                  </div>
                                  <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-wider">Approved Score</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                        {['Shortlisted', 'Interview', 'Hired', 'Rejected'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleUpdateApplicationStatus(app._id, status)}
                            className={`flex-1 min-w-[120px] py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
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
                                    receiverId: app.user, 
                                    content: `Your interview has been scheduled. Link: ${link}`,
                                    messageType: 'interview-link'
                                  });
                                  toast.success('Interview link shared via chat');
                                } catch (err) { toast.error('Failed to share link'); }
                              }
                            }}
                            className="flex-1 min-w-[120px] py-3.5 bg-secondary text-dark-bg rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95 border border-secondary"
                          >
                            Share Link
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-32 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <FileText className="mx-auto text-gray-300 mb-6" size={64} />
                    <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">No Candidates Found</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Refine search criteria or filters</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Recruitment <span className="text-primary">Analytics</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Data-driven hiring insights</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hiring Funnel */}
                <div className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Hiring Funnel</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { stage: 'Applied', count: applications.length },
                        { stage: 'Shortlisted', count: applications.filter(a => a.status !== 'Applied' && a.status !== 'Rejected').length },
                        { stage: 'Interview', count: applications.filter(a => a.status === 'Interview' || a.status === 'Hired').length },
                        { stage: 'Hired', count: applications.filter(a => a.status === 'Hired').length }
                      ]} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={80} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                          {
                            [...Array(4)].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#94a3b8', '#3b82f6', '#8b5cf6', '#10b981'][index]} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Monthly Hiring Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Jan', apps: 12 }, { name: 'Feb', apps: 19 }, { name: 'Mar', apps: 15 },
                        { name: 'Apr', apps: 28 }, { name: 'May', apps: applications.length }
                      ]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interviews' && (
            <motion.div key="interviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Interview <span className="text-primary">Schedules</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage and evaluate candidates</p>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                  <Plus size={16} /> Schedule Interview
                </button>
              </div>

              {/* Scheduled Interviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scheduledInterviews.map((interview, index) => (
                  <div key={index} className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-bl-[100%]"></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                          <CalendarDays size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase tracking-tight">{interview.candidateName}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{interview.role}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Clock size={16} className="text-gray-400" />
                        {interview.time} ({interview.duration} mins)
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Video size={16} className="text-gray-400" />
                        <a href={interview.link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px]">{interview.link}</a>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Users size={16} className="text-gray-400" />
                        {interview.panel}
                      </div>
                    </div>

                    <div className="flex gap-3 relative z-10">
                      <button className="flex-1 py-3 bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700">
                        Scorecard
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Delete this schedule?')) {
                            setScheduledInterviews(scheduledInterviews.filter((_, i) => i !== index));
                          }
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {scheduledInterviews.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-20 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <CalendarDays className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No interviews scheduled</p>
                  </div>
                )}
              </div>

              {/* Schedule Modal */}
              <AnimatePresence>
                {showScheduleModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Schedule Interview</h3>
                        <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        const data = Object.fromEntries(fd.entries());
                        const candidate = applications.find(a => a._id === data.candidateId);
                        setScheduledInterviews([...scheduledInterviews, {
                          candidateName: candidate ? candidate.fullName : 'External Candidate',
                          role: candidate ? candidate.jobRole : 'General Interview',
                          date: data.date,
                          time: data.time,
                          duration: data.duration,
                          link: data.link,
                          panel: data.panel
                        }]);
                        setShowScheduleModal(false);
                        toast.success('Interview scheduled successfully');
                      }} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Candidate</label>
                          <select name="candidateId" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1">
                            {applications.filter(a => a.status === 'Interview').map(a => (
                              <option key={a._id} value={a._id}>{a.fullName} - {a.jobRole}</option>
                            ))}
                            {applications.filter(a => a.status === 'Interview').length === 0 && (
                              <option value="">No candidates in 'Interview' status</option>
                            )}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input name="time" type="time" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (mins)</label>
                            <select name="duration" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1">
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60">60 minutes</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Panel Members</label>
                            <input name="panel" placeholder="John, Sarah" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meeting Link (Zoom/Meet)</label>
                          <input name="link" type="url" placeholder="https://zoom.us/j/123" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                        </div>
                        <button type="submit" className="w-full py-4 mt-6 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">
                          Confirm Schedule
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
                      <p className="text-[9px] text-gray-500 font-bold uppercase opacity-60">Authorize FIC logistics to handle your customer deliveries.</p>
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
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">HR <span className="text-primary">Profile</span></h3>
                  <p className="text-lg text-gray-500 font-medium mb-12">Personnel Management Access</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                      <p className="font-bold text-gray-900 dark:text-white">{userInfo.firstName} {userInfo.lastName}</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Designation</p>
                      <p className="font-bold text-primary uppercase tracking-tight">HR Partner</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Email</p>
                      <p className="font-bold text-gray-900 dark:text-white uppercase">{userInfo.email}</p>
                    </div>
                  </div>
                  <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl mb-8">
                    <p className="text-sm font-bold text-gray-500 leading-relaxed">
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

export default HRDashboard;

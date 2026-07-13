import React, { useState, useEffect } from 'react';
import { 
 Users, BookOpen, Video, 
 Upload, ClipboardList, Settings,
 ChevronRight, TrendingUp, User, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LectureManager from '../components/admin/LectureManager';
import MaterialSharingComponent from '../components/ui/MaterialSharingComponent';
import DashboardLayout from '../components/layout/DashboardLayout';
import MembershipUpgradeWidget from '../components/ui/MembershipUpgradeWidget';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [batches, setBatches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchRes, candidateRes] = await Promise.all([
        api.get('/training/trainer/batches').catch(() => ({ data: [] })),
        api.get('/training/trainer/candidates').catch(() => ({ data: [] }))
      ]);
      setBatches(batchRes.data);
      setCandidates(candidateRes.data);
    } catch (err) {
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    try {
      await api.post('/training/batches', { ...payload, trainer: userInfo._id });
      toast.success('Cohort created successfully!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to create cohort');
    }
  };

  const handleGenerateCertificate = async (candidateId, batchId) => {
    try {
      toast.loading('Generating Certificate...', { id: 'cert' });
      // In a real app, this would hit a PDF generation endpoint
      await api.post('/training/trainer/certificates', { candidateId, batchId });
      toast.success('Certificate Generated Successfully!', { id: 'cert' });
    } catch (err) {
      toast.error('Failed to generate certificate', { id: 'cert' });
    }
  };

  const stats = [
    { label: 'Total Students', value: candidates.length, icon: Users, color: 'text-teal-500', trend: '+12%' },
    { label: 'Active Batches', value: batches.length, icon: BookOpen, color: 'text-blue-500', trend: 'Stable' },
    { label: 'Total Lectures', value: '45', icon: Video, color: 'text-purple-500', trend: '+5' },
    { label: 'Completion Rate', value: '88%', icon: TrendingUp, color: 'text-green-500', trend: '+2.4%' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} themeColor="primary">
      {/* ── Overview ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-gradient-to-br from-teal-500/5 to-transparent">
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter text-gray-900 dark:text-white">Trainer Overview</h3>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-10">Real-time educational metrics</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-8 bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                  <stat.icon size={28} className={`${stat.color} mb-6`} />
                  <h4 className="text-4xl font-black mb-1">{stat.value}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Batches / Cohorts ─────────────────────────────────── */}
      {activeTab === 'batches' && (
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">My Cohorts</h3>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Active Training Batches</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-teal-500 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
              >
                + Create Cohort
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {batches.map(batch => (
                <div key={batch._id} className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-teal-500/30 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-xl mb-1 uppercase tracking-tight">{batch.batchId}</h4>
                      <p className="text-xs text-gray-500 font-bold">{batch.title}</p>
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-teal-600 dark:bg-teal-500/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {batch.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Domain</span>
                      <span className="font-bold">{batch.domain}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Duration</span>
                      <span className="font-bold">{batch.startDate} to {batch.endDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Students</span>
                      <span className="font-bold text-teal-500">{batch.enrolledCandidates?.length || 0}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800">
                    Manage Cohort
                  </button>
                </div>
              ))}
              {batches.length === 0 && (
                <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                  <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active batches assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Lectures ─────────────────────────────────────────── */}
      {activeTab === 'lectures' && (
        <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <LectureManager isTrainer={true} />
        </div>
      )}

      {/* ── Upload Content ─────────────────────────────────────── */}
      {activeTab === 'upload' && (
        <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
           <MaterialSharingComponent />
        </div>
      )}

      {/* ── Students & Certificates ──────────────────────────────── */}
      {activeTab === 'students' && (
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
            <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">Student Roster</h3>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-8">Generate Certificates & Track Progress</p>
            
            <div className="mobile-table-scroll">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Student', 'Batch ID', 'Progress', 'Status', 'Action'].map(h => (
                      <th key={h} className="pb-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {candidates.map(student => (
                    <tr key={student._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-white">{student.candidateName || student.firstName}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 pr-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {student.enrolledBatch?.batchId || 'N/A'}
                      </td>
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500" style={{ width: '85%' }} />
                          </div>
                          <span className="text-[10px] font-black text-teal-500">85%</span>
                        </div>
                      </td>
                      <td className="py-5 pr-4">
                        <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-500/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Active
                        </span>
                      </td>
                      <td className="py-5">
                        <button 
                          onClick={() => handleGenerateCertificate(student._id, student.enrolledBatch?._id)}
                          className="px-4 py-2 bg-primary/10 text-primary font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Award size={14} /> Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500 uppercase tracking-widest font-bold text-xs">
                        No candidates found in your batches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Settings ─────────────────────────────────────────── */}
      {activeTab === 'subscription' && (
        <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <MembershipUpgradeWidget userInfo={userInfo} />
        </div>
      )}

      {/* ── Settings ─────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Account <span className="text-teal-500">Configurations</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Profile Visibility</label>
              <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold uppercase tracking-tight">Public Trainer Profile</p>
                <div className="w-12 h-6 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" /></div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Notification Signal</label>
              <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold uppercase tracking-tight">Push Alerts</p>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-800 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-gray-600 rounded-full shadow-md" /></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── Create Cohort Modal ─────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={() => setShowCreateModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter">Deploy New Cohort</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Initialize a new training cycle</p>
            
            <form onSubmit={handleCreateCohort} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Batch ID</label>
                <input name="batchId" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-teal-500 outline-none transition-all" placeholder="e.g. FIC-REACT-2026-01" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input name="title" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-teal-500 outline-none transition-all" placeholder="e.g. Advanced Frontend Mastery" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                  <input name="startDate" type="date" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-teal-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                  <input name="endDate" type="date" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-teal-500 outline-none transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-teal-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                Initialize Mission
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrainerDashboard;

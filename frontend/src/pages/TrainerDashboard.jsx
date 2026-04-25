import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
    Users, BookOpen, ClipboardList, Clock, 
    MessageCircle, Share2, Search, Filter,
    CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ChatComponent from '../components/ui/ChatComponent';
import MaterialSharingComponent from '../components/ui/MaterialSharingComponent';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (activeTab === 'students') fetchAllStudents();
    }, [activeTab]);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/training/trainer/batches');
            setBatches(data);
        } catch (err) {
            toast.error('Failed to fetch batches');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStudents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/training/trainer/candidates');
            setCandidates(data);
        } catch (err) {
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalBatches: batches.length,
        totalCandidates: batches.reduce((acc, b) => acc + (b.enrolledCandidates?.length || 0), 0),
        pendingReviews: 8,
        activeHours: '120+'
    };

    return (
        <DashboardLayout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            themeColor="secondary"
        >
            <div className="space-y-10">
                {/* Header Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Assigned Batches', val: stats.totalBatches, icon: BookOpen, color: 'text-secondary' },
                        { label: 'Active Learners', val: stats.totalCandidates, icon: Users, color: 'text-secondary' },
                        { label: 'Assignments', val: stats.pendingReviews, icon: ClipboardList, color: 'text-secondary' },
                        { label: 'Total Hours', val: stats.activeHours, icon: Clock, color: 'text-secondary' }
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                <s.icon size={18} className={s.color} />
                            </div>
                            <h3 className={`text-4xl font-black ${s.color} tracking-tight`}>{s.val}</h3>
                        </div>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="transition-all duration-500">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-10">
                                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                        <Clock className="text-secondary" /> Active Teaching Schedule
                                    </h3>
                                    <div className="space-y-4">
                                        {batches.map(batch => (
                                            <div key={batch._id} className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-secondary transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <BookOpen size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black uppercase tracking-tight text-gray-900 dark:text-white">{batch.course?.title}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{batch.batchId} • {batch.timing}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-xl font-black text-gray-900 dark:text-white">{batch.enrolledCandidates?.length}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Students</p>
                                                    </div>
                                                    <button onClick={() => setActiveTab('batches')} className="px-6 py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-all">Manage</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-secondary text-white">
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-6">Quick Actions</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Broadcast Message', icon: MessageCircle, tab: 'chat' },
                                            { label: 'Share Materials', icon: Share2, tab: 'materials' },
                                            { label: 'View All Students', icon: Users, tab: 'students' }
                                        ].map((action, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setActiveTab(action.tab)}
                                                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <action.icon size={18} />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{action.label}</span>
                                                </div>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'batches' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {batches.map(batch => (
                                <div key={batch._id} className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-lg group hover:border-secondary transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8">
                                        <BookOpen size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">{batch.course?.title}</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">{batch.batchId} • {batch.timing}</p>
                                    
                                    <div className="flex items-center justify-between pt-8 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] font-black">ST</div>)}
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-secondary text-white flex items-center justify-center text-[8px] font-black">+{batch.enrolledCandidates?.length - 3}</div>
                                        </div>
                                        <button onClick={() => { setActiveTab('chat'); }} className="text-secondary font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                            Batch Chat <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Candidate Directory</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage and track student progress</p>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input placeholder="Search candidate..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-secondary transition-all" />
                                    </div>
                                    <button className="p-3 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-secondary"><Filter size={18} /></button>
                                </div>
                            </div>
                            
                            <div className="mobile-table-scroll">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            {['Candidate Info', 'Assigned Batch', 'Progress', 'Attendance', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {candidates.map(student => (
                                            <tr key={student._id} className="group hover:bg-gray-50/50 dark:hover:bg-dark-bg/50 transition-colors">
                                                <td className="py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                                            {student.candidateName.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{student.candidateName}</p>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        {student.enrolledBatch?.batchId || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-secondary" style={{ width: '65%' }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-black">65%</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-[10px] font-black text-green-500">92%</td>
                                                <td className="py-6">
                                                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">ACTIVE</span>
                                                </td>
                                                <td className="py-6">
                                                    <button className="p-2 text-gray-400 hover:text-secondary transition-colors"><MessageCircle size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <ChatComponent />
                    )}

                    {activeTab === 'materials' && (
                        <MaterialSharingComponent />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TrainerDashboard;

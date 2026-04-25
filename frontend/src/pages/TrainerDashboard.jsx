import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Users, BookOpen, ClipboardList, CheckCircle2, Clock, Upload } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBatches();
    }, []);

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

    const stats = {
        totalBatches: batches.length,
        totalCandidates: batches.reduce((acc, b) => acc + (b.enrolledCandidates?.length || 0), 0),
        pendingReviews: 12, // Mock
        upcomingSessions: 3 // Mock
    };

    return (
        <DashboardLayout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            themeColor="secondary"
        >
            {activeTab === 'overview' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Assigned Batches</p>
                            <h3 className="text-4xl font-black text-secondary">{stats.totalBatches}</h3>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Students</p>
                            <h3 className="text-4xl font-black text-secondary">{stats.totalCandidates}</h3>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pending Assignments</p>
                            <h3 className="text-4xl font-black text-secondary">{stats.pendingReviews}</h3>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Today's Sessions</p>
                            <h3 className="text-4xl font-black text-secondary">{stats.upcomingSessions}</h3>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Clock className="text-secondary" /> Ongoing Schedule
                        </h3>
                        <div className="space-y-4">
                            {batches.map(batch => (
                                <div key={batch._id} className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
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
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enrolled</p>
                                        </div>
                                        <button className="px-6 py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-all">Manage Batch</button>
                                    </div>
                                </div>
                            ))}
                            {batches.length === 0 && <p className="text-center py-10 text-gray-400 font-bold italic">No active batches assigned.</p>}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'batches' && (
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                     <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                         <BookOpen className="text-secondary" /> My Training Batches
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {batches.map(batch => (
                            <div key={batch._id} className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 group hover:border-secondary transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                                        <GraduationCap size={28} />
                                    </div>
                                    <span className="px-4 py-1.5 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-full">{batch.status}</span>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight mb-2">{batch.course?.title}</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{batch.batchId} • {batch.timing}</p>
                                <div className="flex justify-between items-center pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span className="text-sm font-bold">{batch.enrolledCandidates?.length} Students</span>
                                    </div>
                                    <button className="text-secondary font-black uppercase text-[10px] tracking-widest hover:underline">View Batch</button>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <Users className="text-secondary" /> Candidate Management
                    </h3>
                    <div className="mobile-table-scroll">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    {['Candidate', 'Batch', 'Attendance', 'Progress', 'Status'].map(h => (
                                        <th key={h} className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                <tr className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-black text-xs">JD</div>
                                            <div>
                                                <p className="font-bold text-sm">John Doe</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Web Dev Student</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 text-xs font-bold">FIC-WD-001</td>
                                    <td className="py-6 text-xs font-black text-green-500">92%</td>
                                    <td className="py-6">
                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-secondary" style={{ width: '65%' }}></div>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <ClipboardList className="text-secondary" /> Training Assignments
                        </h3>
                        <button className="px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">Create New</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                             <h4 className="font-black uppercase text-sm mb-2">Frontend Project 1</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">React Hooks & State</p>
                             <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-black text-secondary">8 Submissions</span>
                                 <button className="text-[9px] font-black uppercase tracking-widest hover:underline">Grade Now</button>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TrainerDashboard;

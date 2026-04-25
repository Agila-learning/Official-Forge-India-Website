import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Users, BookOpen, Video, 
    Upload, ClipboardList, Settings, Bell, 
    LogOut, Search, Plus, Filter, ChevronRight,
    TrendingUp, Clock, CheckCircle2, AlertCircle,
    MoreVertical, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LectureManager from '../components/admin/LectureManager';
import ChatComponent from '../components/ui/ChatComponent';
import MaterialSharingComponent from '../components/ui/MaterialSharingComponent';

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const [batchRes, candidateRes] = await Promise.all([
                api.get('/training/trainer/batches'),
                api.get('/training/trainer/candidates')
            ]);
            setBatches(batchRes.data);
            setCandidates(candidateRes.data);
        } catch (err) {
            toast.error('Failed to sync dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const stats = [
        { label: 'Total Students', value: candidates.length, icon: Users, color: 'text-teal-500', trend: '+12%' },
        { label: 'Active Batches', value: batches.length, icon: BookOpen, color: 'text-blue-500', trend: 'Stable' },
        { label: 'Total Lectures', value: '45', icon: Video, color: 'text-purple-500', trend: '+5' },
        { label: 'Completion Rate', value: '88%', icon: TrendingUp, color: 'text-green-500', trend: '+2.4%' }
    ];

    const sidebarItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'batches', icon: BookOpen, label: 'My Batches' },
        { id: 'lectures', icon: Video, label: 'Lectures' },
        { id: 'upload', icon: Upload, label: 'Upload Content' },
        { id: 'students', icon: Users, label: 'Students' },
        { id: 'assignments', icon: ClipboardList, label: 'Assignments' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-[#F9FAFB] flex font-poppins antialiased">
            {/* Sidebar */}
            <aside className="w-80 bg-[#111827] border-r border-gray-800 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Rocket className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-xl uppercase tracking-tighter italic">FIC <span className="text-teal-500">Trainer</span></h2>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Education Console</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-teal-500/10 text-teal-500 border-l-4 border-teal-500 shadow-xl shadow-teal-500/5' : 'text-gray-500 hover:bg-[#1F2937] hover:text-gray-300'}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-10 space-y-4">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <LogOut size={18} />
                        Logout Signal
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <header className="h-24 bg-[#111827]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-12 sticky top-0 z-50">
                    <div className="flex items-center gap-6">
                        <div className="w-1 h-8 bg-teal-500 rounded-full" />
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">{activeTab.replace('-', ' ')}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-3 bg-[#1F2937] text-gray-400 rounded-xl hover:text-teal-500 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full" />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-800" />
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right">
                                <p className="text-xs font-black uppercase leading-none mb-1">{userInfo.firstName} {userInfo.lastName}</p>
                                <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Expert Trainer</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center font-black text-white p-[2px]">
                                <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
                                    {userInfo.firstName?.[0]}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12 max-w-[1600px] mx-auto w-full space-y-12">
                    {/* Viewport Sections */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'overview' && (
                            <div className="space-y-12">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {stats.map((s, i) => (
                                        <div key={i} className="bg-[#111827] p-8 rounded-[2.5rem] border border-gray-800 shadow-sm hover:scale-[1.02] transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-4 bg-gray-900 rounded-2xl ${s.color}`}>
                                                    <s.icon size={24} />
                                                </div>
                                                <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{s.trend}</span>
                                            </div>
                                            <h3 className="text-4xl font-black mb-1">{s.value}</h3>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Active Batches Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 bg-[#111827] p-10 rounded-[3rem] border border-gray-800 shadow-xl">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Ongoing <span className="text-teal-500">Batches</span></h3>
                                            <button onClick={() => setActiveTab('batches')} className="text-teal-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">View All <ChevronRight size={14}/></button>
                                        </div>
                                        <div className="space-y-4">
                                            {batches.slice(0, 3).map(batch => (
                                                <div key={batch._id} className="p-6 bg-[#0B1120] rounded-3xl border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-teal-500/50 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                                                            <BookOpen size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-gray-100 uppercase tracking-tight">{batch.course?.title}</h4>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{batch.batchId} • {batch.timing}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-center">
                                                            <p className="text-xl font-black">{batch.enrolledCandidates?.length || 0}</p>
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Students</p>
                                                        </div>
                                                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-teal-500 w-[65%]" />
                                                        </div>
                                                        <button className="p-3 bg-[#1F2937] text-gray-400 rounded-xl hover:text-teal-500 transition-all"><MoreVertical size={16}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {batches.length === 0 && (
                                                <div className="py-12 text-center text-gray-500">
                                                    <p className="font-black uppercase text-xs tracking-widest italic">No active batches assigned.</p>
                                                    <button onClick={() => setActiveTab('batches')} className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Create Batch</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-[#111827] p-10 rounded-[3rem] border border-gray-800 shadow-xl">
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Recent Activities</h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Lecture Published', time: '2h ago', icon: Video, color: 'text-purple-500' },
                                                { label: 'New Assignment', time: '5h ago', icon: ClipboardList, color: 'text-teal-500' },
                                                { label: 'Student Enrolled', time: '1d ago', icon: User, color: 'text-blue-500' }
                                            ].map((act, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className={`w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                                                        <act.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase tracking-widest">{act.label}</p>
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{act.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'batches' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {batches.map(batch => (
                                    <div key={batch._id} className="bg-[#111827] p-10 rounded-[3.5rem] border border-gray-800 shadow-xl hover:border-teal-500 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                                        <div className="w-16 h-16 bg-gray-900 text-teal-500 rounded-2xl flex items-center justify-center mb-8 border border-gray-800">
                                            <BookOpen size={32} />
                                        </div>
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{batch.course?.title}</h4>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">{batch.batchId} • {batch.timing}</p>
                                        
                                        <div className="space-y-4 mb-10">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Course Progress</p>
                                                <p className="text-[10px] font-black text-teal-500">65%</p>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-teal-500 w-[65%]" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-8 border-t border-gray-800/50">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#111827] bg-gray-800 flex items-center justify-center text-[8px] font-black text-gray-400 uppercase">ST</div>)}
                                                <div className="w-8 h-8 rounded-full border-2 border-[#111827] bg-teal-500 text-white flex items-center justify-center text-[8px] font-black">+{batch.enrolledCandidates?.length || 0}</div>
                                            </div>
                                            <button onClick={() => setActiveTab('students')} className="text-teal-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-all">Track <ChevronRight size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                {batches.length === 0 && (
                                    <div className="md:col-span-3 py-24 bg-[#111827] rounded-[3rem] border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-center">
                                        <BookOpen size={48} className="text-gray-700 mb-6" />
                                        <h4 className="text-xl font-black text-gray-500 uppercase tracking-tighter mb-4">No batches created yet</h4>
                                        <button className="px-10 py-5 bg-teal-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-teal-500/20">Create Your First Batch</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'lectures' && <LectureManager />}

                        {activeTab === 'students' && (
                            <div className="bg-[#111827] p-10 rounded-[3rem] border border-gray-800 shadow-2xl">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Learner <span className="text-teal-500">Directory</span></h3>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1 italic">Track performance and attendance</p>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-72">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                            <input placeholder="Search candidate..." className="w-full pl-10 pr-4 py-3 bg-[#0B1120] border border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-teal-500 transition-all text-white" />
                                        </div>
                                        <button className="p-3 bg-[#1F2937] border border-gray-800 rounded-xl text-gray-500 hover:text-teal-500"><Filter size={18} /></button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-800/50">
                                                {['Candidate Identity', 'Academic Batch', 'Learning Progress', 'Engagement', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className="pb-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800/30">
                                            {candidates.map(student => (
                                                <tr key={student._id} className="group hover:bg-[#0B1120]/50 transition-all">
                                                    <td className="py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center font-black text-xs uppercase border border-teal-500/20">
                                                                {student.candidateName.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-sm uppercase tracking-tight text-white">{student.candidateName}</p>
                                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{student.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{student.enrolledBatch?.batchId || 'N/A'}</td>
                                                    <td className="py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                                <div className="h-full bg-teal-500" style={{ width: '75%' }} />
                                                            </div>
                                                            <span className="text-[10px] font-black text-teal-500">75%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-8 text-[11px] font-black text-green-500">Active</td>
                                                    <td className="py-8">
                                                        <span className="px-4 py-1.5 bg-teal-500/10 text-teal-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20">ENROLLED</span>
                                                    </td>
                                                    <td className="py-8">
                                                        <button className="p-3 bg-[#1F2937] text-gray-500 hover:text-teal-500 rounded-xl transition-all"><ChevronRight size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {candidates.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="py-20 text-center text-gray-600 uppercase tracking-widest font-black text-xs italic">No candidates found in your batches.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'upload' && <MaterialSharingComponent />}

                        {activeTab === 'assignments' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="md:col-span-3 py-24 bg-[#111827] rounded-[3rem] border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-center">
                                    <ClipboardList size={48} className="text-gray-700 mb-6" />
                                    <h4 className="text-xl font-black text-gray-500 uppercase tracking-tighter mb-4">No assignments published</h4>
                                    <button className="px-10 py-5 bg-teal-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-teal-500/20">Create New Assignment</button>
                                </div>
                             </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-[#111827] p-10 rounded-[3rem] border border-gray-800">
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Account <span className="text-teal-500">Configurations</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Profile Visibility</label>
                                        <div className="flex items-center justify-between p-6 bg-[#0B1120] rounded-3xl border border-gray-800">
                                            <p className="text-sm font-bold uppercase tracking-tight">Public Trainer Profile</p>
                                            <div className="w-12 h-6 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Notification Signal</label>
                                        <div className="flex items-center justify-between p-6 bg-[#0B1120] rounded-3xl border border-gray-800">
                                            <p className="text-sm font-bold uppercase tracking-tight">Push Alerts</p>
                                            <div className="w-12 h-6 bg-gray-800 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full shadow-md" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrainerDashboard;

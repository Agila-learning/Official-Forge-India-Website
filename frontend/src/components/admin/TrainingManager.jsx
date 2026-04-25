import React, { useState, useEffect } from 'react';
import { 
    Plus, Edit, Trash2, Users, Calendar, 
    BookOpen, GraduationCap, CheckCircle2, XCircle, Clock 
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TrainingManager = () => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [activeSubTab, setActiveSubTab] = useState('courses');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, bRes, uRes] = await Promise.all([
                api.get('/training/courses'),
                api.get('/training/batches').catch(() => ({ data: [] })),
                api.get('/users').then(res => ({ data: res.data.filter(u => u.role === 'Trainer') }))
            ]);
            setCourses(cRes.data);
            setBatches(bRes.data);
            setTrainers(uRes.data);
        } catch (err) {
            toast.error('Failed to fetch training data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                {['courses', 'batches', 'trainers'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveSubTab(tab)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-primary'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeSubTab === 'courses' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Course Catalog</h3>
                        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                            <Plus size={14} /> Add New Course
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course._id} className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-primary"><Edit size={16} /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black uppercase tracking-tight mb-2">{course.title}</h4>
                                <p className="text-xs text-gray-500 mb-6 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">₹{course.price}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSubTab === 'batches' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Active Batches</h3>
                        <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                            <Plus size={14} /> Create Batch
                        </button>
                    </div>

                    <div className="mobile-table-scroll">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="pb-6">Batch ID</th>
                                    <th className="pb-6">Course</th>
                                    <th className="pb-6">Trainer</th>
                                    <th className="pb-6">Schedule</th>
                                    <th className="pb-6">Capacity</th>
                                    <th className="pb-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {batches.map(batch => (
                                    <tr key={batch._id} className="text-sm">
                                        <td className="py-6 font-black uppercase text-[10px]">{batch.batchId}</td>
                                        <td className="py-6 font-bold">{batch.course?.title}</td>
                                        <td className="py-6">{batch.trainer?.firstName} {batch.trainer?.lastName}</td>
                                        <td className="py-6 text-[10px] font-bold text-gray-500">{batch.timing}</td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden w-20">
                                                    <div className="h-full bg-primary" style={{ width: `${(batch.enrolledCandidates?.length / batch.capacity) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black">{batch.enrolledCandidates?.length}/{batch.capacity}</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${batch.status === 'Ongoing' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {batch.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingManager;

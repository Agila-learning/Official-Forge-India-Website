import React, { useState, useEffect } from 'react';
import { 
    Plus, Edit, Trash2, Users, Calendar, 
    BookOpen, GraduationCap, CheckCircle2, XCircle, Clock, X, Send, MapPin, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TrainingManager = () => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [activeSubTab, setActiveSubTab] = useState('courses');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('course'); // 'course' or 'batch'

    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        category: 'Web Development',
        duration: '',
        fees: '',
        roadmap: [{ step: '', description: '' }],
        syllabus: [{ module: '', topics: [''] }]
    });

    const [batchForm, setBatchForm] = useState({
        course: '',
        trainer: '',
        batchId: '',
        capacity: 30,
        timing: '',
        startDate: '',
        endDate: ''
    });

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

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            // Slug generation - more robust
            const slug = courseForm.title.toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            
            await api.post('/training/courses', { ...courseForm, slug });
            toast.success('Course added successfully!');
            setShowModal(false);
            setCourseForm({
                title: '',
                description: '',
                category: 'Web Development',
                duration: '',
                fees: '',
                roadmap: [{ step: '', description: '' }],
                syllabus: [{ module: '', topics: [''] }]
            });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add course');
        }
    };

    const handleAddBatch = async (e) => {
        e.preventDefault();
        try {
            await api.post('/training/batches', batchForm);
            toast.success('Batch created successfully!');
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create batch');
        }
    };

    const addRoadmapStep = () => {
        setCourseForm({ ...courseForm, roadmap: [...courseForm.roadmap, { step: '', description: '' }] });
    };

    const addSyllabusModule = () => {
        setCourseForm({ ...courseForm, syllabus: [...courseForm.syllabus, { module: '', topics: [''] }] });
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
                        <button 
                            onClick={() => { setModalType('course'); setShowModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">₹{course.fees}</span>
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
                        <button 
                            onClick={() => { setModalType('batch'); setShowModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
                        >
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

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md z-[2000]" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[90vh] bg-white dark:bg-dark-card z-[2001] rounded-[3rem] shadow-3xl overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">{modalType === 'course' ? 'Add New Course' : 'Create New Batch'}</h3>
                                <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-bg rounded-2xl text-gray-400 hover:text-red-500"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {modalType === 'course' ? (
                                    <form onSubmit={handleAddCourse} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                                                <input required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="form-input !rounded-2xl py-4" placeholder="Full Stack Development" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                                                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="form-input !rounded-2xl py-4">
                                                    {['Web Development', 'App Development', 'Cloud Engineer', 'Full Stack Development', 'UI/UX Design', 'Digital Marketing', 'Software Testing', 'DevOps Basics', 'Data Analytics Basics'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</label>
                                                <input required value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} className="form-input !rounded-2xl py-4" placeholder="6 Months" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fees (₹)</label>
                                                <input required type="number" value={courseForm.fees} onChange={e => setCourseForm({...courseForm, fees: e.target.value})} className="form-input !rounded-2xl py-4" placeholder="25000" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                            <textarea required value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="form-input !rounded-2xl py-4 h-32" placeholder="Describe the course..." />
                                        </div>
                                        
                                        {/* Roadmap Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-black uppercase tracking-widest">Roadmap Steps</h4>
                                                <button type="button" onClick={addRoadmapStep} className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-1"><Plus size={14}/> Add Step</button>
                                            </div>
                                            {courseForm.roadmap.map((step, idx) => (
                                                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                                    <input placeholder="Step Title" value={step.step} onChange={e => {
                                                        const newRoadmap = [...courseForm.roadmap];
                                                        newRoadmap[idx].step = e.target.value;
                                                        setCourseForm({...courseForm, roadmap: newRoadmap});
                                                    }} className="form-input !rounded-xl" />
                                                    <input placeholder="Short Description" value={step.description} onChange={e => {
                                                        const newRoadmap = [...courseForm.roadmap];
                                                        newRoadmap[idx].description = e.target.value;
                                                        setCourseForm({...courseForm, roadmap: newRoadmap});
                                                    }} className="form-input !rounded-xl" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Syllabus Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-black uppercase tracking-widest">Course Syllabus</h4>
                                                <button type="button" onClick={addSyllabusModule} className="text-secondary font-black text-[10px] uppercase tracking-widest flex items-center gap-1"><Plus size={14}/> Add Module</button>
                                            </div>
                                            {courseForm.syllabus.map((s, idx) => (
                                                <div key={idx} className="space-y-3 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                                    <input placeholder="Module Name (e.g. Introduction to React)" required value={s.module} onChange={e => {
                                                        const newSyllabus = [...courseForm.syllabus];
                                                        newSyllabus[idx].module = e.target.value;
                                                        setCourseForm({...courseForm, syllabus: newSyllabus});
                                                    }} className="form-input !rounded-xl" />
                                                    <input placeholder="Topics (comma separated)" value={s.topics.join(', ')} onChange={e => {
                                                        const newSyllabus = [...courseForm.syllabus];
                                                        newSyllabus[idx].topics = e.target.value.split(',').map(t => t.trim());
                                                        setCourseForm({...courseForm, syllabus: newSyllabus});
                                                    }} className="form-input !rounded-xl text-xs" />
                                                </div>
                                            ))}
                                        </div>

                                        <button type="submit" className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm">Save Course</button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleAddBatch} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Course</label>
                                                <select required value={batchForm.course} onChange={e => setBatchForm({...batchForm, course: e.target.value})} className="form-input !rounded-2xl py-4">
                                                    <option value="">Select Course</option>
                                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assign Trainer</label>
                                                <select required value={batchForm.trainer} onChange={e => setBatchForm({...batchForm, trainer: e.target.value})} className="form-input !rounded-2xl py-4">
                                                    <option value="">Select Trainer</option>
                                                    {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch ID</label>
                                                <input required value={batchForm.batchId} onChange={e => setBatchForm({...batchForm, batchId: e.target.value})} className="form-input !rounded-2xl py-4" placeholder="FIC-WEB-001" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timing</label>
                                                <input required value={batchForm.timing} onChange={e => setBatchForm({...batchForm, timing: e.target.value})} className="form-input !rounded-2xl py-4" placeholder="10 AM - 12 PM" />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-6 bg-secondary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm">Create Batch</button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrainingManager;

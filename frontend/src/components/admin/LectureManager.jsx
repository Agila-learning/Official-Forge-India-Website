import React, { useState, useEffect } from 'react';
import { Upload, Video, FileText, Plus, Trash2, Globe, Lock, Play, Download, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LectureManager = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [newLecture, setNewLecture] = useState({
        title: '',
        description: '',
        type: 'Video',
        url: ''
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) fetchLectures();
    }, [selectedBatch]);

    const fetchBatches = async () => {
        try {
            const { data } = await api.get('/training/trainer/batches');
            setBatches(data);
            if (data.length > 0) setSelectedBatch(data[0]._id);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLectures = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/training/lectures/batch/${selectedBatch}`);
            setLectures(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return;

        setLoading(true);
        try {
            await api.post('/training/lectures', {
                ...newLecture,
                batchId: selectedBatch
            });
            toast.success('Lecture uploaded successfully!');
            setShowUpload(false);
            setNewLecture({ title: '', description: '', type: 'Video', url: '' });
            fetchLectures();
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const deleteLecture = async (id) => {
        if (!window.confirm('Delete this lecture?')) return;
        try {
            await api.delete(`/training/lectures/${id}`);
            toast.success('Lecture deleted');
            fetchLectures();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Lecture Management</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Organize your course content</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="px-6 py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-teal-500 transition-all shadow-sm"
                    >
                        {batches.map(b => <option key={b._id} value={b._id}>{b.batchId} - {b.course?.title}</option>)}
                    </select>
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#06B6D4] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-105 transition-all"
                    >
                        <Plus size={14} /> Add Lecture
                    </button>
                </div>
            </div>

            {showUpload && (
                <div className="p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4">
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lecture Title</label>
                            <input required value={newLecture.title} onChange={e => setNewLecture({...newLecture, title: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none focus:border-teal-500 transition-all" placeholder="e.g. Introduction to React Hooks" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Content Type</label>
                            <select value={newLecture.type} onChange={e => setNewLecture({...newLecture, type: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none focus:border-teal-500 transition-all">
                                <option>Video</option>
                                <option>PDF</option>
                                <option>Note</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Content URL (Cloudinary / Video Link)</label>
                            <input required value={newLecture.url} onChange={e => setNewLecture({...newLecture, url: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none focus:border-teal-500 transition-all" placeholder="https://res.cloudinary.com/..." />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brief Description</label>
                            <textarea value={newLecture.description} onChange={e => setNewLecture({...newLecture, description: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none focus:border-teal-500 transition-all h-24" placeholder="What will students learn in this session?" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <button type="submit" disabled={loading} className="flex-1 py-5 bg-[#06B6D4] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-teal-500/20 hover:-translate-y-1 transition-all">
                                {loading ? 'Processing Content...' : 'Publish Lecture'}
                            </button>
                            <button type="button" onClick={() => setShowUpload(false)} className="px-10 py-5 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-100 transition-all">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lectures.map((lecture, idx) => (
                    <div key={lecture._id} className="group p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center group-hover:bg-teal-500/10 group-hover:text-teal-500 transition-all duration-500">
                                {lecture.type === 'Video' ? <Video size={28} /> : <FileText size={28} />}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => deleteLecture(lecture._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                                <a href={lecture.url} target="_blank" rel="noreferrer" className="p-3 text-gray-300 hover:text-[#06B6D4] hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-all">
                                    {lecture.type === 'Video' ? <Play size={16} /> : <Download size={16} />}
                                </a>
                            </div>
                        </div>
                        <h4 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight mb-2 truncate">{lecture.title}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${lecture.type === 'Video' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                            {lecture.type} Session • {new Date(lecture.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 italic">{lecture.description || 'No description provided.'}</p>
                    </div>
                ))}
                
                {lectures.length === 0 && !loading && (
                    <div className="md:col-span-3 py-24 bg-gray-50/50 dark:bg-dark-bg/30 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-bg rounded-3xl flex items-center justify-center text-gray-300 mb-6">
                            <Video size={32} />
                        </div>
                        <h4 className="text-xl font-black text-gray-400 uppercase tracking-tighter mb-2">No lectures uploaded yet</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Start by adding your first educational session</p>
                        <button 
                            onClick={() => setShowUpload(true)}
                            className="px-8 py-4 bg-[#06B6D4] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20"
                        >
                            Upload Lecture
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LectureManager;

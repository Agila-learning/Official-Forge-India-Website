import React, { useState, useEffect } from 'react';
import { Upload, FileText, Video, Code, MoreVertical, Plus, Trash2, Download } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MaterialSharingComponent = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        type: 'Note',
        description: '',
        file: null
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) fetchMaterials();
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

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/training/materials/batch/${selectedBatch}`);
            setMaterials(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newMaterial.file || !selectedBatch) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', newMaterial.file);
            const { data: fileUrl } = await api.post('/upload', formData);

            await api.post('/training/materials', {
                batch: selectedBatch,
                title: newMaterial.title,
                type: newMaterial.type,
                description: newMaterial.description,
                url: fileUrl
            });

            toast.success('Material shared successfully!');
            setShowUpload(false);
            setNewMaterial({ title: '', type: 'Note', description: '', file: null });
            fetchMaterials();
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const deleteMaterial = async (id) => {
        if (!window.confirm('Delete this material?')) return;
        try {
            await api.delete(`/training/materials/${id}`);
            toast.success('Material deleted');
            fetchMaterials();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Note': return <FileText size={20} className="text-blue-500" />;
            case 'Recording': return <Video size={20} className="text-red-500" />;
            case 'Code': return <Code size={20} className="text-purple-500" />;
            default: return <FileText size={20} className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Course Materials</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Share content with your batches</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="px-6 py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-secondary"
                    >
                        {batches.map(b => <option key={b._id} value={b._id}>{b.batchId} - {b.course?.title}</option>)}
                    </select>
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
                    >
                        <Plus size={14} /> Upload Content
                    </button>
                </div>
            </div>

            {showUpload && (
                <div className="p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl animate-in slide-in-from-top-4">
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                            <input required value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} className="form-input !rounded-2xl" placeholder="Week 1 - React Fundamentals" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content Type</label>
                            <select value={newMaterial.type} onChange={e => setNewMaterial({...newMaterial, type: e.target.value})} className="form-input !rounded-2xl">
                                <option>Note</option>
                                <option>Recording</option>
                                <option>Code</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} className="form-input !rounded-2xl h-24" placeholder="Briefly describe the content..." />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select File</label>
                            <input required type="file" onChange={e => setNewMaterial({...newMaterial, file: e.target.files[0]})} className="form-input !rounded-2xl" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <button type="submit" disabled={loading} className="flex-1 py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-[10px]">
                                {loading ? 'Uploading...' : 'Publish to Batch'}
                            </button>
                            <button type="button" onClick={() => setShowUpload(false)} className="px-8 py-4 bg-gray-50 dark:bg-dark-bg rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(item => (
                    <div key={item._id} className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center">
                                {getIcon(item.type)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => deleteMaterial(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                <a href={item.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-secondary transition-colors"><Download size={16} /></a>
                            </div>
                        </div>
                        <h4 className="font-black uppercase tracking-tight mb-1 text-gray-900 dark:text-white truncate">{item.title}</h4>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">{item.type} • Shared on {new Date(item.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2">{item.description}</p>
                    </div>
                ))}
                {materials.length === 0 && !loading && (
                    <div className="md:col-span-3 text-center py-20 bg-gray-50 dark:bg-dark-bg/30 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <p className="text-gray-400 font-bold italic">No materials shared with this batch yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialSharingComponent;

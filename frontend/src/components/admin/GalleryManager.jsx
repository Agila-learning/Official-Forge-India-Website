import React, { useState } from 'react';
import { Upload, X, Trash2, Edit, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const GalleryManager = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Industrial Visits', description: '', displayOrder: 0, isActive: true });
  const [editingId, setEditingId] = useState(null);
  const gallery = data.gallery || [];

  const CATEGORIES = ['Industrial Visits', 'Internships', 'Company Achievements', 'Placement Achievements'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.imageUrl;

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = uploadRes.data.url;
        if (imageUrl.startsWith('/')) imageUrl = `${api.defaults.baseURL}${imageUrl}`;
      }

      if (!imageUrl && !editingId) {
        toast.error('Image is required');
        setLoading(false);
        return;
      }

      const payload = { ...form, imageUrl };

      if (editingId) {
        const res = await api.put(`/gallery/${editingId}`, payload);
        setData(prev => ({ ...prev, gallery: prev.gallery.map(g => g._id === editingId ? res.data : g) }));
        toast.success('Gallery item updated');
      } else {
        const res = await api.post('/gallery', payload);
        setData(prev => ({ ...prev, gallery: [res.data, ...prev.gallery] }));
        toast.success('Gallery item added');
      }
      
      resetForm();
    } catch (error) {
      toast.error('Failed to save gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setData(prev => ({ ...prev, gallery: prev.gallery.filter(g => g._id !== id) }));
      toast.success('Gallery item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      category: item.category,
      description: item.description || '',
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false,
      imageUrl: item.imageUrl
    });
    setFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', category: 'Industrial Visits', description: '', displayOrder: 0, isActive: true });
    setFile(null);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-black mb-6">{editingId ? 'Edit Image' : 'Add New Image'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Category *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Image {editingId ? '(Optional to replace)' : '*'}</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              {form.imageUrl && !file && (
                <div className="mt-2 text-sm text-slate-500">Current Image: <a href={form.imageUrl} target="_blank" className="text-primary hover:underline">View</a></div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={e => setForm({...form, displayOrder: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>

            <div className="flex items-center mt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="font-bold text-slate-700">Active (Visible to public)</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
              {loading ? 'Saving...' : (editingId ? 'Update Image' : 'Add Image')}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-black mb-6">Gallery Images</h2>
        {gallery.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No images found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(item => (
              <div key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {!item.isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded">Hidden</div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded tracking-wider">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1 truncate">{item.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-500 font-medium">Order: {item.displayOrder}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 bg-slate-100 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-slate-100 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;

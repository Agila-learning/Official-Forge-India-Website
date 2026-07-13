import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyFeedManager = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ type: 'Company Photo', title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchUpdates(); }, []);

  const fetchUpdates = async () => {
    try {
      const { data } = await api.get('/company-updates');
      setUpdates(data);
    } catch (err) {
      toast.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile && formData.type !== 'CEO Update') return toast.error('Please select an image');
    
    setUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const { data } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = data;
      }

      await api.post('/company-updates', { ...formData, imageUrl });
      toast.success('Company update published!');
      setFormData({ type: 'Company Photo', title: '', description: '' });
      setImageFile(null);
      fetchUpdates();
    } catch (err) {
      toast.error('Failed to publish update');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try {
      await api.delete(`/company-updates/${id}`);
      toast.success('Update deleted');
      fetchUpdates();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-black mb-4">Post Company Update</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-500 mb-2 block">Update Type</label>
              <select 
                className="w-full bg-gray-50 dark:bg-gray-900 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Company Photo">Company Photo</option>
                <option value="CEO Update">CEO Update</option>
                <option value="Celebration">Celebration (Birthday/Internship)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500 mb-2 block">Title</label>
              <input 
                required
                type="text" placeholder="E.g., Happy Birthday Sandeep!"
                className="w-full bg-gray-50 dark:bg-gray-900 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-500 mb-2 block">Description</label>
            <textarea 
              rows="3" placeholder="Write a short caption..."
              className="w-full bg-gray-50 dark:bg-gray-900 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary resize-none"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-500 mb-2 block">Media (Image)</label>
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary cursor-pointer transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
              {imageFile ? (
                <span className="font-bold text-primary">{imageFile.name}</span>
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2" size={24} />
                  <span className="font-medium">Click to upload photo</span>
                </div>
              )}
            </label>
          </div>

          <button disabled={uploading} className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50">
            {uploading ? 'Publishing...' : 'Publish Update'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading updates...</p> : updates.map(update => (
          <motion.div key={update._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {update.imageUrl && <img src={update.imageUrl} alt={update.title} className="w-full h-48 object-cover" />}
            <div className="p-5">
              <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded mb-2">{update.type}</span>
              <h4 className="font-bold text-lg mb-1 line-clamp-1">{update.title}</h4>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{update.description}</p>
              <button onClick={() => handleDelete(update._id)} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyFeedManager;

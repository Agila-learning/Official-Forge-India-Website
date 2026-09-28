import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, XCircle, Save, Package } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AtomyManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Atomy',
    description: '',
    shortDescription: '',
    image: '',
    additionalImages: '', // comma separated strings
    price: 0,
    discountPrice: 0,
    sku: '',
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
    externalUrl: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', { params: { category: 'Atomy' } });
      let data = res.data.products || res.data || [];
      // If the backend doesn't filter by category accurately for some reason:
      data = data.filter(p => p.category === 'Atomy');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load Atomy products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, category: 'Atomy' };
      if (formData._id) {
        await api.put(`/products/${formData._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const openForm = (prod = null) => {
    if (prod) {
      setFormData({
        _id: prod._id,
        name: prod.name || '',
        category: 'Atomy',
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        image: prod.image || '',
        additionalImages: prod.additionalImages ? prod.additionalImages.join(', ') : '',
        price: prod.price || 0,
        discountPrice: prod.discountPrice || 0,
        sku: prod.sku || '',
        isActive: prod.isActive ?? true,
        isFeatured: prod.isFeatured ?? false,
        displayOrder: prod.displayOrder || 0,
        externalUrl: prod.externalUrl || ''
      });
    } else {
      setFormData({
        name: '', category: 'Atomy', description: '', shortDescription: '',
        image: '', additionalImages: '', price: 0, discountPrice: 0,
        sku: '', isActive: true, isFeatured: false, displayOrder: 0, externalUrl: ''
      });
    }
    setIsEditing(true);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (isEditing) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black">{formData._id ? 'Edit Atomy Product' : 'Add New Atomy Product'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500"><XCircle /></button>
        </div>
        
        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">SKU</label>
              <input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Offer Price (₹)</label>
              <input type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Short Description (For Cards)</label>
              <input value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Detailed Description</label>
              <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Main Image URL</label>
              <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">External Product URL (Optional)</label>
              <input value={formData.externalUrl} onChange={e => setFormData({...formData, externalUrl: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Display Order</label>
              <input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="flex flex-col gap-4 justify-center mt-6">
               <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-blue-600" /> Active Product
               </label>
               <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 accent-amber-500" /> Featured (Shows on Homepage)
               </label>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex gap-4">
             <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
                <Save size={18} /> Save Product
             </button>
             <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200">
                Cancel
             </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
         <div>
            <h2 className="text-2xl font-black flex items-center gap-2"><Package className="text-emerald-500" /> Atomy Wellness Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage physical products displayed in the Atomy section</p>
         </div>
         <button onClick={() => openForm()} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
            <Plus size={18} /> Add Product
         </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
         <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Search className="text-slate-400" size={20} />
            <input 
               type="text" 
               placeholder="Search Atomy products..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-transparent outline-none w-full font-medium"
            />
         </div>

         {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Loading products...</div>
         ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No products found.</div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
                        <th className="pb-4 font-black">Product</th>
                        <th className="pb-4 font-black">Price</th>
                        <th className="pb-4 font-black">Status</th>
                        <th className="pb-4 font-black text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredProducts.map(prod => (
                        <tr key={prod._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                           <td className="py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                    {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-3 text-slate-300" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-900">{prod.name}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">SKU: {prod.sku || 'N/A'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 font-bold">₹{prod.discountPrice || prod.price}</td>
                           <td className="py-4">
                              <div className="flex gap-2">
                                 {prod.isActive ? (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase tracking-wider">Active</span>
                                 ) : (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase tracking-wider">Inactive</span>
                                 )}
                                 {prod.isFeatured && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded uppercase tracking-wider">Featured</span>
                                 )}
                              </div>
                           </td>
                           <td className="py-4 text-right">
                              <button onClick={() => openForm(prod)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(prod._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default AtomyManager;

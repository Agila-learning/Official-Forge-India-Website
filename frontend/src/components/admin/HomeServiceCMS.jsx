import React, { useState, useEffect } from 'react';
import { 
    Layout, Image, List, CheckCircle, Star, Shield, 
    Plus, Trash2, Edit, Save, ArrowRight, Play, Server,
    Layers, Zap, MapPin, Search, Filter, Briefcase, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const HomeServiceCMS = ({ data: globalData, onUpdate: onGlobalUpdate }) => {
    const [activeSubTab, setActiveSubTab] = useState('hero');
    const [config, setConfig] = useState(null);
    const [categories, setCategories] = useState([]);
    const [workflow, setWorkflow] = useState([]);
    const [trustCards, setTrustCards] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Using individual try-catches to allow partial failure
            const fetchConfig = api.get('/home-ui-config').then(res => setConfig(res.data)).catch(() => console.warn('Hero config failed'));
            const fetchCats = api.get('/home-categories').then(res => setCategories(res.data)).catch(() => console.warn('Categories failed'));
            const fetchWorkflow = api.get('/workflow-steps').then(res => setWorkflow(res.data)).catch(() => console.warn('Workflow failed'));
            const fetchTrust = api.get('/trust-cards').then(res => setTrustCards(res.data)).catch(() => console.warn('Trust cards failed'));
            const fetchTestimonials = api.get('/testimonials').then(res => setTestimonials(res.data)).catch(() => {
                if (globalData?.testimonials) setTestimonials(globalData.testimonials);
            });

            await Promise.all([fetchConfig, fetchCats, fetchWorkflow, fetchTrust, fetchTestimonials]);
        } catch (err) {
            toast.error('Partial failure in CMS sync');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfigUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/home-ui-config', config);
            toast.success('Home UI Config updated');
        } catch (err) {
            toast.error('Failed to update config');
        }
    };

    const subTabs = [
        { id: 'hero', label: 'Hero Section', icon: Layout },
        { id: 'categories', label: 'Categories', icon: Filter },
        { id: 'sub-categories', label: 'Sub-Categories', icon: Layers },
        { id: 'standards', label: 'Standards Section', icon: Shield },
        { id: 'workflow', label: 'Workflow Steps', icon: Zap },
        { id: 'trust', label: 'Trust Section', icon: CheckCircle },
        { id: 'testimonials', label: 'Testimonials', icon: Star }
    ];

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-4">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`px-8 py-4 rounded-2xl flex items-center gap-3 whitespace-nowrap transition-all font-black text-[10px] uppercase tracking-widest ${activeSubTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white dark:bg-dark-card text-gray-500 hover:bg-gray-50'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                {activeSubTab === 'hero' && config && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Platform Infrastructure</h3>
                                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Hero Section <span className="text-primary italic">Dynamics</span></h2>
                            </div>
                        </div>

                        <form onSubmit={handleConfigUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Main Heading</label>
                                    <input 
                                        value={config.hero.title}
                                        onChange={(e) => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Highlighted Words</label>
                                    <input 
                                        value={config.hero.highlightedText}
                                        onChange={(e) => setConfig({...config, hero: {...config.hero, highlightedText: e.target.value}})}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold text-primary italic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Subtitle Protocol</label>
                                    <textarea 
                                        value={config.hero.subtitle}
                                        onChange={(e) => setConfig({...config, hero: {...config.hero, subtitle: e.target.value}})}
                                        rows="3"
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Background Media URL (YouTube/Cloudinary)</label>
                                    <input 
                                        value={config.hero.backgroundMedia}
                                        onChange={(e) => setConfig({...config, hero: {...config.hero, backgroundMedia: e.target.value}})}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">CTA Action Text</label>
                                        <input 
                                            value={config.hero.ctaText}
                                            onChange={(e) => setConfig({...config, hero: {...config.hero, ctaText: e.target.value}})}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Verified Pros Count</label>
                                        <input 
                                            type="number"
                                            value={config.hero.proCount}
                                            onChange={(e) => setConfig({...config, hero: {...config.hero, proCount: Number(e.target.value)}})}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg focus:border-primary/40 outline-none font-bold"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Sync Hero Engine
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Other Tabs content will go here... */}
                {activeSubTab === 'categories' && (
                   <CategoryManager items={categories} onUpdate={fetchData} />
                )}
                
                {activeSubTab === 'sub-categories' && (
                    <SubCategoryManager categories={categories} onUpdate={fetchData} />
                )}

                {activeSubTab === 'standards' && config && (
                    <StandardsManager config={config} setConfig={setConfig} onSave={handleConfigUpdate} />
                )}

                {activeSubTab === 'workflow' && (
                    <WorkflowManager items={workflow} onUpdate={fetchData} />
                )}

                {activeSubTab === 'trust' && (
                    <TrustManager items={trustCards} onUpdate={fetchData} />
                )}

                {activeSubTab === 'testimonials' && (
                    <TestimonialManager items={testimonials} onUpdate={fetchData} />
                )}
            </div>
        </div>
    );
};

const StandardsManager = ({ config, setConfig, onSave }) => {
    return (
        <form onSubmit={onSave} className="space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Operational <span className="text-secondary italic">Standards</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <input value={config.standards.sectionTitle} onChange={e => setConfig({...config, standards: {...config.standards, sectionTitle: e.target.value}})} className="w-full px-6 py-4 rounded-xl outline-none font-bold text-sm" placeholder="Section Title" />
                    <input value={config.standards.subtitle} onChange={e => setConfig({...config, standards: {...config.standards, subtitle: e.target.value}})} className="w-full px-6 py-4 rounded-xl outline-none font-bold text-sm" placeholder="Subtitle" />
                    <textarea value={config.standards.description} onChange={e => setConfig({...config, standards: {...config.standards, description: e.target.value}})} rows="3" className="w-full px-6 py-4 rounded-xl outline-none font-bold text-sm" placeholder="Description"></textarea>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <input value={config.standards.comparisonBefore} onChange={e => setConfig({...config, standards: {...config.standards, comparisonBefore: e.target.value}})} placeholder="Before Image URL" className="px-5 py-4 rounded-xl outline-none font-bold text-xs" />
                        <input value={config.standards.comparisonAfter} onChange={e => setConfig({...config, standards: {...config.standards, comparisonAfter: e.target.value}})} placeholder="After Image URL" className="px-5 py-4 rounded-xl outline-none font-bold text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <input value={config.standards.labelBefore} onChange={e => setConfig({...config, standards: {...config.standards, labelBefore: e.target.value}})} placeholder="Before Label" className="px-5 py-4 rounded-xl outline-none font-bold text-xs italic" />
                        <input value={config.standards.labelAfter} onChange={e => setConfig({...config, standards: {...config.standards, labelAfter: e.target.value}})} placeholder="After Label" className="px-5 py-4 rounded-xl outline-none font-bold text-xs italic" />
                    </div>
                </div>
            </div>
            <button type="submit" className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs">Verify Standards Protocol</button>
        </form>
    );
};

const WorkflowManager = ({ items, onUpdate }) => {
    const [newItem, setNewItem] = useState({ stepNumber: '', title: '', description: '', order: 0 });

    const handleCreate = async () => {
        try {
            await api.post('/workflow-steps', newItem);
            toast.success('Workflow step deployed');
            onUpdate();
            setNewItem({ stepNumber: '', title: '', description: '', order: 0 });
        } catch (err) {
            toast.error('Deployment failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/workflow-steps/${id}`);
            onUpdate();
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Precision <span className="text-primary italic">Workflow</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-3xl">
                <input placeholder="Step (01)" value={newItem.stepNumber} onChange={e => setNewItem({...newItem, stepNumber: e.target.value})} className="px-5 py-4 rounded-xl" />
                <input placeholder="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="px-5 py-4 rounded-xl" />
                <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="px-5 py-4 rounded-xl col-span-2" />
                <button onClick={handleCreate} className="px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Add Step</button>
            </div>
            <div className="space-y-4">
                {items.map(step => (
                    <div key={step._id} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-gray-100 italic">
                        <div className="flex gap-10 items-center">
                            <span className="text-2xl font-black text-primary">{step.stepNumber}</span>
                            <span className="font-black text-lg uppercase tracking-tighter">{step.title}</span>
                        </div>
                        <button onClick={() => handleDelete(step._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TrustManager = ({ items, onUpdate }) => {
    const [newItem, setNewItem] = useState({ title: '', val: '', icon: 'ShieldCheck', order: 0 });

    const handleCreate = async () => {
        try {
            await api.post('/trust-cards', newItem);
            toast.success('Trust card authorized');
            onUpdate();
            setNewItem({ title: '', val: '', icon: 'ShieldCheck', order: 0 });
        } catch (err) {
            toast.error('Authorization failed');
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Trust <span className="text-primary italic">Signals</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 rounded-3xl">
                <input placeholder="Title (e.g. Verified Pros)" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="px-5 py-4 rounded-xl" />
                <input placeholder="Value (e.g. 100% Checked)" value={newItem.val} onChange={e => setNewItem({...newItem, val: e.target.value})} className="px-5 py-4 rounded-xl" />
                <button onClick={handleCreate} className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Add Card</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {items.map(card => (
                    <div key={card._id} className="p-8 bg-white border border-gray-100 rounded-3xl text-center">
                        <h4 className="font-black uppercase tracking-tighter italic mb-2">{card.title}</h4>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.val}</span>
                        <button onClick={async () => { await api.delete(`/trust-cards/${card._id}`); onUpdate(); }} className="mt-4 text-red-500 hover:text-red-700 block mx-auto"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TestimonialManager = ({ items, onUpdate }) => {
    const handleApproval = async (id, status) => {
        try {
            await api.put(`/testimonials/${id}`, { isApproved: status });
            toast.success(status ? 'Testimonial approved' : 'Decommissioned');
            onUpdate();
        } catch (err) {
            toast.error('Protocol failure');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete data permanently?')) return;
        try {
            await api.delete(`/testimonials/${id}`);
            onUpdate();
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Customer <span className="text-secondary italic">Intelligence</span></h2>
            <div className="grid grid-cols-1 gap-6">
                {items.map(t => (
                    <div key={t._id} className={`p-8 rounded-[2.5rem] border transition-all ${t.isApproved ? 'bg-white border-primary/20 shadow-xl' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary uppercase">{t.name[0]}</div>
                                <div>
                                    <h4 className="font-black text-lg italic uppercase">{t.name}</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.location} • {t.serviceType}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleApproval(t._id, !t.isApproved)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${t.isApproved ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {t.isApproved ? 'Decommission' : 'Authorize'}
                                </button>
                                <button onClick={() => handleDelete(t._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <p className="text-sm font-medium italic text-gray-600 dark:text-gray-400 leading-relaxed">"{t.content}"</p>
                    </div>
                ))}
                {items.length === 0 && <div className="py-20 text-center font-black text-gray-400 italic">No intelligence metrics available</div>}
            </div>
        </div>
    );
};

const CategoryManager = ({ items, onUpdate }) => {
    const [newItem, setNewItem] = useState({ name: '', slug: '', order: 0, isActive: true });

    const handleCreate = async () => {
        try {
            await api.post('/home-categories', newItem);
            toast.success('Category authorized');
            onUpdate();
            setNewItem({ name: '', slug: '', order: 0, isActive: true });
        } catch (err) {
            toast.error('Authorization failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Decommission this vertical?')) return;
        try {
            await api.delete(`/home-categories/${id}`);
            onUpdate();
        } catch (err) {
            toast.error('Decommissioning failed');
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Service <span className="text-primary italic">Verticals</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="px-5 py-4 rounded-xl outline-none font-bold text-sm" />
                <input placeholder="Slug" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} className="px-5 py-4 rounded-xl outline-none font-bold text-sm" />
                <input type="number" placeholder="Sort Order" value={newItem.order} onChange={e => setNewItem({...newItem, order: Number(e.target.value)})} className="px-5 py-4 rounded-xl outline-none font-bold text-sm" />
                <button onClick={handleCreate} className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Add Vertical</button>
            </div>
            
            <div className="space-y-4">
                {items.map(cat => (
                    <div key={cat._id} className="flex justify-between items-center p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex gap-10 items-center">
                            <span className="text-[10px] font-black text-gray-400">#{cat.order}</span>
                            <span className="font-black italic uppercase text-lg">{cat.name}</span>
                            <span className="text-xs text-gray-500 font-bold tracking-widest">{cat.slug}</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(cat._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SubCategoryManager = ({ categories, onUpdate }) => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', slug: '', categoryId: '', flowType: 'Slot-Only', description: '', order: 0 });
    const [loading, setLoading] = useState(false);

    const fetchSubCats = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/home-categories/sub');
            setItems(data);
        } catch (err) { toast.error('Failed to load sub-categories'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSubCats(); }, []);

    const handleCreate = async () => {
        if (!newItem.categoryId) return toast.error('Select a parent category');
        try {
            await api.post('/home-categories/sub', newItem);
            toast.success('Sub-category deployed');
            fetchSubCats();
            setNewItem({ name: '', slug: '', categoryId: '', flowType: 'Slot-Only', description: '', order: 0 });
        } catch (err) { toast.error('Deployment failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Decommission this sub-vertical?')) return;
        try {
            await api.delete(`/home-categories/sub/${id}`);
            fetchSubCats();
        } catch (err) { toast.error('Decommissioning failed'); }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Hierarchical <span className="text-primary italic">Sub-Verticals</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="px-4 py-3 rounded-xl outline-none font-bold text-xs" />
                <input placeholder="Slug" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} className="px-4 py-3 rounded-xl outline-none font-bold text-xs" />
                <select value={newItem.categoryId} onChange={e => setNewItem({...newItem, categoryId: e.target.value})} className="px-4 py-3 rounded-xl outline-none font-bold text-xs">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <select value={newItem.flowType} onChange={e => setNewItem({...newItem, flowType: e.target.value})} className="px-4 py-3 rounded-xl outline-none font-bold text-xs">
                    <option value="Slot-Only">Slot Only</option>
                    <option value="BHK-Based">BHK Based</option>
                    <option value="Sqft-Based">Sqft Based</option>
                    <option value="Count-Based">Count Based</option>
                </select>
                <input type="number" placeholder="Order" value={newItem.order} onChange={e => setNewItem({...newItem, order: Number(e.target.value)})} className="px-4 py-3 rounded-xl outline-none font-bold text-xs" />
                <button onClick={handleCreate} className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] py-3">Deploy</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? <div className="text-center py-10 animate-pulse text-[10px] font-black uppercase">Syncing Registry...</div> : 
                 items.map(sub => (
                    <div key={sub._id} className="flex justify-between items-center p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap gap-8 items-center">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400">PARENT CATEGORY</span>
                                <span className="font-black uppercase text-xs text-primary">{sub.categoryId?.name || 'Unmapped'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400">SUB-VERTICAL</span>
                                <span className="font-black italic uppercase text-lg leading-tight">{sub.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400">FLOW PROTOCOL</span>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sub.flowType === 'BHK-Based' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{sub.flowType}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(sub._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeServiceCMS;

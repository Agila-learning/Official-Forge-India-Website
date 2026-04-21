import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Settings, BarChart2, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ServiceBuilder = ({ initialConfig = { steps: [], miniServices: [] }, initialPricing = {}, onSave }) => {
    const [config, setConfig] = useState(initialConfig);
    const [pricing, setPricing] = useState(initialPricing);
    const [activeTab, setActiveTab] = useState('flow'); // 'flow' | 'pricing' | 'mini'

    const addStep = () => {
        const newStep = {
            id: `step_${Date.now()}`,
            title: 'New Selection Phase',
            fields: []
        };
        setConfig({ ...config, steps: [...config.steps, newStep] });
    };

    const removeStep = (stepId) => {
        setConfig({ ...config, steps: config.steps.filter(s => s.id !== stepId) });
    };

    const addField = (stepId) => {
        const fieldId = `field_${Date.now()}`;
        const newField = {
            id: fieldId,
            label: 'New Question',
            type: 'radio', // radio | dropdown | number | range
            options: [],
            required: true,
            condition: null // { field: 'otherFieldId', value: 'someValue' }
        };
        setConfig({
            ...config,
            steps: config.steps.map(s => s.id === stepId ? { ...s, fields: [...s.fields, newField] } : s)
        });
    };

    const updateField = (stepId, fieldId, updates) => {
        setConfig({
            ...config,
            steps: config.steps.map(s => s.id === stepId ? {
                ...s,
                fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
            } : s)
        });
    };

    const removeField = (stepId, fieldId) => {
        setConfig({
            ...config,
            steps: config.steps.map(s => s.id === stepId ? {
                ...s,
                fields: s.fields.filter(f => f.id !== fieldId)
            } : s)
        });
    };

    const addMiniService = () => {
        const newMini = {
            id: `mini_${Date.now()}`,
            label: 'New Add-on',
            price: 0,
            hasQty: false
        };
        setConfig({ ...config, miniServices: [...config.miniServices, newMini] });
    };

    const updateMiniService = (id, updates) => {
        setConfig({
            ...config,
            miniServices: config.miniServices.map(m => m.id === id ? { ...m, ...updates } : m)
        });
    };

    const removeMiniService = (id) => {
        setConfig({ ...config, miniServices: config.miniServices.filter(m => m.id !== id) });
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                {[
                    { id: 'flow', label: 'Service Flow', icon: Layers },
                    { id: 'pricing', label: 'Pricing Logic', icon: BarChart2 },
                    { id: 'mini', label: 'Mini Services', icon: Plus }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-6 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white dark:hover:bg-dark-bg ${
                            activeTab === tab.id ? 'bg-white dark:bg-dark-bg text-primary border-b-2 border-primary' : 'text-gray-400'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 p-8 overflow-y-auto max-h-[800px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'flow' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                            {config.steps.map((step, sIdx) => (
                                <div key={step.id} className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 relative group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                                {sIdx + 1}
                                            </div>
                                            <input
                                                value={step.title}
                                                onChange={(e) => setConfig({
                                                    ...config,
                                                    steps: config.steps.map(s => s.id === step.id ? { ...s, title: e.target.value } : s)
                                                })}
                                                className="bg-transparent font-black text-xl text-gray-900 dark:text-white outline-none border-b border-transparent focus:border-primary/30"
                                                placeholder="Flow Stage Title"
                                            />
                                        </div>
                                        <button onClick={() => removeStep(step.id)} className="text-red-500/50 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                    </div>

                                    {/* Fields in Step */}
                                    <div className="space-y-4">
                                        {step.fields.map((field) => (
                                            <div key={field.id} className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Question Label</label>
                                                            <input
                                                                value={field.label}
                                                                onChange={(e) => updateField(step.id, field.id, { label: e.target.value })}
                                                                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Input Type</label>
                                                            <select
                                                                value={field.type}
                                                                onChange={(e) => updateField(step.id, field.id, { type: e.target.value })}
                                                                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary"
                                                            >
                                                                <option value="radio">Selection Cards (Radio)</option>
                                                                <option value="dropdown">Dropdown List</option>
                                                                <option value="number">Numeric Input</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeField(step.id, field.id)} className="text-red-400 hover:text-red-500 mt-8"><Trash2 size={16} /></button>
                                                </div>

                                                {(field.type === 'radio' || field.type === 'dropdown') && (
                                                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 relative">
                                                                <input 
                                                                    type="text"
                                                                    placeholder="Type option and press enter..."
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                                                            updateField(step.id, field.id, { options: [...(field.options || []), e.target.value.trim()] });
                                                                            e.target.value = '';
                                                                        }
                                                                    }}
                                                                    className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-primary"
                                                                />
                                                                <Plus size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(field.options || []).map((opt, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg flex items-center gap-2 border border-primary/20">
                                                                    {opt}
                                                                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => updateField(step.id, field.id, { options: field.options.filter((_, idx) => idx !== i) })} />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Conditional Logic (Show If) */}
                                                <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                                    <button 
                                                        onClick={() => {
                                                            const targetField = prompt('Show IF this field ID:');
                                                            const targetValue = prompt('Has this value:');
                                                            if (targetField && targetValue) updateField(step.id, field.id, { condition: { field: targetField, value: targetValue } });
                                                        }}
                                                        className="text-[9px] font-black uppercase text-blue-500 flex items-center gap-2"
                                                    >
                                                        <Settings size={12} /> {field.condition ? `Visible if ${field.condition.field} is ${field.condition.value}` : 'Add Display Condition'}
                                                        {field.condition && <X size={10} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); updateField(step.id, field.id, { condition: null }); }} />}
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[8px] text-gray-400 uppercase">Field ID:</p>
                                                        <input 
                                                            value={field.id}
                                                            onChange={(e) => updateField(step.id, field.id, { id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                                            className="bg-transparent text-[8px] font-black text-primary uppercase outline-none w-24 border-b border-gray-100 dark:border-gray-800"
                                                        />
                                                        <p className="text-[8px] text-gray-400 uppercase ml-1 italic">(Use this in pricing/conditions)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => addField(step.id)} className="mt-6 w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                        <Plus size={16} className="inline mr-2" /> Add Selection Field
                                    </button>
                                </div>
                            ))}
                            <button onClick={addStep} className="w-full py-8 bg-primary/10 text-primary border-2 border-dashed border-primary/20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] italic text-sm hover:bg-primary/20 transition-all">
                                <Plus size={20} className="inline mr-2" /> Append New Workflow Phase
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'mini' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Mini Service <span className="text-primary">Add-ons</span></h3>
                                <button onClick={addMiniService} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Add Mini Service</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {config.miniServices.map(mini => (
                                    <div key={mini.id} className="p-6 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-3xl group">
                                        <div className="flex items-start justify-between mb-4">
                                            <input
                                                value={mini.label}
                                                onChange={(e) => updateMiniService(mini.id, { label: e.target.value })}
                                                className="bg-transparent font-black text-lg text-gray-900 dark:text-white outline-none border-b border-transparent focus:border-primary w-2/3"
                                                placeholder="Service Name"
                                            />
                                            <button onClick={() => removeMiniService(mini.id)} className="text-red-400 group-hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black uppercase text-gray-400">Fixed Base Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={mini.price}
                                                    onChange={(e) => updateMiniService(mini.id, { price: parseFloat(e.target.value) })}
                                                    className="w-full bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-xl font-bold text-sm outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 mt-5">
                                                <label className="text-[9px] font-black uppercase text-gray-400">Qty Tracker</label>
                                                <button 
                                                    onClick={() => updateMiniService(mini.id, { hasQty: !mini.hasQty })}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${mini.hasQty ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${mini.hasQty ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'pricing' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-6">
                            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                                <h3 className="text-xl font-black italic mb-2 uppercase">Advanced <span className="text-primary">Pricing Logic</span></h3>
                                <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">Map your field identifiers to specific price values. Use dot notation for nested conditions (e.g., apartment.1bhk = 1500). Square feet pricing is handled via "sqft" identifier.</p>
                                
                                <textarea
                                    className="w-full h-80 bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-3xl p-6 font-mono text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={JSON.stringify(pricing, null, 4)}
                                    onChange={(e) => {
                                        try {
                                            setPricing(JSON.parse(e.target.value));
                                        } catch (err) { /* invalid JSON */ }
                                    }}
                                    placeholder='{ "apartment": { "1bhk": 1500 }, "house": { "perSqFt": 2.5 } }'
                                />
                                <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-primary uppercase">
                                    <BarChart2 size={12} /> Live Sync Enabled
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Actions Bar */}
            <div className="p-8 bg-gray-50 dark:bg-dark-bg border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="text-xs text-gray-400 italic">
                    {activeTab === 'flow' && `Stage Count: ${config.steps.length}`}
                    {activeTab === 'mini' && `Add-ons: ${config.miniServices.length}`}
                    {activeTab === 'pricing' && `Complexity Level: ${Object.keys(pricing).length}`}
                </div>
                <button
                    onClick={() => {
                        onSave(config, pricing);
                        toast.success('Configuration Ready for Sync');
                    }}
                    className="px-10 py-5 bg-primary text-white font-black rounded-3xl uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Stabilize Service Structure
                </button>
            </div>
        </div>
    );
};

export default ServiceBuilder;

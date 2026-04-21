import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, IndianRupee } from 'lucide-react';

const SubServiceManager = ({ value = [], onChange }) => {
    const [subServices, setSubServices] = useState(Array.isArray(value) ? value : []);

    useEffect(() => {
        if (JSON.stringify(subServices) !== JSON.stringify(value)) {
            onChange(subServices);
        }
    }, [subServices, onChange, value]);

    const addSubService = () => {
        setSubServices([...subServices, { name: '', price: 0, unit: 'Flat Rate' }]);
    };

    const removeSubService = (index) => {
        setSubServices(subServices.filter((_, i) => i !== index));
    };

    const handleUpdate = (index, field, val) => {
        const updated = [...subServices];
        updated[index] = { ...updated[index], [field]: field === 'price' ? Number(val) : val };
        setSubServices(updated);
    };

    return (
        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-xl font-black uppercase tracking-tighter italic">Dynamic <span className="text-primary italic">Pricing Manager</span></h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configure service tiers and sub-offerings</p>
                </div>
                <button 
                    type="button" 
                    onClick={addSubService}
                    className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-lg shadow-primary/5"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="space-y-4">
                {subServices.map((ss, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 items-end p-6 bg-gray-50 dark:bg-dark-bg/50 rounded-3xl border border-transparent hover:border-primary/20 transition-all group">
                        <div className="flex-1 w-full">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Sub-Service Name</label>
                            <input 
                                value={ss.name} 
                                onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                                placeholder="e.g. Full Interior Painting"
                                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-dark-card border border-transparent focus:border-primary/30 outline-none font-bold text-sm"
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Base Price</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="number"
                                    value={ss.price} 
                                    onChange={(e) => handleUpdate(idx, 'price', e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white dark:bg-dark-card border border-transparent focus:border-primary/30 outline-none font-bold text-sm text-primary"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-40">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Unit/Scale</label>
                            <select 
                                value={ss.unit}
                                onChange={(e) => handleUpdate(idx, 'unit', e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-dark-card border border-transparent focus:border-primary/30 outline-none font-bold text-sm"
                            >
                                <option value="Flat Rate">Flat Rate</option>
                                <option value="Per Hour">Per Hour</option>
                                <option value="Per Sqft">Per Sqft</option>
                                <option value="Per BHK">Per BHK</option>
                                <option value="Per Unit">Per Unit</option>
                            </select>
                        </div>
                        <button 
                            type="button"
                            onClick={() => removeSubService(idx)}
                            className="p-4 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                {subServices.length === 0 && (
                    <div className="py-12 text-center bg-gray-50 dark:bg-dark-bg/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                        <Plus className="mx-auto text-gray-300 mb-4" size={40} />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Sub-Services Defined</p>
                        <p className="text-[10px] text-gray-300 font-bold mt-2 uppercase">Click + to authorize dynamic service scales</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubServiceManager;

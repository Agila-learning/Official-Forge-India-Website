import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, Info, Plus, Minus, 
  ShoppingCart, Calculator, Home, Building2, Layers, 
  Sparkles, Calendar, Clock, ArrowRight, ShieldCheck, Send, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceConfigWizard = ({ product, onAddToCart }) => {
    const { pricingRules = {}, slots = [], gstPercentage = 18 } = product;
    
    // Step Tracking: 0: PropType, 1: Condition, 2: Size, 3: Add-ons, 4: Quotation, 5: Slots, 6: Summary
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({
        propertyType: '',
        condition: '',
        size: '', // BHK for apartment
        sqft: 0   // Sqft for independent house
    });
    const [selectedMiniServices, setSelectedMiniServices] = useState([]);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    // Derived Selection Data for Clean Display
    const displaySelections = useMemo(() => {
        const list = [];
        if (selections.propertyType) list.push({ label: 'Property Type', value: selections.propertyType });
        if (selections.condition) list.push({ label: 'Condition', value: selections.condition });
        if (selections.propertyType === 'apartment' && selections.size) list.push({ label: 'Configuration', value: selections.size });
        if (selections.propertyType === 'independent house' && selections.sqft) list.push({ label: 'Area', value: `${selections.sqft} Sq.Ft` });
        return list;
    }, [selections]);

    // Pricing Calculation
    const pricing = useMemo(() => {
        let base = product.price || 0;
        try {
            if (selections.propertyType === 'apartment' && selections.size) {
                // Nested lookup
                base = pricingRules.apartment?.[selections.size] || base;
            } else if (selections.propertyType === 'independent house' && selections.sqft) {
                // Area calculation
                const perSqFt = pricingRules.house?.perSqFt || 2;
                base = selections.sqft * perSqFt;
            }
        } catch (e) { console.error('Pricing Error:', e); }

        const addonsTotal = selectedMiniServices.reduce((acc, curr) => acc + (curr.price * (curr.qty || 1)), 0);
        const subtotal = base + addonsTotal;
        const gst = (subtotal * (gstPercentage / 100));
        const total = subtotal + gst;

        return { base, addonsTotal, subtotal, gst, total };
    }, [selections, selectedMiniServices, product.price, pricingRules, gstPercentage]);

    const handleNext = () => {
        if (step === 0 && !selections.propertyType) return toast.error('Please select property type');
        if (step === 1 && !selections.condition) return toast.error('Please select property condition');
        if (step === 2 && selections.propertyType === 'apartment' && !selections.size) return toast.error('Please select BHK type');
        if (step === 2 && selections.propertyType === 'independent house' && !selections.sqft) return toast.error('Please enter square footage');
        if (step === 5 && (!bookingDate || !bookingTime)) return toast.error('Please select a service slot');
        setStep(step + 1);
    };

    const toggleMini = (mini) => {
        const isSelected = selectedMiniServices.find(m => m.id === mini.id);
        if (isSelected) {
            setSelectedMiniServices(selectedMiniServices.filter(m => m.id !== mini.id));
        } else {
            setSelectedMiniServices([...selectedMiniServices, { ...mini, qty: 1 }]);
        }
    };

    const updateMiniQty = (id, delta) => {
        setSelectedMiniServices(selectedMiniServices.map(m => 
            m.id === id ? { ...m, qty: Math.max(1, (m.qty || 1) + delta) } : m
        ));
    };

    const finalizeBooking = () => {
        const finalData = {
            selections,
            selectedMiniServices,
            slot: { date: bookingDate, time: bookingTime },
            pricing
        };
        onAddToCart(pricing.total, finalData);
    };

    const mainSteps = [
        { id: 'type', title: 'Property', icon: Building2 },
        { id: 'condition', title: 'Condition', icon: Home },
        { id: 'size', title: 'Asset Size', icon: Layers },
        { id: 'addons', title: 'Add-ons', icon: Sparkles },
        { id: 'price', title: 'Quotation', icon: Calculator },
        { id: 'slot', title: 'Schedule', icon: Calendar },
        { id: 'confirm', title: 'Pre-Book', icon: ShieldCheck }
    ];

    return (
        <div className="bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-3xl shadow-primary/10 overflow-hidden flex flex-col md:flex-row min-h-[650px]">
            {/* Left Side: Brand Confidence & Details */}
            <div className="md:w-80 bg-gray-50/50 dark:bg-white/5 border-r border-gray-100 dark:border-gray-800 p-10 flex flex-col gap-10">
                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center p-3">
                        <img src={product.image} className="w-full h-full object-cover rounded-2xl shadow-xl" alt="" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter leading-tight text-gray-900 dark:text-white">{product.name}</h4>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1 italic">{product.serviceType} Specialist</p>
                    </div>
                </div>

                {/* Dynamic Highlights from Vendor */}
                <div className="space-y-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic flex items-center gap-2">
                        <ShieldCheck size={14} className="text-primary" /> Service Standard
                    </p>
                    <div className="space-y-3">
                        {(product.highlights && product.highlights.length > 0) ? (
                            product.highlights.map((h, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white dark:bg-dark-bg p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:scale-105">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                                    <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 truncate">{h}</span>
                                </div>
                            ))
                        ) : (
                            ['Professional Staff', 'Quality Assurance', 'Best Price'].map((h, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">
                                    <Check size={12} className="text-gray-300" /> {h}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Inclusions / Exclusions Mini Panel */}
                <div className="mt-auto p-6 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest italic opacity-60">Verified Inclusion</p>
                    <div className="space-y-2">
                        {(product.whatsIncluded || ['Eco-Safe Materials', 'Post-Service Audit']).slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase">
                                <Plus size={12} className="text-secondary" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Step Wizard */}
            <div className="flex-1 flex flex-col">
                {/* Step Indicators */}
                <div className="px-10 py-8 bg-white dark:bg-dark-card border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-1">
                            {mainSteps.map((_, i) => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-card transition-all ${i <= step ? 'bg-primary scale-125' : 'bg-gray-200 dark:bg-white/10'}`} />
                            ))}
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phase <span className="text-primary italic">{step + 1} of {mainSteps.length}</span></h4>
                    </div>
                    {(step >= 2) && (
                         <div className="px-5 py-2 bg-primary/5 border border-primary/20 rounded-full flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-primary italic tracking-widest">Est. Flow:</span>
                            <span className="text-sm font-black text-primary">₹{pricing.total.toLocaleString()}</span>
                         </div>
                    )}
                </div>

                <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {/* STEP 0: PROP TYPE */}
                    {step === 0 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">Property <span className="text-primary">Selection</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'apartment', label: 'Apartment', icon: Building2, desc: 'Multiple units, shared space' },
                                    { id: 'independent house', label: 'Ind. House', icon: Home, desc: 'Standalone property' }
                                ].map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => setSelections({ ...selections, propertyType: t.id })}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 text-left group ${selections.propertyType === t.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-gray-50 dark:bg-dark-bg border-transparent'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selections.propertyType === t.id ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card text-gray-400'}`}>
                                            <t.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-[10px]">{t.label}</p>
                                            <p className="text-[9px] text-gray-400 font-bold">{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: CONDITION */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">Current <span className="text-secondary">Condition</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'furnished', label: 'Furnished', desc: 'Furniture & assets present' },
                                    { id: 'unfurnished', label: 'Unfurnished', desc: 'Empty property spaces' }
                                ].map(c => (
                                    <button 
                                        key={c.id}
                                        onClick={() => setSelections({ ...selections, condition: c.id })}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 text-left group ${selections.condition === c.id ? 'bg-secondary/5 border-secondary shadow-lg shadow-secondary/10' : 'bg-gray-50 dark:bg-dark-bg border-transparent'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selections.condition === c.id ? 'bg-secondary text-white' : 'bg-white dark:bg-dark-card text-gray-400'}`}>
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-[10px]">{c.label}</p>
                                            <p className="text-[9px] text-gray-400 font-bold">{c.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SIZE */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            {selections.propertyType === 'apartment' ? (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">BHK <span className="text-primary">Configuration</span></h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                                            <button 
                                                key={b}
                                                onClick={() => setSelections({ ...selections, size: b.toLowerCase() })}
                                                className={`py-4 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${selections.size === b.toLowerCase() ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 dark:bg-dark-bg border-transparent text-gray-400'}`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Area <span className="text-primary">Coverage</span></h3>
                                    <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                                        <div className="relative mb-6">
                                            <input 
                                                type="number"
                                                value={selections.sqft || ''}
                                                onChange={(e) => setSelections({ ...selections, sqft: parseInt(e.target.value) || 0 })}
                                                placeholder="Enter Sq.Ft Area"
                                                className="w-full bg-white dark:bg-dark-card border-none px-6 py-5 rounded-2xl font-black text-xl outline-none"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400">Sq. Ft.</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[1000, 2000, 3000, 4000].map(val => (
                                                <button 
                                                    key={val}
                                                    onClick={() => setSelections({ ...selections, sqft: val })}
                                                    className="py-3 bg-white dark:bg-dark-card rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 hover:border-primary transition-all"
                                                >
                                                    {val === 1000 ? 'Below 1000' : `${val-1000}-${val} sqft`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: ADD-ONS */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Mini <span className="text-secondary">Services</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {(product.serviceConfig?.miniServices || [
                                    { id: 'bath', label: 'Bathroom Cleaning', price: 199, hasQty: true },
                                    { id: 'fan', label: 'Fan Specialist', price: 99, hasQty: true },
                                    { id: 'chimney', label: 'Chimney Sanitization', price: 499, hasQty: false },
                                    { id: 'fridge', label: 'Fridge Deep clean', price: 299, hasQty: false }
                                ]).map(mini => (
                                    <div key={mini.id} className={`p-5 rounded-2xl border-2 flex flex-col gap-3 transition-all ${selectedMiniServices.find(m => m.id === mini.id) ? 'bg-secondary/5 border-secondary' : 'bg-gray-50 dark:bg-dark-bg border-transparent'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white">{mini.label}</p>
                                                <p className="text-[9px] font-black text-secondary">₹{mini.price}</p>
                                            </div>
                                            <button onClick={() => toggleMini(mini)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${selectedMiniServices.find(m => m.id === mini.id) ? 'bg-secondary text-white shadow-lg' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
                                                {selectedMiniServices.find(m => m.id === mini.id) ? <Check size={14} /> : <Plus size={14} />}
                                            </button>
                                        </div>
                                        {mini.hasQty && selectedMiniServices.find(m => m.id === mini.id) && (
                                            <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-2 rounded-xl border border-secondary/20">
                                                <button onClick={() => updateMiniQty(mini.id, -1)} className="p-1 hover:text-secondary"><Minus size={12} /></button>
                                                <span className="text-[10px] font-black w-6 text-center">{selectedMiniServices.find(m => m.id === mini.id).qty}</span>
                                                <button onClick={() => updateMiniQty(mini.id, 1)} className="p-1 hover:text-secondary"><Plus size={12} /></button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: QUOTATION */}
                    {step === 4 && (
                        <motion.div initial={{ opacity: 1, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-center">Service <span className="text-primary">Quotation</span></h3>
                            <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Base Computation</span>
                                        <span className="text-sm font-black">₹{pricing.base.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Eco-system Add-ons</span>
                                        <span className="text-sm font-black">₹{pricing.addonsTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2 py-4">
                                        <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em] italic">Statutory GST ({gstPercentage}%)</span>
                                        <span className="text-sm font-black text-primary">₹{pricing.gst.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-6 bg-primary/5 rounded-2xl border border-primary/20">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Final Authorization</span>
                                        <span className="text-3xl font-black text-primary italic">₹{pricing.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: SLOTS */}
                    {step === 5 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Deployment <span className="text-primary">Schedule</span></h3>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] ml-4 flex items-center gap-2 italic">
                                        <Calendar size={14} /> 1. Select Execution Date
                                    </label>
                                    <div className="relative group">
                                        <select 
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full pl-14 pr-10 py-5 bg-gray-50 dark:bg-dark-bg border-2 border-transparent focus:border-primary rounded-[1.5rem] font-black text-xs uppercase tracking-widest appearance-none outline-none transition-all shadow-sm group-hover:shadow-md"
                                        >
                                            <option value="">-- Choose Authorized Date --</option>
                                            {(product.slots?.map(s => s.date) || [
                                                new Date().toISOString().split('T')[0],
                                                new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                                new Date(Date.now() + 172800000).toISOString().split('T')[0],
                                                new Date(Date.now() + 259200000).toISOString().split('T')[0],
                                                new Date(Date.now() + 345600000).toISOString().split('T')[0]
                                            ]).map(date => (
                                                <option key={date} value={date}>
                                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                                            <Calendar size={18} />
                                        </div>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                {bookingDate && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <label className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] ml-4 flex items-center gap-2 italic">
                                            <Clock size={14} /> 2. Preferred Arrival Window
                                        </label>
                                        <div className="relative group">
                                            <select 
                                                value={bookingTime}
                                                onChange={(e) => setBookingTime(e.target.value)}
                                                className="w-full pl-14 pr-10 py-5 bg-gray-50 dark:bg-dark-bg border-2 border-transparent focus:border-secondary rounded-[1.5rem] font-black text-xs uppercase tracking-widest appearance-none outline-none transition-all shadow-sm group-hover:shadow-md"
                                            >
                                                <option value="">-- Choose Deployment Slot --</option>
                                                {(product.slots?.find(s => s.date === bookingDate)?.times || [
                                                    '09:00 AM - 12:00 PM', 
                                                    '12:00 PM - 03:00 PM', 
                                                    '03:00 PM - 06:00 PM', 
                                                    '06:00 PM - 09:00 PM'
                                                ]).map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                                                <Clock size={18} />
                                            </div>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: SUMMARY */}
                    {step === 6 && (
                        <motion.div initial={{ opacity: 1, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <div className="text-center">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">PRE-BOOK <span className="text-primary">CONFIRMATION</span></h3>
                                <div className="h-1 w-20 bg-primary mx-auto mt-2"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Service Config</p>
                                    {displaySelections.map((s, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <span className="text-[8px] font-black uppercase text-gray-400">{s.label}</span>
                                            <span className="text-[9px] font-black italic uppercase">{s.value}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl border border-primary/20">
                                        <span className="text-[8px] font-black uppercase text-primary">Schedule</span>
                                        <span className="text-[9px] font-black italic uppercase text-primary">{bookingDate} • {bookingTime.split(' - ')[0]}</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary mb-2">Ecosystem Add-ons</p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                        {selectedMiniServices.map(mini => (
                                            <div key={mini.id} className="flex justify-between items-center bg-white dark:bg-dark-card p-3 rounded-xl border-l-[3px] border-secondary shadow-sm">
                                                <span className="text-[9px] font-black">{mini.label} {mini.qty > 1 && `(x${mini.qty})`}</span>
                                                <span className="text-[9px] font-black text-secondary italic">₹{(mini.price * (mini.qty || 1)).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {selectedMiniServices.length === 0 && (
                                            <p className="py-6 text-center text-[8px] font-black uppercase text-gray-300 italic tracking-[0.2em]">Zero add-ons detected</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={finalizeBooking}
                                className="w-full p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 flex items-center justify-between hover:bg-primary/10 transition-all active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-6 transition-transform">
                                        <Send size={32} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-1 italic">Authenticated Authorization</p>
                                        <p className="text-2xl font-black italic tracking-tighter">PRE-BOOK <span className="text-gray-400">NOW</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase text-gray-400 italic mb-1">Final Payable Total</p>
                                    <p className="text-2xl font-black italic tracking-tighter text-primary">₹{pricing.total.toLocaleString()}</p>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wizard Controls */}
                <div className="mt-10 flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-8">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all disabled:opacity-0"
                    >
                        <ChevronLeft size={16} /> Back: Previous Phase
                    </button>
                    {step < 6 && (
                        <button
                            onClick={handleNext}
                            className="px-10 py-5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-full font-black uppercase tracking-widest flex items-center gap-3 hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                            {step === 4 ? 'Confirm Quotation' : 'Proceed Further'} <ArrowRight size={18} />
                        </button>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceConfigWizard;

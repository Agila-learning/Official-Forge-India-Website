import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Clock, ShieldCheck, Sparkles, Home, Building2, Ruler, Sofa, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ServiceWizard = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        propertyType: '', // 'Apartment' | 'Independent House'
        size: '', // '1BHK' | '2BHK' | '3BHK' for Apartment, 'Square Feet' for House
        sqft: '',
        isFurnished: 'Furnished',
        subServices: [],
        slot: { date: '', time: '' }
    });

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!serviceId || serviceId === 'undefined') {
                toast.error('Mission ID mismatch. Re-scanning target...');
                navigate('/home-services');
                return;
            }
            try {
                const { data } = await api.get(`/products/${serviceId}`);
                setService(data);
                setLoading(false);
            } catch (err) {
                toast.error('Failed to load mission parameters');
                navigate('/home-services');
            }
        };
        fetchServiceDetails();
    }, [serviceId, navigate]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const toggleSubService = (s) => {
        setBookingData(prev => ({
            ...prev,
            subServices: prev.subServices.some(item => item.name === s.name)
                ? prev.subServices.filter(item => item.name !== s.name)
                : [...prev.subServices, s]
        }));
    };

    const calculateTotal = () => {
        if (!service) return { subTotal: 0, gst: 0, total: 0 };
        
        let base = service.price || 0;
        
        // Dynamic additions based on property type and size
        if (bookingData.propertyType === 'Apartment') {
            if (bookingData.size === '2BHK') base += 500;
            if (bookingData.size === '3BHK') base += 1000;
            if (bookingData.size === '4BHK+') base += 1500;
        } else if (bookingData.propertyType === 'Independent House' && bookingData.sqft) {
            base += (parseInt(bookingData.sqft) * 0.5);
        }

        const subTotal = bookingData.subServices.reduce((acc, s) => acc + (s.price || 0), base);
        const gst = subTotal * (service.gstPercentage / 100 || 0.18);
        return { subTotal, gst, total: subTotal + gst };
    };

    const handleComplete = () => {
        const finalPrice = calculateTotal().total;
        toast.success(`Mission Authorized! Final Charge: ₹${finalPrice.toFixed(0)}`);
        
        // Store booking context for checkout
        const bookingInfo = {
            productId: service._id,
            name: service.name,
            totalPrice: finalPrice,
            bookingData: bookingData,
            isService: true
        };
        localStorage.setItem('fic_service_booking', JSON.stringify(bookingInfo));
        navigate('/checkout');
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Syncing Mission Specs...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20 pb-32 px-6 overflow-hidden relative">
            <div className="max-w-4xl mx-auto relative z-10">
                
                {/* Header Context */}
                <div className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Mission <span className="text-secondary italic">Configuration</span></h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Refining Specs for {service?.name}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between mb-16 relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 h-[2px] bg-secondary -translate-y-1/2 z-10 transition-all duration-1000 ease-in-out" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
                    {[
                        { s: 1, label: 'Scope' },
                        { s: 2, label: 'Scale' },
                        { s: 3, label: 'State' },
                        { s: 4, label: 'Addons' },
                        { s: 5, label: 'Time' },
                        { s: 6, label: 'Review' }
                    ].map((item) => (
                        <div key={item.s} className="relative z-20 flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${step === item.s ? 'bg-white dark:bg-dark-card border-secondary text-secondary scale-125 shadow-xl shadow-secondary/10' : step > item.s ? 'bg-secondary border-secondary text-dark-bg' : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 text-gray-400'}`}>
                                {step > item.s ? <CheckCircle2 size={18} /> : item.s}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${step === item.s ? 'text-secondary' : 'text-gray-400'}`}>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-3xl bg-white dark:bg-dark-card relative overflow-hidden min-h-[500px] flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1"
                        >
                            {step === 1 && (
                                <div className="space-y-12">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Property <span className="text-secondary italic">Deployment.</span></h2>
                                        <p className="text-gray-500 font-medium italic mt-2">Identify the architecture of the service location.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { id: 'Apartment', icon: Building2, label: 'Residential Apartment' },
                                            { id: 'Independent House', icon: Home, label: 'Independent Structure' }
                                        ].map(type => (
                                            <button 
                                                key={type.id}
                                                onClick={() => { setBookingData({...bookingData, propertyType: type.id}); nextStep(); }}
                                                className={`p-10 rounded-[3rem] border-2 group transition-all text-center ${bookingData.propertyType === type.id ? 'border-secondary bg-secondary/5' : 'border-gray-50 dark:border-dark-bg hover:border-secondary/20'}`}
                                            >
                                                <type.icon size={56} className={`mx-auto mb-6 transition-all ${bookingData.propertyType === type.id ? 'text-secondary' : 'text-gray-300 group-hover:text-secondary/50'}`} />
                                                <span className="block text-xl font-black uppercase tracking-tighter">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-12">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Unit <span className="text-secondary italic">Metrics.</span></h2>
                                        <p className="text-gray-500 font-medium italic mt-2">Specify the volumetric scale of the operation.</p>
                                    </div>
                                    {bookingData.propertyType === 'Apartment' ? (
                                        <div className="flex flex-wrap gap-4 justify-center">
                                            {['1BHK', '2BHK', '3BHK', '4BHK+'].map(val => (
                                                <button 
                                                    key={val}
                                                    onClick={() => { setBookingData({...bookingData, size: val}); nextStep(); }}
                                                    className={`px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all border-2 ${bookingData.size === val ? 'bg-secondary border-secondary text-dark-bg' : 'bg-gray-50 dark:bg-dark-bg border-transparent hover:border-secondary/30'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="max-w-md mx-auto">
                                            <div className="relative mb-8">
                                                <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                                <input 
                                                    type="number" 
                                                    placeholder="Operational Sqft (e.g. 1500)"
                                                    value={bookingData.sqft}
                                                    onChange={(e) => setBookingData({...bookingData, sqft: e.target.value})}
                                                    className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-xl"
                                                />
                                            </div>
                                            <button onClick={nextStep} disabled={!bookingData.sqft} className="w-full py-6 bg-secondary text-dark-bg rounded-[2.5rem] font-black uppercase tracking-widest disabled:opacity-20 shadow-xl shadow-secondary/10">Lock Dimension</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-12 text-center">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Condition <span className="text-secondary italic">Status.</span></h2>
                                    <div className="flex gap-8 justify-center">
                                        {[
                                            { id: 'Furnished', icon: Sofa },
                                            { id: 'Unfurnished', icon: Trash2 }
                                        ].map(c => (
                                            <button 
                                                key={c.id}
                                                onClick={() => { setBookingData({...bookingData, isFurnished: c.id}); nextStep(); }}
                                                className={`p-10 rounded-[3rem] border-2 transition-all w-48 ${bookingData.isFurnished === c.id ? 'border-secondary bg-secondary/5' : 'border-gray-50'}`}
                                            >
                                                <c.icon size={48} className="mx-auto mb-4 text-secondary" />
                                                <span className="font-black uppercase tracking-tighter">{c.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-10">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Service <span className="text-secondary italic">Config.</span></h2>
                                        <p className="text-gray-500 font-medium italic mt-2">Select additional mission parameters.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(service?.serviceConfig || []).map(s => (
                                            <label 
                                                key={s.name}
                                                className={`flex items-center justify-between p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${bookingData.subServices.some(item => item.name === s.name) ? 'border-secondary bg-secondary/5' : 'border-gray-50 dark:border-dark-bg'}`}
                                            >
                                                <div className="flex gap-4 items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={bookingData.subServices.some(item => item.name === s.name)}
                                                        onChange={() => toggleSubService(s)}
                                                        className="hidden"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-black uppercase text-xs tracking-widest leading-none">{s.name}</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">({s.unit})</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-secondary">₹{s.price}</span>
                                            </label>
                                        ))}
                                        {(service?.serviceConfig || []).length === 0 && (
                                            <div className="md:col-span-2 py-10 text-center text-gray-400 font-medium italic">
                                                No specific add-ons configured for this service.
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={nextStep} className="w-full py-6 bg-secondary text-dark-bg rounded-[2.5rem] font-black uppercase tracking-widest mt-8">Confirm Specs</button>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-12">
                                     <div className="text-center">
                                         <h2 className="text-4xl font-black uppercase tracking-tighter">Sync <span className="text-secondary italic">Schedule.</span></h2>
                                         <p className="text-gray-500 font-medium italic mt-2">Select an available execution window.</p>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div className="space-y-2 text-left px-4">
                                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Execution Date</label>
                                             <select 
                                                 value={bookingData.slot.date}
                                                 onChange={(e) => setBookingData({...bookingData, slot: { date: e.target.value, time: '' }})}
                                                 className="w-full px-8 py-5 rounded-[2rem] bg-gray-50 dark:bg-dark-bg border border-gray-100 font-black outline-none appearance-none cursor-pointer"
                                             >
                                                 <option value="">Select Date</option>
                                                 {(service?.slots || []).filter(s => s.isAvailable).map(s => (
                                                     <option key={s.date} value={s.date}>{new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</option>
                                                 ))}
                                             </select>
                                         </div>
                                         <div className="space-y-2 text-left px-4">
                                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Arrival Slot</label>
                                             <select 
                                                 value={bookingData.slot.time}
                                                 disabled={!bookingData.slot.date}
                                                 onChange={(e) => setBookingData({...bookingData, slot: {...bookingData.slot, time: e.target.value}})}
                                                 className="w-full px-8 py-5 rounded-[2rem] bg-gray-50 dark:bg-dark-bg border border-gray-100 font-black outline-none appearance-none cursor-pointer disabled:opacity-20"
                                             >
                                                 <option value="">Select Time</option>
                                                 {bookingData.slot.date && (service?.slots?.find(s => s.date === bookingData.slot.date)?.times || []).map(t => (
                                                     <option key={t} value={t}>{t}</option>
                                                 ))}
                                             </select>
                                         </div>
                                     </div>
                                     {(!service?.slots || service.slots.filter(s => s.isAvailable).length === 0) && (
                                         <div className="text-center p-8 bg-red-500/5 border border-red-500/10 rounded-3xl">
                                             <p className="text-xs font-black uppercase text-red-500">Scheduling Unavailable</p>
                                             <p className="text-[10px] text-gray-500 font-bold mt-1">No booking windows have been authorized for this mission yet. Please contact support.</p>
                                         </div>
                                     )}
                                     <button onClick={nextStep} disabled={!bookingData.slot.date || !bookingData.slot.time} className="w-full py-6 bg-secondary text-dark-bg rounded-[2.5rem] font-black uppercase tracking-widest disabled:opacity-20 mt-8 shadow-xl shadow-secondary/10">Authorize Window</button>
                                </div>
                             )}

                            {step === 6 && (
                                <div className="space-y-12">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Fulfillment <span className="text-secondary italic font-black">Ledger.</span></h2>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-dark-bg p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
                                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-400">
                                            <span>Base Protocol ({bookingData.size || bookingData.propertyType})</span>
                                            <span className="text-gray-900 dark:text-white">₹{calculateTotal().subTotal - bookingData.subServices.reduce((acc, s) => acc + (s.price || 0), 0)}</span>
                                        </div>
                                        {bookingData.subServices.map(s => (
                                            <div key={s.name} className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                                <span>{s.name}</span>
                                                <span>₹{s.price}</span>
                                            </div>
                                        ))}
                                        <div className="h-[1px] bg-gray-200 dark:bg-gray-800"></div>
                                        <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                                            <span className="text-gray-400">GST ({service?.gstPercentage || 18}%)</span>
                                            <span className="text-primary">₹{calculateTotal().gst.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-2xl font-black uppercase tracking-tighter">
                                            <span>Final Total</span>
                                            <span className="text-secondary">₹{calculateTotal().total.toFixed(0)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="flex-1 py-6 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] font-black uppercase tracking-widest text-xs">Correction</button>
                                        <button onClick={handleComplete} className="flex-[2] py-6 bg-secondary text-dark-bg rounded-[2.5rem] font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl shadow-secondary/10">Finalize Booking</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Bar (Permanent bottom) */}
                    {step > 1 && step < 6 && (
                        <div className="mt-auto pt-10 flex justify-between items-center bg-white/80 dark:bg-dark-card/80 backdrop-blur-md">
                            <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-secondary group">
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Backtrack
                            </button>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Configuration {step} of 6</div>
                        </div>
                    )}
                </div>

                {/* Floating Mission Ledger */}
                <AnimatePresence>
                    {step < 6 && (
                        <motion.div 
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[100]"
                        >
                            <div className="bg-black/90 dark:bg-dark-card/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
                                        <Sparkles className="text-dark-bg" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Configuration Total</p>
                                        <h4 className="text-xl font-black text-white italic tracking-tighter">₹{calculateTotal().total.toFixed(0)} <span className="text-[10px] font-bold text-gray-500 uppercase not-italic ml-2">(+GST)</span></h4>
                                    </div>
                                </div>
                                <button 
                                    onClick={nextStep}
                                    disabled={(step === 2 && bookingData.propertyType === 'Independent House' && !bookingData.sqft) || (step === 1 && !bookingData.propertyType) || (step === 2 && bookingData.propertyType === 'Apartment' && !bookingData.size) || (step === 5 && (!bookingData.slot.date || !bookingData.slot.time))}
                                    className="px-8 py-4 bg-secondary text-dark-bg rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center gap-2"
                                >
                                    Proceed <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Branding Context */}
                <div className="mt-12 flex justify-center gap-10 grayscale opacity-20">
                     {[ShieldCheck, Clock, CheckCircle2].map((Icon, idx) => (
                         <div key={idx} className="flex items-center gap-3">
                             <Icon size={20} />
                             <span className="text-[10px] font-black uppercase tracking-widest">FIC Secured</span>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceWizard;

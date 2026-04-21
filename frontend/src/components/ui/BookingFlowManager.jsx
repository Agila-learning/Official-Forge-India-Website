import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, ChevronRight, ChevronLeft, CheckCircle2, Zap, ShieldCheck, Home, Info, Image as ImageIcon, Settings, XCircle, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import ServiceConfigWizard from './ServiceConfigWizard';

const BookingFlowManager = ({ product, isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({ quantity: 1 });
    const [selectedSlot, setSelectedSlot] = useState({ date: '', time: '' });
    const [instructions, setInstructions] = useState('');
    const [address, setAddress] = useState({ street: '', city: '', pincode: '' });
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [totalPrice, setTotalPrice] = useState(product?.price || 0);
    const [fulfillmentType, setFulfillmentType] = useState(product?.isService ? 'Delivery Partner' : (product?.fulfillmentType || 'Direct Shopping'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // Dynamic Pricing Logic
    useEffect(() => {
        let price = product.isService ? (product.discountPrice || product.price) : (product.discountPrice || product.price) * (config.quantity || 1);
        const rules = product.pricingRules || {};

        if (product.isService) {
            if (product.serviceType === 'Cleaning') {
                if (config.bhk === '2BHK') price += (rules.bhkIncremental || 800);
                if (config.bhk === '3BHK') price += (rules.bhkIncremental || 1500) * 1.5;
                if (config.cleaningType === 'Deep Cleaning') price += (rules.deepCleaningAddon || 500);
                if (config.bathrooms > 1) price += (config.bathrooms - 1) * (rules.bathroomPrice || 300);
            } else if (product.serviceType === 'Painting') {
                if (config.area) price = config.area * (rules.pricePerSqFt || 12);
                if (config.paintType === 'Premium') price *= 1.4;
            } else if (['Plumbing', 'Electrical', 'Carpentry'].includes(product.serviceType)) {
                if (config.units > 1) price += (config.units - 1) * (rules.unitPrice || 200);
                if (config.urgency === 'Emergency') price += (rules.emergencyCharge || 300);
            }
        }

        // Add delivery charge if applicable
        if (fulfillmentType === 'Delivery Partner') {
            const charge = product.deliveryCharge || 0;
            const threshold = product.freeDeliveryThreshold || 0;
            if (threshold === 0 || price < threshold) {
                price += charge;
            }
        }

        setTotalPrice(price);
    }, [config, product, fulfillmentType]);

    if (!isOpen) return null;

    // ROLE AUTHORIZATION REINFORCEMENT
    const restrictedRoles = ['Vendor', 'Admin', 'HR'];
    const isRestricted = userInfo.role && restrictedRoles.includes(userInfo.role);

    if (isRestricted) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-dark-bg/90 backdrop-blur-xl p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white dark:bg-dark-card p-12 rounded-[3rem] border border-red-500/20 text-center max-w-md shadow-3xl"
                >
                    <XCircle size={64} className="text-red-500 mx-auto mb-8" />
                    <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter text-gray-900 dark:text-white">Access <span className="text-red-500">Denied.</span></h3>
                    <p className="text-gray-500 font-bold mb-10 leading-relaxed uppercase text-[10px] tracking-widest leading-relaxed">
                        As a {userInfo.role}, you are not authorized to book this service. Please use a Customer or Candidate account for transactional operations.
                    </p>
                    <button onClick={onClose} className="w-full py-5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Acknowledge</button>
                </motion.div>
            </motion.div>
        );
    }

    const nextStep = () => {
        // Validation per step
        if (step === 2 && product.isService && (!selectedSlot.date || !selectedSlot.time)) {
            return toast.error('Please select a preferred slot');
        }
        
        // Skip scheduling for products without slots
        if (step === 1 && !product.isService && (!product.slots || product.slots.length === 0)) {
            return setStep(3);
        }

        // Skip address for Direct Shopping (Pickup)
        if (step === 2 && fulfillmentType === 'Direct Shopping') {
            return setStep(4);
        }

        setStep(s => s + 1);
    }
    const prevStep = () => {
        if (step === 3 && !product.isService && (!product.slots || product.slots.length === 0)) {
            return setStep(1);
        }
        if (step === 4 && fulfillmentType === 'Direct Shopping') {
            return setStep(2);
        }
        setStep(s => s - 1);
    }

    const handleBooking = () => {
        if (product.isService && (!selectedSlot.date || !selectedSlot.time)) return toast.error('Selection date and time required');
        
        if (fulfillmentType === 'Delivery Partner') {
            if (!address.street) return toast.error('Street address required');
            if (!address.city) return toast.error('City name required');
            if (!/^\d{6}$/.test(address.pincode)) return toast.error('Please enter a valid 6-digit Pincode');
        }
        
        onComplete({
            product: product._id,
            config,
            slot: selectedSlot,
            address,
            totalPrice,
            fulfillmentType,
            isManualSlot: !product.slots || product.slots.length === 0,
            instructions
        });
        toast.success(product.isService ? 'Booking recorded successfully!' : 'Order placed successfully!');
        onClose();
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
           return toast.error("Geolocation is not supported by your browser");
        }
        
        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Using a free reverse geocoding API or a mock for now
                    // In production, use Google Maps Geocoding or similar
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    if (data.address) {
                        setAddress({
                            ...address,
                            city: data.address.city || data.address.town || data.address.village || '',
                            pincode: data.address.postcode?.replace(/\s/g, '') || ''
                        });
                        toast.success("Location detected successfully!");
                    }
                } catch (error) {
                    toast.error("Failed to fetch address details");
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            (error) => {
                setIsDetectingLocation(false);
                toast.error("Location permission denied or unavailable");
            }
        );
    };

    const renderDynamicFields = () => {
        if (!product.isService) {
            return (
                <div className="space-y-8">
                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Select Quantity</p>
                            <p className="font-bold text-gray-500 text-xs">Standard packaging applies</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                             <button onClick={() => setConfig({...config, quantity: Math.max(1, (config.quantity || 1) - 1)})} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center font-black">-</button>
                             <span className="w-8 text-center font-black text-lg">{config.quantity || 1}</span>
                             <button onClick={() => setConfig({...config, quantity: (config.quantity || 1) + 1})} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center font-black">+</button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fulfillment Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setFulfillmentType('Direct Shopping')}
                                className={`p-6 rounded-[2rem] border text-left transition-all ${fulfillmentType === 'Direct Shopping' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4"><Home size={20}/></div>
                                <p className="font-black text-sm mb-1 uppercase tracking-tight">Self Pickup</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">At Shop Location</p>
                            </button>
                            <button 
                                onClick={() => setFulfillmentType('Delivery Partner')}
                                className={`p-6 rounded-[2rem] border text-left transition-all ${fulfillmentType === 'Delivery Partner' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4"><Zap size={20}/></div>
                                <p className="font-black text-sm mb-1 uppercase tracking-tight">Delivery</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">₹{product.deliveryCharge || 0} Charge</p>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        switch (product.serviceType) {
            case 'Cleaning':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">BHK Selection</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['1BHK', '2BHK', '3BHK', '4BHK+'].map(bhk => (
                                    <button 
                                        key={bhk}
                                        onClick={() => setConfig({...config, bhk})}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${config.bhk === bhk ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-400 hover:border-primary/30'}`}
                                    >
                                        {bhk}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bathrooms</label>
                            <input 
                                type="number" 
                                min="1" 
                                value={config.bathrooms || 1} 
                                onChange={(e) => setConfig({...config, bathrooms: parseInt(e.target.value)})}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cleaning Level</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Basic', 'Deep Cleaning', 'Eco-Friendly'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setConfig({...config, cleaningType: type})}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${config.cleaningType === type ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-400 hover:border-primary/30'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Painting':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Estimated Area (Sq Ft)</label>
                            <input 
                                type="number" 
                                placeholder="500" 
                                onChange={(e) => setConfig({...config, area: parseInt(e.target.value)})}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Finish Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Matte', 'Premium Gloss', 'Texture'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setConfig({...config, paintType: t})}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${config.paintType === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-dark-bg border-gray-100 dark:border-gray-800 text-gray-400 hover:border-primary/30'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Plumbing':
            case 'Electrical':
            case 'Carpentry':
                return (
                    <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Units / Points</label>
                                <input 
                                    type="number" min="1" defaultValue="1"
                                    onChange={(e) => setConfig({...config, units: parseInt(e.target.value)})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Urgency</label>
                                <select 
                                    onChange={(e) => setConfig({...config, urgency: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm appearance-none"
                                >
                                    <option value="Normal">Normal (24h)</option>
                                    <option value="Emergency">Emergency (2-4h)</option>
                                </select>
                            </div>
                         </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Specific Issue</label>
                            <textarea 
                                placeholder="E.g., Leaking tap, Broken switch, Wardrobe repair..."
                                rows="3"
                                onChange={(e) => setConfig({...config, issue: e.target.value})}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Problem Description</label>
                            <textarea 
                                placeholder="Describe the issue in detail..."
                                rows="3"
                                onChange={(e) => setConfig({...config, description: e.target.value})}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={onClose}
            ></motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-dark-bg w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[850px]"
            >
                {/* Visual Sidebar */}
                <div className="hidden md:block w-72 bg-primary p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tighter leading-tight">{product.isService ? 'Service' : 'Order'} <br/>Fulfillment</h2>
                        <div className="space-y-6 mt-12">
                            {[
                                { step: 1, label: product.isService ? 'Configure' : 'Quantity', icon: <Settings size={16}/> },
                                { step: 2, label: 'Schedule', icon: <Calendar size={16}/> },
                                { step: 3, label: product.isService ? 'Venue' : (fulfillmentType === 'Direct Shopping' ? 'Pickup' : 'Delivery'), icon: <MapPin size={16}/> },
                                { step: 4, label: 'Summary', icon: <ShieldCheck size={16}/> }
                            ].map(s => (
                                <div key={s.step} className={`flex items-center gap-4 transition-all ${step === s.step ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${step === s.step ? 'bg-white text-primary border-white' : 'border-white/30 text-white'}`}>
                                        {step > s.step ? <CheckCircle2 size={14} /> : s.step}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Flow Content */}
                <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Step {step} of 4</p>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                                {step === 1 && (product.isService ? 'Configure Service' : 'Order Options')}
                                {step === 2 && (product.isService ? 'Choose Your Slot' : 'Fulfillment timing')}
                                {step === 3 && (fulfillmentType === 'Direct Shopping' ? 'Pickup Location' : 'Delivery Address')}
                                {step === 4 && (product.isService ? 'Booking Summary' : 'Order Confirmation')}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-dark-card rounded-2xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {step === 1 && (
                                    product.serviceConfig?.steps?.length > 0 ? (
                                        <ServiceConfigWizard 
                                            product={product} 
                                            onAddToCart={(price, selectionData) => {
                                                setTotalPrice(price);
                                                setConfig(selectionData);
                                                setStep(2); // Automatically move to scheduling
                                            }} 
                                        />
                                    ) : renderDynamicFields()
                                )}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Availability Schedule</label>
                                                {(!product.slots || product.slots.length === 0) && (
                                                    <span className="text-[9px] font-black text-secondary uppercase bg-secondary/10 px-3 py-1 rounded-full">Manual Request Active</span>
                                                )}
                                            </div>

                                            {product.slots && product.slots.length > 0 ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {product.slots.map(s => (
                                                        <button 
                                                            key={s.date}
                                                            onClick={() => setSelectedSlot({...selectedSlot, date: s.date})}
                                                            className={`p-4 rounded-2xl border text-left transition-all ${selectedSlot.date === s.date ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}
                                                        >
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                            <p className="text-xs font-black">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-10 bg-gray-50 dark:bg-dark-card rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-4">
                                                    <Calendar size={48} className="text-gray-300 mx-auto" />
                                                    <div>
                                                        <p className="font-black text-sm uppercase italic">Custom Scheduling</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Please specify your preferred date below</p>
                                                    </div>
                                                    <input 
                                                        type="date" 
                                                        min={new Date().toISOString().split('T')[0]}
                                                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                                        onChange={(e) => setSelectedSlot({...selectedSlot, date: e.target.value})}
                                                        className="w-full max-w-xs mx-auto px-6 py-4 rounded-2xl bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {(selectedSlot.date || (product.slots && product.slots.length > 0)) && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Preferred Time Window</label>
                                                {product.slots && product.slots.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.slots.find(s => s.date === selectedSlot.date)?.times.map(t => (
                                                            <button 
                                                                key={t}
                                                                onClick={() => setSelectedSlot({...selectedSlot, time: t})}
                                                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedSlot.time === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'].map(t => (
                                                            <button 
                                                                key={t}
                                                                onClick={() => setSelectedSlot({...selectedSlot, time: t})}
                                                                className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedSlot.time === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                                                <Info size={14} /> Instructions for Partner (Optional)
                                            </label>
                                            <textarea 
                                                placeholder="Enter any specific requirements, landmark info, or partner instructions..."
                                                value={instructions}
                                                onChange={(e) => setInstructions(e.target.value)}
                                                rows="3"
                                                className="w-full px-6 py-4 rounded-2xl bg-primary/5 border border-primary/10 outline-none font-bold text-sm resize-none focus:border-primary transition-all"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    fulfillmentType === 'Delivery Partner' ? (
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address / Landmark</label>
                                                    <button 
                                                        onClick={detectLocation}
                                                        disabled={isDetectingLocation}
                                                        className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                                                    >
                                                        {isDetectingLocation ? 'Scanning...' : 'Detect My Location'} <Navigation size={10} />
                                                    </button>
                                                </div>
                                                <input 
                                                    placeholder="Flat No, House Name, Street"
                                                    value={address.street}
                                                    onChange={(e) => setAddress({...address, street: e.target.value})}
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                                                    <input 
                                                        placeholder="Tirupur or Bangalore"
                                                        value={address.city}
                                                        onChange={(e) => setAddress({...address, city: e.target.value})}
                                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pincode (6 Digits)</label>
                                                    <input 
                                                        placeholder="641604"
                                                        maxLength={6}
                                                        value={address.pincode}
                                                        onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})}
                                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/10 space-y-6">
                                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                                                <Home size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Shop Pickup Point</h4>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Location: {product.shopName || 'Forge India Center'}</p>
                                            </div>
                                            <div className="p-8 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Pickup Instructions</p>
                                                <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                                                    {product.pickupInstructions || "Please present your Order ID at the shop counter. Your items will be packed and ready for collection."}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}

                                {step === 4 && (
                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                            <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 group">
                                                        <img src={product.image || '/logo.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black italic text-gray-900 dark:text-white">{product.name}</h4>
                                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Confirmed {product.isService ? 'Service' : 'Order'} Selection</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Investment</p>
                                                    <span className="text-3xl font-black text-primary block">₹{totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">Configuration Summary</p>
                                                        <div className="space-y-2.5">
                                                            {Object.entries(config).map(([k, v]) => (
                                                                <div key={k} className="flex justify-between items-center text-[11px] font-bold">
                                                                    <span className="text-gray-400 uppercase">{k}:</span>
                                                                    <span className="text-gray-900 dark:text-white uppercase">{v}</span>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                                <span className="text-gray-400 uppercase">Fulfillment:</span>
                                                                <span className="text-secondary font-black uppercase px-2 py-0.5 bg-secondary/10 rounded">{fulfillmentType === 'Direct Shopping' ? 'Self Pickup' : 'Home Delivery'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">{fulfillmentType === 'Direct Shopping' ? 'Pickup Point' : 'Site Destination'}</p>
                                                        {fulfillmentType === 'Delivery Partner' ? (
                                                            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-start gap-3 border border-gray-100 dark:border-gray-800">
                                                                <MapPin size={14} className="text-primary mt-0.5" />
                                                                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase">
                                                                    {address.street}, {address.city}<br/>PIN: {address.pincode}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-start gap-3 border border-gray-100 dark:border-gray-800">
                                                                <Home size={14} className="text-primary mt-0.5" />
                                                                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase">
                                                                    Official Partner: {product.shopName || 'Forge India Center'}<br/>Managed Pickup Flow
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {product.isService && (
                                                        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-4 border border-primary/10">
                                                            <Calendar size={16} className="text-primary" />
                                                            <div>
                                                                <p className="text-[9px] font-black text-gray-400 uppercase">Selected Slot</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {instructions && (
                                                        <div className="p-4 bg-secondary/5 rounded-2xl flex items-start gap-4 border border-secondary/20">
                                                            <Info size={16} className="text-secondary mt-0.5" />
                                                            <div>
                                                                <p className="text-[9px] font-black text-gray-400 uppercase">Special Instructions</p>
                                                                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed italic">"{instructions}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-primary text-white rounded-[2.5rem] flex items-center gap-8 shadow-xl shadow-primary/30 group">
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <ShieldCheck size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Forge Elite Guarantee</p>
                                                <p className="text-xs font-bold opacity-80 leading-relaxed">
                                                    Your booking includes accidental coverage and certified partner assignment. A technician will be verified and dispatched for your specified window.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-12 flex items-center justify-between gap-6 pt-10 border-t border-gray-50 dark:border-gray-800">
                        {step > 1 ? (
                            <button onClick={prevStep} className="px-10 py-5 bg-gray-100 dark:bg-dark-card text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
                                <ChevronLeft size={16} /> Previous
                            </button>
                        ) : (
                            <div />
                        )}
                        
                        {step < 4 ? (
                            (!product.serviceConfig?.steps?.length || step > 1) && (
                                <button 
                                    onClick={nextStep}
                                    className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all flex items-center gap-3 group/nav"
                                >
                                    Continue <ChevronRight size={18} className="group-hover/nav:translate-x-1 transition-all" />
                                </button>
                            )
                        ) : (
                            <button 
                                onClick={handleBooking}
                                className="px-14 py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
                            >
                                Confirm & Book <CheckCircle2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingFlowManager;

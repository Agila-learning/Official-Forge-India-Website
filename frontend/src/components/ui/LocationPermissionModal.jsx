import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const LocationPermissionModal = () => {
    const { showModal, setShowModal, status, detectLocation, updateManualLocation } = useLocation();
    const [manualLocation, setManualLocation] = useState('');
    const [step, setStep] = useState('request'); // request, manual

    if (!showModal) return null;

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualLocation.trim()) {
            updateManualLocation({
                formatted: manualLocation,
                manual: true
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-[3.5rem] max-w-xl w-full text-center shadow-2xl relative border border-gray-100 dark:border-gray-800"
            >
                <button 
                  onClick={() => {
                      localStorage.setItem('fic_location_asked', 'true');
                      setShowModal(false);
                  }}
                  className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                {step === 'request' ? (
                    <>
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <MapPin size={48} className="text-primary" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Personalize Your Experience</h2>
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
                            Allow location access to discover services near you and experience faster, more relevant deliveries.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={detectLocation}
                                disabled={status === 'loading'}
                                className="flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? (
                                    <>Detecting... <Navigation size={20} className="animate-spin" /></>
                                ) : (
                                    <>Allow Access <Navigation size={20} /></>
                                )}
                            </button>
                            <button 
                                onClick={() => setStep('manual')}
                                className="text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                Set Location Manually <ChevronRight size={14} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search size={32} className="text-secondary" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Where are you?</h2>
                        <p className="text-gray-500 mb-10 font-medium">Please enter your city or pincode manually</p>
                        
                        <form onSubmit={handleManualSubmit} className="space-y-6 text-left">
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Enter City, State or Pincode..." 
                                    value={manualLocation}
                                    onChange={(e) => setManualLocation(e.target.value)}
                                    autoFocus
                                    className="w-full pl-16 pr-6 py-6 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-3xl outline-none focus:border-primary/50 font-bold transition-all"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[11px]"
                            >
                                Confirm Location
                            </button>
                            <button 
                                type="button"
                                onClick={() => setStep('request')}
                                className="w-full text-center text-gray-400 font-bold hover:text-primary transition-colors py-2"
                            >
                                Back
                            </button>
                        </form>
                    </>
                )}

                {status === 'error' && (
                    <p className="mt-8 text-red-500 text-sm font-bold flex items-center justify-center gap-2">
                        Unable to detect location. Please try manually.
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default LocationPermissionModal;

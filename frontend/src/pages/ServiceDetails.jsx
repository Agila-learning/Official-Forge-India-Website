import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    ArrowRight, 
    Star, 
    Info,
    MessageSquare,
    ChevronRight,
    Users,
    Wrench,
    BookOpen,
    PhoneCall
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const staticServices = {
  'it-solutions': {
    name: 'IT Solutions',
    description: 'Scalable cloud infrastructure and managed IT services designed for maximum uptime and security.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    included: ['24/7 Managed Network Support', 'Advanced Cybersecurity Shielding', 'Cloud Migration & Optimization', 'Custom ERP & CRM Implementations'],
    excluded: ['Hardware Costs', 'Third-party Licenses']
  },
  'job-consulting': {
    name: 'Job Consulting',
    description: 'Elite career consulting and placement support for Banking, IT, and Corporate sectors.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    included: ['Resume Engineering', 'Mock Interviews', 'Direct Access to HR Networks'],
    excluded: ['Guaranteed Job Offer', 'Application Fees']
  },
  'digital-marketing': {
    name: 'Digital Marketing',
    description: 'Data-driven growth hacking and SEO strategies to dominate search results.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    included: ['SEO & SEM Optimization', 'Social Media Management', 'Analytics Reporting'],
    excluded: ['Ad Spend', 'Content Production Fees']
  },
  'app-development': {
    name: 'App Development',
    description: 'High-performance mobile applications engineered for seamless user experiences on iOS and Android.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    included: ['Native Swift & Kotlin Development', 'React Native & Flutter Hybrid Apps', 'Ultra-Low Latency Backend API', 'Biometric & Secure Payment Integration'],
    excluded: ['App Store Fees', 'Third-party API Costs']
  },
  'website-development': {
    name: 'Website Development',
    description: 'Modern, scalable web platforms built with cutting-edge tech stacks like React, Next.js, and Node.js.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    included: ['Dynamic & Responsive PWAs', 'E-commerce & Custom Marketplace', 'Headless CMS Integrations', 'SEO-First Architecture'],
    excluded: ['Domain & Hosting', 'Premium Plugin Licenses']
  },
  'insurance-services': {
    name: 'Insurance Services',
    description: 'Comprehensive risk management and insurance solutions for corporate and individual safety.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    included: ['Bespoke Health & Life Plans', 'Commercial Property & Asset Guard', 'Liability & Indemnity Coverage', 'Fast-track Claims Assistance'],
    excluded: ['Premium Installments', 'Deductibles']
  }
};

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showIdlePopup, setShowIdlePopup] = useState(false);

    // Idle timer logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIdlePopup(true);
        }, 60000); // 60 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            
            // Check static services first
            if (staticServices[id]) {
                setService(staticServices[id]);
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get(`/products/${id}`);
                setService(data);
                setLoading(false);
            } catch (err) {
                console.error('Service load error:', err);
                toast.error('Service details not available');
                setLoading(false);
                // Optionally redirect to services if not found after 2 seconds
                setTimeout(() => {
                    if (!service) navigate('/services');
                }, 2000);
            }
        };
        if (id) fetchService();
    }, [id, navigate]);

    const handleBookNow = () => {
        // Services are always quantity 1 and lead to specialized checkout
        addToCart({ ...service, qty: 1, isService: true });
        navigate('/checkout');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!service) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Service Node Not Found</h2>
        </div>
    );

    // Dynamic Included/Excluded lists (Mock logic if not in DB)
    const included = service.included || [
        "Certified Professional Partner",
        "Quality Check & Validation",
        "Real-time Tracking",
        "FIC Warranty Coverage"
    ];
    const excluded = service.excluded || [
        "Additional Spare Parts",
        "Premium Express Handling",
        "Extended Support Window"
    ];

    return (
        <>
            <SEOMeta 
                title={`${service.name} | Professional Services | Forge India Connect`}
                description={service.description || `Professional ${service.name} services by Forge India Connect. Verified partners, secure booking, and guaranteed quality.`}
                canonical={`/services/${id}`}
            />

            {/* Idle Popup */}
            <AnimatePresence>
                {showIdlePopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 max-w-sm w-full text-center relative"
                        >
                            <button 
                                onClick={() => setShowIdlePopup(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                ✕
                            </button>
                            
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <PhoneCall className="text-primary" size={32} />
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                                Why still waiting for?
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                Just jump into it! Call us directly and let's get started.
                            </p>
                            
                            <a 
                                href="tel:+916369406416"
                                onClick={() => setShowIdlePopup(false)}
                                className="w-full btn-primary btn-lg flex items-center justify-center gap-2"
                            >
                                Call 63694 06416 <PhoneCall size={18} />
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Visual Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="relative group rounded-[3rem] overflow-hidden bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-2xl aspect-[4/3]">
                            <img 
                                src={service.image || '/placeholder-service.jpg'} 
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                                Service Grade A+
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <Info className="text-primary" /> Service Specification
                            </h3>
                            <div className="space-y-4">
                                <section>
                                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle2 size={16} /> What's Included
                                    </h4>
                                    <ul className="space-y-3">
                                        {included.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-6" />

                                <section>
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <XCircle size={16} /> What's Excluded
                                    </h4>
                                    <ul className="space-y-3">
                                        {excluded.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-400/80">
                                                <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mt-1.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </div>
                    </motion.div>

                    {/* Logic Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <header className="mb-8">
                            <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                <Star size={12} fill="currentColor" /> Premium Managed Service
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-tight uppercase">
                                {service.name}
                            </h1>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="text-3xl font-black text-primary tracking-tighter">
                                    ₹{service.price?.toLocaleString()} 
                                    <span className="text-xs text-gray-400 font-bold ml-2 uppercase tracking-widest">/ Service</span>
                                </div>
                                <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
                                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
                                    <Star size={12} fill="currentColor" /> 4.9 Verified
                                </div>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-bold leading-relaxed">
                                {service.description || "Consolidated professional service delivery through Forge India's verified partner network. Standardized protocols and quality assurance included."}
                            </p>
                        </header>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-4 p-5 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Availability Flow</p>
                                    <p className="font-bold text-gray-900 dark:text-white">Next Available: Tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">FIC Guarantee</p>
                                    <p className="font-bold text-gray-900 dark:text-white">100% Outcome Satisfactory</p>
                                </div>
                            </div>

                            {/* New Operational Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/5 shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tactical Team</p>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">{service.teamSize || 1} Professional(s)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center text-secondary shadow-lg shadow-secondary/5 shrink-0">
                                        <Wrench size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Asset Status</p>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">{service.equipmentProvided ? 'Equipment Provided' : 'Standard Props Only'}</p>
                                    </div>
                                </div>
                                {service.safetyMeasures?.length > 0 && (
                                    <div className="md:col-span-2 flex items-start gap-4 mt-2">
                                        <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-xl flex items-center justify-center text-green-500 shadow-lg shadow-green-500/5 shrink-0">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Safety Protocol</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">{service.safetyMeasures.join(' • ')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {service.serviceTerms && (
                                <div className="p-6 bg-yellow-500/5 rounded-[2rem] border border-yellow-500/20">
                                    <h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <BookOpen size={14} /> Mission Constraints & Terms
                                    </h4>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase">{service.serviceTerms}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-10 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                                * Final pricing involves GST and transparent convenience fees.
                            </p>
                            <button 
                                onClick={handleBookNow}
                                className="w-full py-7 bg-primary text-white font-black rounded-3xl text-sm uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(10,102,194,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                            >
                                Secure My Service Slot <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button className="py-4 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare size={14} /> Contact Vendor
                                </button>
                                <button className="py-4 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> View License
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Ecosystem Context Section */}
                <section className="mt-32 pt-20 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 bg-white dark:bg-dark-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                        <div className="flex-1">
                           <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight italic">Forge India Digital Fulfillment</h4>
                           <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-xl">
                               Every service booking triggers our proprietary fulfillment engine. We assign the most qualified partner within 30 minutes of booking confirmation.
                           </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-dark-card bg-gray-200 overflow-hidden ring-2 ring-primary/20">
                                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Partner" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white">500+ Active Partners</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest">In Your Region</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </>
);
};

export default ServiceDetails;

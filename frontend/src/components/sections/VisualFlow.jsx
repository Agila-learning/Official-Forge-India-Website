import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { UserPlus, Briefcase, CheckCircle, Package, Search, Truck, ArrowRight } from 'lucide-react';

const FlowSection = ({ title, subtitle, steps, isInverse }) => {
    return (
        <div className={`py-24 relative overflow-hidden ${isInverse ? 'bg-gray-50 dark:bg-dark-card/30' : 'bg-white dark:bg-dark-bg'}`}>
            {/* Background Decorative Elements */}
            <div className={`absolute top-0 ${isInverse ? 'right-0' : 'left-0'} w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2`}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4"
                    >
                        Success Blueprint
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                        How it works for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{title}</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
                    {/* Connection Path Overlay (Desktop) */}
                    <div className="hidden md:flex absolute top-[100px] left-[15%] right-[15%] justify-between pointer-events-none opacity-20 dark:opacity-10">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent border-t-2 border-dashed border-primary"></div>
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent border-t-2 border-dashed border-primary"></div>
                    </div>

                    {steps.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="relative flex flex-col items-center text-center px-6"
                        >
                            {/* Card with Glassmorphism */}
                            <div className="group relative mb-10">
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className={`w-40 h-40 rounded-[2.5rem] ${isInverse ? 'bg-white' : 'bg-gray-50 dark:bg-dark-card'} flex items-center justify-center shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative z-10 overflow-hidden`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                    <step.icon size={48} className={`${step.color} relative z-20 group-hover:scale-110 transition-transform duration-500`} />
                                </motion.div>
                                
                                {/* Step Indicator Badge */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center z-20">
                                    <span className="text-xl font-black text-primary">{idx + 1}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black mb-4 dark:text-white uppercase tracking-tight">{step.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
                                {step.desc}
                            </p>

                            {/* Arrow for mobile/desktop spacing */}
                            {idx < steps.length - 1 && (
                                <div className="md:hidden mt-8 text-primary animate-bounce">
                                    <ArrowRight className="rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VisualFlow = () => {
    const candidateSteps = [
        { 
            title: "Create Profile", 
            desc: "Onboard with your credentials and skills to enter India's premier workforce engine.", 
            icon: UserPlus, 
            color: "text-blue-500",
            gradient: "from-blue-500 to-cyan-500"
        },
        { 
            title: "Apply Job", 
            desc: "Browse high-impact vacancies tailored to your professional dossier across top sectors.", 
            icon: Briefcase, 
            color: "text-indigo-500",
            gradient: "from-indigo-500 to-purple-500"
        },
        { 
            title: "Get Hired", 
            desc: "Finalize placements with standardized contracts and immediate benefit activations.", 
            icon: CheckCircle, 
            color: "text-green-500",
            gradient: "from-green-500 to-emerald-500"
        }
    ];

    const customerSteps = [
        { 
            title: "Choose Asset", 
            desc: "Explore a vast ecosystem of verified products and professional services.", 
            icon: Search, 
            color: "text-orange-500",
            gradient: "from-orange-500 to-yellow-500"
        },
        { 
            title: "Book / Order", 
            desc: "Securely procure via our unified FIC marketplace with instant confirmation.", 
            icon: Package, 
            color: "text-rose-500",
            gradient: "from-rose-500 to-orange-500"
        },
        { 
            title: "Get Delivered", 
            desc: "Experience rapid fulfillment through our verified logistics and service network.", 
            icon: Truck, 
            color: "text-amber-500",
            gradient: "from-amber-500 to-orange-400"
        }
    ];

    return (
        <section id="how-it-works" className="border-t border-gray-100 dark:border-gray-800">
            <FlowSection 
                title="Candidates" 
                subtitle="Your journey from applicant to high-impact professional starts here."
                steps={candidateSteps} 
                isInverse={false} 
            />
            <FlowSection 
                title="Business" 
                subtitle="Scale your operations with FIC's standardized procurement and service ecosystem."
                steps={customerSteps} 
                isInverse={true} 
            />
        </section>
    );
};

export default VisualFlow;

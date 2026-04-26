import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Award, BookOpen, CheckCircle, ChevronRight, Zap, Target, Star } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CourseDetailsModal = ({ isOpen, onClose, course }) => {
  const roadmapContainer = useRef(null);

  useGSAP(() => {
    if (isOpen && roadmapContainer.current) {
      gsap.from(".roadmap-step", {
        x: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4
      });
      gsap.from(".roadmap-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        ease: "none",
        delay: 0.2
      });
    }
  }, { dependencies: [isOpen], scope: roadmapContainer });

  if (!course) return null;

  const defaultRoadmap = [
    { step: 'Phase 01: Foundations', description: 'Mastering the fundamentals and environment architecture.' },
    { step: 'Phase 02: Core Mechanics', description: 'Deep dive into specialized tools and logic patterns.' },
    { step: 'Phase 03: Advanced Systems', description: 'Implementing complex features and optimization.' },
    { step: 'Phase 04: Real-world Projects', description: 'Building industry-grade applications from scratch.' },
    { step: 'Phase 05: Deployment & Beyond', description: 'Performance tuning and global deployment strategies.' }
  ];

  const roadmapData = course.roadmap?.length > 0 ? course.roadmap : defaultRoadmap;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-bg/95 backdrop-blur-2xl z-[3000]"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[650px] bg-white dark:bg-dark-card z-[3001] shadow-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative bg-gradient-to-r from-gray-50/50 to-white dark:from-dark-bg dark:to-dark-card">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] px-3 py-1 bg-primary/5 rounded-full border border-primary/10">Syllabus</span>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] px-3 py-1 bg-secondary/5 rounded-full border border-secondary/10">Roadmap</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">
                    {course.title.split(' ').map((word, i) => i === course.title.split(' ').length - 1 ? <span key={i} className="text-primary italic">{word} </span> : word + ' ')}
                  </h3>
               </div>
               <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-red-500 hover:rotate-90 transition-all shadow-sm">
                  <X size={24} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-16">
               {/* Quick Stats */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-inner group">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Clock size={20} />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                     <p className="text-xl font-black italic">{course.duration}</p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-inner group">
                     <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Award size={20} />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Certification</p>
                     <p className="text-xl font-black italic">Industrial</p>
                  </div>
               </div>

               {/* Description */}
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] flex-1 bg-gray-100 dark:bg-gray-800" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-2">
                       <Zap size={14} className="text-yellow-500 animate-pulse" /> Overview
                    </h4>
                    <div className="h-[2px] flex-1 bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic text-lg text-center px-4">
                     "{course.description}"
                  </p>
               </div>

               {/* Roadmap */}
               <div ref={roadmapContainer} className="space-y-10 bg-gray-50/50 dark:bg-dark-bg/20 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">Learning Journey</h4>
                    <Target size={18} className="text-primary animate-bounce" />
                  </div>
                  <div className="relative pl-12 space-y-12">
                     <div className="roadmap-line absolute left-4 top-2 bottom-2 w-[3px] bg-gradient-to-b from-primary via-secondary to-transparent rounded-full shadow-[0_0_10px_rgba(49,46,129,0.2)]" />
                     
                     {roadmapData.map((step, idx) => (
                        <div key={idx} className="roadmap-step relative">
                           <div className="absolute -left-[45px] top-1 w-9 h-9 rounded-2xl bg-white dark:bg-dark-card border-2 border-primary shadow-xl flex items-center justify-center z-10 group-hover:bg-primary transition-colors">
                              <span className="text-[10px] font-black text-primary">{idx + 1}</span>
                           </div>
                           <div className="p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/50 transition-all">
                             <h5 className="font-black uppercase tracking-tight text-gray-900 dark:text-white mb-2 italic flex items-center gap-2">
                               {step.step}
                               {idx === 0 && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                             </h5>
                             <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.description}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Syllabus Modules */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] flex-1 bg-gray-100 dark:bg-gray-800" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Curriculum Modules</h4>
                    <div className="h-[2px] flex-1 bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                     {course.syllabus && course.syllabus.length > 0 ? course.syllabus.map((module, idx) => (
                        <div key={idx} className="p-8 bg-white dark:bg-dark-bg/30 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] group hover:border-primary hover:-translate-y-1 transition-all duration-300">
                           <div className="flex justify-between items-center mb-6">
                              <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">Module {String(idx + 1).padStart(2, '0')}</span>
                              <BookOpen size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                           </div>
                           <h5 className="text-xl font-black uppercase tracking-tight mb-6 italic">{module.module}</h5>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {module.topics.map((topic, tidx) => (
                                 <div key={tidx} className="flex items-center gap-3 text-xs text-gray-500 font-bold group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                    <div className="w-5 h-5 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center shrink-0">
                                      <CheckCircle size={10} />
                                    </div>
                                    <span className="truncate">{topic}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )) : (
                        <div className="p-12 text-center bg-gray-50 dark:bg-dark-bg rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                           <p className="text-gray-400 font-bold italic uppercase tracking-widest text-xs">Full Syllabus available upon enrollment</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Footer CTA */}
            <div className="p-10 bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-gray-800">
               <button 
                  onClick={() => {
                    onClose();
                    if (window.onOpenRegistration) window.onOpenRegistration(course.title);
                  }}
                  className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-3xl shadow-primary/40 hover:-translate-y-2 active:translate-y-0 transition-all flex items-center justify-center gap-4 group"
               >
                  Secure Enrollment
                  <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CourseDetailsModal;


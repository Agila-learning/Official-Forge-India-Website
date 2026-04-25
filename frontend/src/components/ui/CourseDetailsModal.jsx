import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Award, BookOpen, CheckCircle, ChevronRight, Zap } from 'lucide-react';

const CourseDetailsModal = ({ isOpen, onClose, course }) => {
  if (!course) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-bg/90 backdrop-blur-xl z-[3000]"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white dark:bg-dark-card z-[3001] shadow-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
               <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">Course Syllabus & Roadmap</span>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{course.title}</h3>
               </div>
               <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-bg rounded-2xl text-gray-400 hover:text-red-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
               {/* Quick Stats */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                     <Clock className="text-primary mb-3" size={20} />
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                     <p className="text-lg font-black">{course.duration}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                     <Award className="text-secondary mb-3" size={20} />
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certification</p>
                     <p className="text-lg font-black">Industrial</p>
                  </div>
               </div>

               {/* Description */}
               <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                     <Zap size={14} className="text-yellow-500" /> Overview
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                     {course.description}
                  </p>
               </div>

               {/* Roadmap */}
               <div className="space-y-8">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Learning Roadmap</h4>
                  <div className="relative pl-8 space-y-10">
                     <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent" />
                     {course.roadmap && course.roadmap.length > 0 ? (
                        course.roadmap.map((step, idx) => (
                           <div key={idx} className="relative">
                              <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-4 border-primary shadow-[0_0_10px_rgba(49,46,129,0.3)]" />
                              <h5 className="font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1">{step.step}</h5>
                              <p className="text-xs text-gray-500 font-medium">{step.description}</p>
                           </div>
                        ))
                     ) : (
                        <div className="relative">
                           <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-4 border-primary shadow-[0_0_10px_rgba(49,46,129,0.3)]" />
                           <h5 className="font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1">Fundamentals</h5>
                           <p className="text-xs text-gray-500 font-medium">Master the core basics and environment setup.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Syllabus Modules */}
               <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Curriculum Modules</h4>
                  <div className="space-y-4">
                     {course.syllabus && course.syllabus.map((module, idx) => (
                        <div key={idx} className="p-6 bg-white dark:bg-dark-bg/30 border border-gray-100 dark:border-gray-800 rounded-3xl group hover:border-primary transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Module {idx + 1}</span>
                              <BookOpen size={16} className="text-gray-300" />
                           </div>
                           <h5 className="font-black uppercase tracking-tight mb-4">{module.module}</h5>
                           <div className="space-y-2">
                              {module.topics.map((topic, tidx) => (
                                 <div key={tidx} className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={12} className="text-green-500" />
                                    {topic}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Footer CTA */}
            <div className="p-8 bg-gray-50 dark:bg-dark-bg border-t border-gray-100 dark:border-gray-800">
               <button 
                  onClick={() => {
                    onClose();
                    // This will be handled by the parent to open the registration form
                    if (window.onOpenRegistration) window.onOpenRegistration(course.title);
                  }}
                  className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
               >
                  Enroll in this Course
                  <ChevronRight size={18} />
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CourseDetailsModal;

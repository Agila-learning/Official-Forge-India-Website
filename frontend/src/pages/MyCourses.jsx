import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Award, Clock, ChevronRight, Loader2, CheckCircle, Lock } from 'lucide-react';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';

const DEMO_ENROLLMENTS = [
  { _id: 'e1', preferredCourse: 'Full Stack Development Bootcamp', status: 'Enrolled', progress: 65, course: { _id: 'c1', title: 'Full Stack Development Bootcamp', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', duration: '6 Months', category: 'Full Stack Development' } },
  { _id: 'e2', preferredCourse: 'UI/UX Design Masterclass', status: 'Enrolled', progress: 30, course: { _id: 'c2', title: 'UI/UX Design Masterclass', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400', duration: '4 Months', category: 'UI/UX Design' } },
  { _id: 'e3', preferredCourse: 'Data Analytics with Python', status: 'Completed', progress: 100, course: { _id: 'c4', title: 'Data Analytics Basics', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', duration: '3 Months', category: 'Data Analytics Basics' }, certificateIssued: true },
];

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/training/my-training', { headers: { Authorization: `Bearer ${token}` } });
        setEnrollments(data.length > 0 ? data : DEMO_ENROLLMENTS);
      } catch {
        setEnrollments(DEMO_ENROLLMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-green-600 bg-green-50';
    if (status === 'Enrolled') return 'text-blue-600 bg-blue-50';
    return 'text-slate-500 bg-slate-100';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <SEOMeta title="My Courses | Forge India Connect" description="Continue your learning journey." />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">My <span className="text-indigo-600">Courses</span></h1>
          <p className="text-slate-500 font-medium">Continue your learning journey.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg">
            <BookOpen size={64} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight mb-4">No Courses Enrolled</h3>
            <button onClick={() => navigate('/courses')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((en, i) => {
              const course = en.course || { title: en.preferredCourse, _id: 'c1', image: null, duration: 'N/A', category: 'Training' };
              const progress = en.progress || 0;
              const isCompleted = en.status === 'Completed' || progress === 100;

              return (
                <motion.div key={en._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Thumbnail */}
                    <div className="sm:w-56 h-40 sm:h-auto bg-slate-100 shrink-0 relative">
                      <img src={course.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'} alt={course.title}
                        className="w-full h-full object-cover" />
                      {isCompleted && (
                        <div className="absolute inset-0 bg-green-600/80 flex items-center justify-center">
                          <Award size={36} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{course.category}</span>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{course.title}</h3>
                        </div>
                        <span className={`shrink-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(en.status)}`}>
                          {en.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                        <span className="flex items-center gap-1"><CheckCircle size={11} />{progress}% Complete</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 w-full bg-slate-100 dark:bg-dark-bg rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'}`} />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">{progress}% complete</p>
                      </div>

                      <div className="flex items-center gap-3 mt-auto">
                        {isCompleted ? (
                          <>
                            <button onClick={() => navigate(`/courses/${course._id}/learn`)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                              <Award size={14} /> View Certificate
                            </button>
                            <button onClick={() => navigate(`/courses/${course._id}/learn`)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                              Review Course
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => navigate(`/courses/${course._id}/learn`)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">
                              <Play size={14} fill="white" /> Continue Learning
                            </button>
                            <button onClick={() => navigate(`/courses/${course._id}`)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                              Course Details <ChevronRight size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && enrollments.length > 0 && (
          <div className="mt-10 text-center">
            <button onClick={() => navigate('/courses')} className="px-8 py-4 bg-white dark:bg-dark-card text-indigo-600 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition-all">
              Explore More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

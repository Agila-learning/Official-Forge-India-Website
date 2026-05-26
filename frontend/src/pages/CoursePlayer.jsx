import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Pause, ChevronLeft, ChevronRight, Check, Award, Lock,
  List, X, CheckCircle, SkipForward, SkipBack, Maximize2, Volume2
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const DEMO_COURSE = {
  _id: 'c1',
  title: 'Full Stack Development Bootcamp',
  lectures: [
    { _id: 'l1', title: 'Introduction to HTML5', url: 'https://www.youtube.com/embed/pQN-pnXPaVg', duration: '18 min' },
    { _id: 'l2', title: 'CSS Flexbox & Grid Mastery', url: 'https://www.youtube.com/embed/K74l26pE4YA', duration: '22 min' },
    { _id: 'l3', title: 'JavaScript ES6+ Fundamentals', url: 'https://www.youtube.com/embed/PkZNo7MFNFg', duration: '35 min' },
    { _id: 'l4', title: 'React.js Core Concepts', url: 'https://www.youtube.com/embed/w7ejDZ8SWv8', duration: '45 min' },
    { _id: 'l5', title: 'React Hooks Deep Dive', url: 'https://www.youtube.com/embed/O6P86uwfdR0', duration: '30 min' },
    { _id: 'l6', title: 'Node.js & Express Setup', url: 'https://www.youtube.com/embed/Oe421EPjeBE', duration: '28 min' },
    { _id: 'l7', title: 'MongoDB Schema Design', url: 'https://www.youtube.com/embed/-56x56UppqQ', duration: '25 min' },
    { _id: 'l8', title: 'REST API Design & JWT Auth', url: 'https://www.youtube.com/embed/mbsmsi7l3r4', duration: '40 min' },
    { _id: 'l9', title: 'Full Stack Project Walkthrough', url: 'https://www.youtube.com/embed/mrHNSanmqQ4', duration: '55 min' },
    { _id: 'l10', title: 'Deployment with AWS & Nginx', url: 'https://www.youtube.com/embed/6EUMcWUEyy0', duration: '35 min' },
  ]
};

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const loadCourse = async () => {
      try {
        const [courseRes, lecturesRes] = await Promise.all([
          api.get(`/training/courses/${id}`).catch(() => ({ data: DEMO_COURSE })),
          api.get(`/training/lectures/${id}`).catch(() => ({ data: DEMO_COURSE.lectures }))
        ]);
        setCourse(courseRes.data);
        const lecs = lecturesRes.data?.length > 0 ? lecturesRes.data : DEMO_COURSE.lectures;
        setLectures(lecs);
      } catch {
        setCourse(DEMO_COURSE);
        setLectures(DEMO_COURSE.lectures);
      } finally {
        setLoading(false);
      }
    };
    // Load saved progress
    const saved = JSON.parse(localStorage.getItem(`course-progress-${id}`) || '[]');
    setCompleted(saved);
    loadCourse();
  }, [id]);

  const markComplete = (lectureId) => {
    const updated = [...new Set([...completed, lectureId])];
    setCompleted(updated);
    localStorage.setItem(`course-progress-${id}`, JSON.stringify(updated));
    toast.success('Lesson completed!', { duration: 2000 });
  };

  const handleNext = () => {
    if (currentIdx < lectures.length - 1) {
      markComplete(lectures[currentIdx]._id);
      setCurrentIdx(p => p + 1);
    } else {
      markComplete(lectures[currentIdx]._id);
      if (completed.length + 1 >= lectures.length) {
        setShowCertificate(true);
      }
    }
  };

  const handlePrev = () => { if (currentIdx > 0) setCurrentIdx(p => p - 1); };

  const progress = lectures.length > 0 ? Math.round((completed.length / lectures.length) * 100) : 0;
  const currentLecture = lectures[currentIdx];
  const isAllDone = lectures.length > 0 && completed.length >= lectures.length;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="text-white text-center"><div className="animate-spin w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" /><p className="text-sm font-bold">Loading your course...</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <SEOMeta title={`${course?.title || 'Course'} — Player | FIC`} description="Continue your learning journey." />

      {/* Top Bar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-4 shrink-0">
        <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-colors">
          <ChevronLeft size={16} /> My Courses
        </button>
        <div className="h-4 w-px bg-slate-600" />
        <span className="text-white font-black text-sm truncate flex-1">{course?.title}</span>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-700 rounded-xl px-3 py-1.5">
            <div className="h-1.5 w-24 bg-slate-600 rounded-full overflow-hidden">
              <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase">{progress}%</span>
          </div>
          <button onClick={() => setShowSidebar(p => !p)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-all">
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {currentLecture?.url ? (
              <iframe
                key={currentLecture._id}
                src={`${currentLecture.url}?autoplay=0&rel=0&modestbranding=1`}
                className="w-full h-full max-h-[70vh]"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={currentLecture.title}
              />
            ) : (
              <div className="text-white text-center">
                <Play size={60} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold opacity-50">No video available</p>
              </div>
            )}
          </div>

          {/* Video Controls Strip */}
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-600 transition-all">
                <SkipBack size={14} /> Prev
              </button>
              <button onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">
                {currentIdx < lectures.length - 1 ? <><SkipForward size={14} /> Next</> : <><Check size={14} /> Complete</>}
              </button>
            </div>

            <div className="flex-1 text-center">
              <p className="text-white font-black text-sm truncate hidden sm:block">{currentLecture?.title}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">{currentIdx + 1} of {lectures.length} · {currentLecture?.duration}</p>
            </div>

            <button onClick={() => { markComplete(currentLecture._id); toast.success('Marked as complete!'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completed.includes(currentLecture?._id) ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-green-600 hover:text-white'}`}>
              <CheckCircle size={14} /> {completed.includes(currentLecture?._id) ? 'Completed' : 'Mark Done'}
            </button>
          </div>
        </div>

        {/* Sidebar: Lesson List */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="bg-slate-800 border-l border-slate-700 overflow-y-auto flex-shrink-0">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">Course Content</h3>
                <p className="text-slate-400 text-[10px] font-bold mt-1">{completed.length}/{lectures.length} completed</p>
              </div>
              <div className="p-3 space-y-1">
                {lectures.map((lec, i) => {
                  const isDone = completed.includes(lec._id);
                  const isCurrent = i === currentIdx;
                  return (
                    <button key={lec._id} onClick={() => setCurrentIdx(i)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isCurrent ? 'bg-indigo-600 text-white' : isDone ? 'bg-slate-700/50 text-slate-300' : 'hover:bg-slate-700 text-slate-400 hover:text-white'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${isCurrent ? 'bg-white text-indigo-600' : isDone ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-400'}`}>
                        {isDone ? <Check size={12} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black truncate ${isCurrent ? 'text-white' : ''}`}>{lec.title}</p>
                        <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-0.5">{lec.duration}</p>
                      </div>
                      {isCurrent && <Play size={12} className="shrink-0 fill-white text-white" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-3xl">
              <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={48} className="text-yellow-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">Course Completed!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">Congratulations, <strong>{userInfo?.firstName}</strong>!</p>
              <p className="text-slate-400 text-sm mb-8">You've successfully completed <strong>{course?.title}</strong>. Your certificate is ready.</p>
              <div className="space-y-3">
                <button onClick={() => { toast.success('Certificate downloaded!'); setShowCertificate(false); }}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all">
                  <Award size={18} className="inline mr-2" /> Download Certificate
                </button>
                <button onClick={() => { navigate('/my-courses'); }} className="w-full py-4 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white font-black rounded-2xl text-sm uppercase tracking-widest">
                  Back to My Courses
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePlayer;

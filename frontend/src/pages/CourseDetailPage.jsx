import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Clock, Users, Play, Check, ChevronDown, ChevronUp,
  ArrowRight, Loader2, Award, BookOpen, Globe, Monitor, ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOMeta from '../components/ui/SEOMeta';

const DEMO_COURSES = {
  'c1': {
    _id: 'c1', title: 'Full Stack Development Bootcamp', category: 'Full Stack Development',
    fees: 15000, duration: '6 Months', mode: 'Both', rating: 4.8, studentsCount: 1240,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    previewVideo: 'https://www.youtube.com/embed/nu_pCVPKzTk',
    trainerInfo: 'Rajesh Kumar — 8 Years @ Zoho, Expert in React & Node.js',
    description: 'Master MERN stack with live projects, deployment, and guaranteed placement support. Build 5 real-world applications and get job-ready in 6 months.',
    syllabus: [
      { module: 'Module 1: HTML, CSS & JavaScript Fundamentals', topics: ['HTML5 Semantics', 'CSS Flexbox & Grid', 'JavaScript ES6+', 'DOM Manipulation'] },
      { module: 'Module 2: React.js Deep Dive', topics: ['Components & Props', 'React Hooks', 'State Management', 'React Router', 'Context API'] },
      { module: 'Module 3: Node.js & Express Backend', topics: ['REST APIs', 'Express Routing', 'Middleware', 'JWT Authentication'] },
      { module: 'Module 4: MongoDB & Databases', topics: ['Schema Design', 'CRUD Operations', 'Mongoose ORM', 'Aggregation'] },
      { module: 'Module 5: Deployment & DevOps', topics: ['AWS EC2', 'Nginx', 'Docker Basics', 'CI/CD Pipelines'] },
    ],
  },
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (DEMO_COURSES[id]) { setCourse(DEMO_COURSES[id]); setLoading(false); return; }
        const { data } = await api.get(`/training/courses/${id}`);
        setCourse(data);
      } catch {
        setCourse(Object.values(DEMO_COURSES)[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!userInfo) { toast.error('Please login to enroll'); navigate('/login'); return; }
    setEnrolling(true);
    try {
      // Add to cart and redirect to checkout
      const cartItem = {
        _id: `course-${course._id}`,
        name: course.title,
        price: course.fees,
        qty: 1,
        image: course.image,
        isService: true,
        category: 'Course',
        courseId: course._id,
      };
      const existing = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updated = [...existing.filter(i => i._id !== cartItem._id), cartItem];
      localStorage.setItem('cartItems', JSON.stringify(updated));
      toast.success('Course added to cart!');
      setTimeout(() => navigate('/checkout'), 800);
    } catch {
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  if (!course) return null;

  const rating = course.rating || 4.8;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 pb-24">
      <SEOMeta title={`${course.title} | FIC Courses`} description={course.description} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-500/30">{course.category}</span>
                <span className="px-3 py-1 bg-white/10 text-white/70 text-[9px] font-black uppercase tracking-widest rounded-full">{course.mode}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4">{course.title}</h1>
              <p className="text-white/70 text-lg font-medium leading-relaxed mb-6 max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />)}
                  <span className="ml-2 font-black text-white">{rating}</span>
                  <span className="text-white/40 text-sm ml-1">({course.studentsCount?.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock size={14} /><span className="text-sm font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Globe size={14} /><span className="text-sm font-bold">{course.mode} Mode</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 w-fit">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Monitor size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Instructor</p>
                  <p className="text-sm font-black text-white">{course.trainerInfo || 'Expert Instructor'}</p>
                </div>
              </div>
            </div>

            {/* Right: Preview Video & Enrollment Widget */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-2xl overflow-hidden">
                {/* Preview Video */}
                <div className="relative aspect-video bg-slate-900">
                  {course.previewVideo ? (
                    <iframe src={course.previewVideo} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Play size={28} className="text-white fill-white ml-1" />
                        </div>
                        <p className="text-white/70 text-sm font-bold">Preview Available After Enrollment</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course Fee</p>
                    <p className="text-4xl font-black text-indigo-600">₹{course.fees?.toLocaleString()}</p>
                    <p className="text-[10px] text-green-500 font-black uppercase mt-1">EMI Available · No Hidden Fees</p>
                  </div>

                  <button onClick={handleEnroll} disabled={enrolling}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {enrolling ? <Loader2 className="animate-spin" size={18} /> : <><ArrowRight size={18} /> Enroll Now</>}
                  </button>

                  <div className="mt-5 space-y-3">
                    {['Certificate of Completion', 'Lifetime Access to Materials', 'Job Placement Support', 'Live Project Experience'].map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <Check size={14} className="text-green-500 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">30-Day Money Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(course.syllabus?.flatMap(s => s.topics) || ['Modern Development', 'Real Projects', 'Job Readiness', 'Industry Best Practices']).slice(0, 8).map((topic, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus Accordion */}
            {course.syllabus && (
              <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.syllabus.map((mod, i) => (
                    <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <button onClick={() => setOpenModule(openModule === i ? -1 : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[11px] font-black">{i + 1}</div>
                          <span className="font-black text-slate-900 dark:text-white text-sm">{mod.module}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-black uppercase">{mod.topics?.length || 0} topics</span>
                          {openModule === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openModule === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-5 space-y-2">
                              {mod.topics?.map((topic, j) => (
                                <div key={j} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-bg rounded-xl">
                                  <Play size={12} className="text-indigo-600 fill-indigo-600 shrink-0" />
                                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">This Course Includes</h3>
              {[
                { icon: Clock, label: `${course.duration} Duration` },
                { icon: Globe, label: `${course.mode} Mode Available` },
                { icon: BookOpen, label: `${course.syllabus?.length || 5} Modules` },
                { icon: Award, label: 'Completion Certificate' },
                { icon: Users, label: 'Live Doubt Sessions' },
                { icon: ShieldCheck, label: 'Placement Guarantee' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{label}</span>
                </div>
              ))}
              <button onClick={handleEnroll} disabled={enrolling}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl mt-4 hover:bg-indigo-700 transition-all">
                Enroll for ₹{course.fees?.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;

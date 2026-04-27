import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Rocket, GraduationCap, Briefcase, ChevronRight, Globe, 
  Code, Database, Layout, Smartphone, Search, Target, 
  Award, Star, CheckCircle2, Users, Building2, TrendingUp, Sparkles,
  ArrowUpRight, PlayCircle, Zap, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TrainingRegistrationForm from '../components/ui/TrainingRegistrationForm';
import CourseDetailsModal from '../components/ui/CourseDetailsModal';
import SEOMeta from '../components/ui/SEOMeta';
import api from '../services/api';

const StatCounter = ({ value, label, icon, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value.replace(/[^0-9]/g, ''));
            if (start === end) return;
            let duration = 2;
            let increment = end / (duration * 60);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 1000 / 60);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    const suffix = value.replace(/[0-9]/g, '');

    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay }}
            className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {React.cloneElement(icon, { size: 28 })}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {count.toLocaleString()}{suffix}
                    </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {label}
                </p>
            </div>
        </motion.div>
    );
};

const TrainingPlacementPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseData, setSelectedCourseData] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/training/courses');
      setDbCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openForm = (courseTitle = '') => {
    setSelectedCourse(courseTitle);
    setIsFormOpen(true);
  };

  const openDetails = (course) => {
    setSelectedCourseData(course);
    setIsDetailsOpen(true);
  };

  const mockCourses = [
    { title: 'Full Stack Development', icon: <Code />, category: 'Engineering', duration: '6 Months', mode: 'Hybrid', description: 'Master modern web architectures with MERN, Next.js, and scalable cloud deployments.' },
    { title: 'AI & Data Engineering', icon: <Database />, category: 'Data Science', duration: '5 Months', mode: 'Online', description: 'Harness the power of Python, ML models, and big data to build intelligent systems.' },
    { title: 'UX/UI Product Design', icon: <Layout />, category: 'Design', duration: '4 Months', mode: 'Online', description: 'Design premium digital products with advanced Figma techniques and user research.' },
  ];

  const displayCourses = dbCourses.length > 0 ? dbCourses : mockCourses;

  const stats = [
    { label: 'Active Learners', value: '12,500+', icon: <Users /> },
    { label: 'Hiring Network', value: '250+', icon: <Building2 /> },
    { label: 'Avg Placement', value: '92%', icon: <Target /> },
    { label: 'Global Mentors', value: '80+', icon: <Globe /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg font-['Poppins',_sans-serif] selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <SEOMeta 
        title="Training & Placement | Forge India Connect"
        description="Elite career transformation ecosystem. Industry-aligned training with guaranteed placement support."
      />

      <TrainingRegistrationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} selectedCourse={selectedCourse} />
      <CourseDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} course={selectedCourseData} />

      {/* ─── PREMIUM HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Gradients */}
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #312e81 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
            
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full mb-10 shadow-2xl">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Batch Open: June 2026</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[6.5rem] font-black text-slate-900 dark:text-white leading-[0.95] tracking-[-0.05em] mb-10 uppercase">
                  TRANSFORMING <br />
                  TALENT <span className="text-primary italic">INTO</span> <br />
                  <span className="relative inline-block">
                    CAREERS.
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute -bottom-2 left-0 h-4 bg-yellow-400/30 -z-10 rounded-full" 
                    />
                  </span>
                </h1>

                <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-xl lg:mx-0 mx-auto mb-12 leading-relaxed">
                  Join South India's premier IT ecosystem. Master high-demand skills and secure your future with 250+ enterprise partners.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                  <button 
                    onClick={() => openForm()}
                    className="group w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(49,46,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    Register Now
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button className="w-full sm:w-auto px-10 py-6 bg-white dark:bg-dark-card text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-800 shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                    <PlayCircle size={20} />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="flex-1 w-full relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative perspective-1000"
              >
                {/* Floating UI Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-10 left-10 md:-left-10 z-20 p-6 bg-white dark:bg-dark-card rounded-3xl shadow-3xl border border-slate-100 dark:border-slate-800 hidden md:block"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center"><CheckCircle2 size={24}/></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hired at Accenture</p>
                            <p className="text-xs font-black text-slate-900 dark:text-white">Priya S. (Full Stack)</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black">U{i}</div>)}
                    </div>
                </motion.div>

                <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] border-white dark:border-dark-card group">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                        alt="Collaboration" 
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-[80px] -z-10" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LOGO CLOUD ───────────────────────────────────────────── */}
      <div className="py-20 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Trusted by 250+ Enterprise Hiring Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 hover:opacity-100 transition-opacity duration-700">
                {['TCS', 'HCL', 'WIPRO', 'INFOSYS', 'ACCENTURE', 'COGNIZANT', 'ZOHO'].map(name => (
                    <span key={name} className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter grayscale hover:grayscale-0 transition-all cursor-default">{name}</span>
                ))}
            </div>
        </div>
      </div>

      {/* ─── STATS GRID ───────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <StatCounter key={i} {...stat} delay={i * 0.15} />
                ))}
            </div>
        </div>
      </section>

      {/* ─── CURRICULUM SECTION ───────────────────────────────────── */}
      <section id="courses" className="py-32 px-6 bg-slate-950 dark:bg-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">Elite Curriculums</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                        MASTER THE <br />
                        <span className="text-primary italic">DIGITAL STACK.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                        Industry-vetted programs designed to take you from foundational concepts to enterprise deployment.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {displayCourses.map((course, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 }}
                        className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 hover:bg-white/10 hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors duration-500 shadow-2xl">
                                {course.icon ? (typeof course.icon === 'string' ? <GraduationCap size={32}/> : React.cloneElement(course.icon, { size: 32 })) : <GraduationCap size={32} />}
                            </div>
                            <h3 className="text-3xl font-black text-white mb-6 tracking-tight uppercase leading-none">{course.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed mb-10 min-h-[100px]">{course.description}</p>
                            
                            <div className="flex gap-3 mb-12">
                                <span className="px-5 py-2 bg-white/5 text-[10px] font-black text-slate-300 rounded-full border border-white/10 uppercase tracking-[0.15em]">{course.duration}</span>
                                <span className="px-5 py-2 bg-white/5 text-[10px] font-black text-slate-300 rounded-full border border-white/10 uppercase tracking-[0.15em]">{course.mode}</span>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => openForm(course.title)}
                                    className="w-full py-6 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Start Journey
                                </button>
                                <button 
                                    onClick={() => openDetails(course)}
                                    className="w-full py-5 text-white/60 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors"
                                >
                                    View Syllabus
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITION ──────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">Career Acceleration</span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.95] mb-10">
                        WE DON'T JUST <br />
                        TRAIN. <br />
                        <span className="text-secondary italic">WE PLACE.</span>
                    </h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Resume Crafting', desc: 'Professional profiles optimized by HR experts for ATS tracking.', icon: <Layout /> },
                            { title: 'Interview Drills', desc: 'Mock interviews with leads from top tech firms.', icon: <Target /> },
                            { title: 'Network Access', desc: 'Direct referrals into our 250+ partner companies.', icon: <Globe /> }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="shrink-0 w-14 h-14 bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg mb-1">{item.title}</h4>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="bg-gradient-to-br from-primary/5 to-indigo-500/10 rounded-[4rem] p-8 md:p-16 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 text-center">
                                <p className="text-4xl font-black text-primary mb-1">95%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Placement <br/> Success</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 text-center translate-y-12">
                                <p className="text-4xl font-black text-yellow-500 mb-1">200+</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Hiring <br/> Partners</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 text-center">
                                <p className="text-4xl font-black text-indigo-500 mb-1">10k+</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Learners <br/> Impacted</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 text-center translate-y-12">
                                <p className="text-4xl font-black text-green-500 mb-1">15LPA</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Highest <br/> Package</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="relative bg-slate-900 rounded-[4rem] p-16 md:p-32 text-center overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-full h-full bg-primary/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Zap className="text-yellow-400 fill-yellow-400 mx-auto mb-10" size={64} />
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.9]">
                            READY TO <span className="text-primary italic">LAUNCH?</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-16">
                            Secure your place in our next career transformation batch. Enrollment is competitive and limited to 20 seats per cohort.
                        </p>
                        <button 
                            onClick={() => openForm()}
                            className="w-full sm:w-auto px-16 py-7 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            Claim My Seat Now
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>
      
    </div>
  );
};

export default TrainingPlacementPage;

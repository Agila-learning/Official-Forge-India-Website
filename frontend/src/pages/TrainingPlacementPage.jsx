import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, GraduationCap, Briefcase, ChevronRight, Globe, Code, Database, Layout, Smartphone, Search, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrainingRegistrationForm from '../components/ui/TrainingRegistrationForm';
import CourseDetailsModal from '../components/ui/CourseDetailsModal';
import api from '../services/api';

const TrainingPlacementPage = () => {
  const coursesRef = React.useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseData, setSelectedCourseData] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    window.onOpenRegistration = (courseTitle) => {
      setSelectedCourse(courseTitle);
      setIsFormOpen(true);
    };
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
    { title: 'Web Development', icon: <Globe className="text-blue-500" />, category: 'IT', duration: '6 Months', mode: 'Online/Offline', description: 'Master modern web technologies from HTML/CSS to advanced React and Node.js.' },
    { title: 'App Development', icon: <Smartphone className="text-purple-500" />, category: 'IT', duration: '6 Months', mode: 'Online/Offline', description: 'Build native and cross-platform mobile applications for iOS and Android.' },
    { title: 'Cloud Engineering', icon: <Database className="text-cyan-500" />, category: 'Cloud', duration: '4 Months', mode: 'Online', description: 'Learn to design, deploy and manage scalable cloud infrastructures on AWS/Azure.' },
  ];

  const displayCourses = dbCourses.length > 0 ? dbCourses : mockCourses;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pt-12 pb-24 relative overflow-x-hidden font-['Poppins',_sans-serif]">
      <TrainingRegistrationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        selectedCourse={selectedCourse} 
      />
      <CourseDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        course={selectedCourseData} 
      />

      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] bg-primary/5 rounded-full blur-[120px] -z-10 -mt-[60vw]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary font-black uppercase text-[10px] tracking-[0.3em] rounded-full mb-8">
                <Sparkles size={14} className="animate-pulse" />
                Empower Your Future
              </span>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 leading-tight uppercase">
                TRANSFORMING TALENT <br />
                <span className="text-primary italic">INTO CAREERS.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl lg:mx-0 mx-auto mb-12 leading-relaxed">
                Master the most in-demand IT skills with Forge India's expert-led training programs. From beginner to professional, we guide your path to placement.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <button 
                  onClick={() => openForm()}
                  className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  Register for Training
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('courses-section');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-dark-card text-gray-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                >
                  View All Courses
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Hero Image - Right Corner (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-5%] w-[50%] max-w-[600px] aspect-square"
          >
            <div className="relative w-full h-full p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10 w-full h-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white dark:border-gray-800 bg-white dark:bg-dark-card group">
                    <img 
                        src="/training_hero.png" 
                        alt="Training Excellence" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                </div>
                {/* Floaties */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[20%] -left-4 w-16 h-16 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center text-white font-black z-20">95%</motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-[20%] -right-8 w-20 h-20 bg-primary rounded-full shadow-xl flex items-center justify-center text-white font-black z-20">FIC</motion.div>
            </div>
          </motion.div>
          
          {/* Hero Image (Mobile) */}
          <div className="lg:hidden w-full mt-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800"
            >
              <img src="/training_hero.png" alt="Training" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section ref={coursesRef} id="courses-section" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-4">
                Explore Our <span className="text-primary">Curriculums</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium italic">
                Choose from our wide range of industry-aligned courses designed for the modern IT landscape.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button className="w-14 h-14 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {course.icon ? (typeof course.icon === 'string' ? <BookOpen size={32} /> : React.cloneElement(course.icon, { size: 32 })) : <GraduationCap size={32} />}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight uppercase group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {course.duration}
                  </span>
                  <span className="px-4 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {course.mode || 'Online/Offline'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => openForm(course.title)}
                    className="w-full py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
                  >
                    Enroll Now
                  </button>
                  <button 
                    onClick={() => openDetails(course)}
                    className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Support Section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/10 text-secondary font-black uppercase text-[10px] tracking-[0.3em] rounded-full mb-8">
                <Award size={14} />
                Career Acceleration
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-8">
                WE DON'T JUST TRAIN. <br />
                <span className="text-secondary italic">WE PLACE.</span>
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-12">
                Our comprehensive placement support ecosystem ensures that your training translates directly into employment opportunities with leading firms.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Resume Crafting', desc: 'Professional profile optimization by HR experts.' },
                  { title: 'Interview Drills', desc: 'Mock interview sessions and technical assessments.' },
                  { title: 'Network Access', desc: 'Direct connection to FIC\'s partner network.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0">
                      <ChevronRight size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-12 lg:mt-0">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] md:rounded-[4rem] flex items-center justify-center p-6 md:p-12 overflow-hidden shadow-2xl">
                 <div className="grid grid-cols-2 gap-4 md:gap-8 relative z-10 w-full">
                    <div className="p-4 md:p-8 bg-white dark:bg-dark-card rounded-2xl md:rounded-[3rem] shadow-xl text-center">
                        <p className="text-2xl md:text-4xl font-black text-primary mb-1">95%</p>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Placement Rate</p>
                    </div>
                    <div className="p-4 md:p-8 bg-white dark:bg-dark-card rounded-2xl md:rounded-[3rem] shadow-xl text-center mt-6 md:mt-12">
                        <p className="text-2xl md:text-4xl font-black text-secondary mb-1">200+</p>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Hiring Partners</p>
                    </div>
                    <div className="p-4 md:p-8 bg-white dark:bg-dark-card rounded-2xl md:rounded-[3rem] shadow-xl text-center -mt-6 md:-mt-12">
                        <p className="text-2xl md:text-4xl font-black text-yellow-500 mb-1">10k+</p>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Learners</p>
                    </div>
                    <div className="p-4 md:p-8 bg-white dark:bg-dark-card rounded-2xl md:rounded-[3rem] shadow-xl text-center">
                        <p className="text-2xl md:text-4xl font-black text-red-500 mb-1">15LPA</p>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Highest Package</p>
                    </div>
                 </div>
                 {/* Decorative floaters */}
                 <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-10 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
                 <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 blur-2xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Sparkles = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        className={className}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M12 3l1.912 4.912L18.824 9.824 13.912 11.736 12 16.648 10.088 11.736 5.176 9.824 10.088 7.912z" />
        <path d="M5 3l.956 2.456L8.412 6.412 5.956 7.368 5 9.824l-.956-2.456L1.588 6.412 4.044 5.456z" />
        <path d="M19 16l.956 2.456L22.412 19.412 19.956 20.368 19 22.824l-.956-2.456L15.588 19.412 18.044 18.456z" />
    </svg>
);

export default TrainingPlacementPage;

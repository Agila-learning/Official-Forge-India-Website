import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Rocket, GraduationCap, Briefcase, ChevronRight, Globe, 
  Code, Database, Layout, Smartphone, Search, Target, 
  Award, Star, CheckCircle2, Users, Building2, TrendingUp, Sparkles,
  ArrowRight, Shield, Zap, Monitor, Cpu, Terminal, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TrainingRegistrationForm from '../components/ui/TrainingRegistrationForm';
import CourseDetailsModal from '../components/ui/CourseDetailsModal';
import SEOMeta from '../components/ui/SEOMeta';
import api from '../services/api';

const StatBox = ({ value, label, icon, color, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="flex items-center gap-6 p-6 md:p-8 bg-white dark:bg-dark-card rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 dark:border-slate-800"
        >
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div>
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">{value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </motion.div>
    );
};

const CourseCard = ({ title, desc, duration, mode, icon, color, delay, onClick }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="group bg-white dark:bg-dark-card rounded-[2.5rem] p-10 flex flex-col border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-colors duration-500 ${color} text-white`}>
                {React.cloneElement(icon, { size: 32 })}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase leading-tight">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
            
            <div className="flex gap-3 mb-10">
                <span className="px-4 py-1.5 bg-slate-50 dark:bg-dark-bg text-[10px] font-black text-slate-400 rounded-full border border-slate-100 dark:border-slate-800 uppercase tracking-widest">{duration}</span>
                <span className="px-4 py-1.5 bg-slate-50 dark:bg-dark-bg text-[10px] font-black text-slate-400 rounded-full border border-slate-100 dark:border-slate-800 uppercase tracking-widest">{mode}</span>
            </div>

            <button 
                onClick={onClick}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] text-white shadow-xl hover:-translate-y-1 transition-all ${color}`}
            >
                View Syllabus <ArrowRight size={14} className="inline ml-2" />
            </button>
        </motion.div>
    );
};

const TrainingPlacementPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseData, setSelectedCourseData] = useState(null);

  const openForm = (courseTitle = '') => {
    setSelectedCourse(courseTitle);
    setIsFormOpen(true);
  };

  const openDetails = (course) => {
    setSelectedCourseData(course);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg font-['Poppins',_sans-serif] selection:bg-primary/20 selection:text-primary pt-12">
      <SEOMeta 
        title="Training & Placement | Forge India Connect"
        description="Elite career transformation ecosystem. Industry-aligned training with guaranteed placement support."
      />

      <TrainingRegistrationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} selectedCourse={selectedCourse} />
      <CourseDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} course={selectedCourseData} />

      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
            {/* Left Column */}
            <div className="flex-1 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 font-black uppercase text-[10px] tracking-[0.3em] rounded-full mb-8">
                  JUNE 2026 BATCH - ADMISSIONS OPEN
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-[-0.05em] leading-[0.9] mb-8 uppercase">
                  Transforming <br />
                  Talent into <br />
                  <span className="text-blue-600">Careers.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl lg:mx-0 mx-auto mb-10 leading-relaxed">
                  Join Forge India's premier training & placement ecosystem. Master in-demand skills and secure your future with 250+ hiring partners.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                  <button 
                    onClick={() => openForm()}
                    className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:-translate-y-1 transition-all"
                  >
                    Register for Training <ArrowRight size={14} className="inline ml-2" />
                  </button>
                  <button 
                    onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-dark-card text-slate-900 dark:text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all"
                  >
                    Explore Courses
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Award size={20}/></div>
                        <div className="text-left">
                            <p className="text-xs font-black text-slate-900 dark:text-white">Industry Experts</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Learn from top professionals</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Target size={20}/></div>
                        <div className="text-left">
                            <p className="text-xs font-black text-slate-900 dark:text-white">Real-world Projects</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Build. Practice. Excel.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Shield size={20}/></div>
                        <div className="text-left">
                            <p className="text-xs font-black text-slate-900 dark:text-white">100% Placement Support</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">We've got your back.</p>
                        </div>
                    </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-600/10 rounded-full blur-[80px] -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-[40px] border-orange-500/10 rounded-full -z-10 rotate-12" />
                
                <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white dark:border-dark-card">
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                        alt="Success" 
                        className="w-full h-auto"
                    />
                </div>

                {/* Floatie Card */}
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:-left-12 p-6 bg-white dark:bg-dark-card rounded-3xl shadow-3xl border border-slate-100 dark:border-slate-800 z-20 flex items-center gap-6 min-w-max"
                >
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black">U{i}</div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">+180</div>
                    </div>
                    <div>
                        <p className="text-xl font-black text-blue-600 leading-none">250+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Partners</p>
                    </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGO CLOUD ───────────────────────────────────────────── */}
      <div className="py-12 bg-white dark:bg-dark-bg border-y border-slate-50 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['TCS', 'HCL', 'Wipro', 'Infosys', 'Accenture', 'Cognizant', 'Zoho'].map(name => (
                <span key={name} className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{name}</span>
            ))}
        </div>
      </div>

      {/* ─── STATS GRID ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50/30 dark:bg-dark-bg/30">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatBox value="12,500+" label="Students Trained" icon={<Users />} color="bg-indigo-600" delay={0.1} />
                <StatBox value="250+" label="Hiring Partners" icon={<Building2 />} color="bg-blue-500" delay={0.2} />
                <StatBox value="92%" label="Placement Rate" icon={<CheckCircle2 />} color="bg-emerald-500" delay={0.3} />
                <StatBox value="80+" label="Expert Mentors" icon={<Award />} color="bg-orange-500" delay={0.4} />
            </div>
        </div>
      </section>

      {/* ─── CURRICULUM SECTION ───────────────────────────────────── */}
      <section id="curriculum" className="py-32 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex justify-between items-end mb-16">
                <div className="max-w-2xl">
                    <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">OUR CURRICULUMS</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase">
                        Master In-Demand Skills <br />
                        That <span className="text-blue-500">Drive Success.</span>
                    </h2>
                </div>
                <div className="hidden md:flex gap-4 mb-4">
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronRight size={20} className="rotate-180"/></button>
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronRight size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                <CourseCard 
                    title="Full Stack Development" 
                    desc="Build modern web applications with MERN stack and real-world projects." 
                    duration="6 Months" mode="Hybrid" 
                    icon={<Code />} color="bg-indigo-600" delay={0.1} 
                    onClick={() => openForm('Full Stack Development')}
                />
                <CourseCard 
                    title="AI & Data Engineering" 
                    desc="Learn data, ML and AI to build intelligent systems and data-driven solutions." 
                    duration="6 Months" mode="Online" 
                    icon={<Database />} color="bg-blue-500" delay={0.2} 
                    onClick={() => openForm('AI & Data Engineering')}
                />
                <CourseCard 
                    title="UI/UX Product Design" 
                    desc="Design beautiful digital products with advanced Figma techniques and user research." 
                    duration="4 Months" mode="Online" 
                    icon={<Layout />} color="bg-emerald-500" delay={0.3} 
                    onClick={() => openForm('UI/UX Product Design')}
                />
                <CourseCard 
                    title="Cloud Engineering" 
                    desc="Master cloud technologies and deployment on AWS, Azure & GCP." 
                    duration="4 Months" mode="Online" 
                    icon={<Globe />} color="bg-orange-500" delay={0.4} 
                    onClick={() => openForm('Cloud Engineering')}
                />
            </div>
        </div>
      </section>

      {/* ─── PLACEMENT ECOSYSTEM SECTION ───────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">CAREER ACCELERATION</span>
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-10 uppercase">
                        We Don't Just Train. <br />
                        <span className="text-emerald-500">We Place.</span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">
                        Our comprehensive support system ensures you're job-ready and employer-preferred from day one.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                            { title: 'Resume Crafting', desc: 'ATS-friendly & job-optimized profiles.', icon: <Layout /> },
                            { title: 'Interview Preparation', desc: 'Mock interviews & expert feedback.', icon: <Users /> },
                            { title: 'Network Access', desc: 'Connect with 250+ hiring partners.', icon: <Globe /> },
                            { title: 'Placement Support', desc: 'End-to-end placement assistance.', icon: <Target /> }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs mb-1">{item.title}</h4>
                                    <p className="text-slate-400 font-medium text-[10px] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Illustration & Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-8 md:p-12 bg-slate-50 dark:bg-dark-card rounded-[4rem] border border-slate-100 dark:border-slate-800"
                >
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        {[
                            { value: '95%', label: 'Placement Success', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { value: '250+', label: 'Hiring Partners', color: 'text-orange-500', bg: 'bg-orange-50' },
                            { value: '10k+', label: 'Active Learners', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { value: '15 LPA', label: 'Highest Package', color: 'text-rose-500', bg: 'bg-rose-50' }
                        ].map((s, i) => (
                            <div key={i} className="p-8 bg-white dark:bg-dark-bg rounded-[2.5rem] shadow-xl border border-white dark:border-slate-800 text-center flex flex-col items-center justify-center">
                                <div className={`w-12 h-12 ${s.bg} rounded-full mb-3 flex items-center justify-center`}>
                                    <Sparkles className={s.color} size={20} />
                                </div>
                                <p className={`text-3xl font-black ${s.color} mb-1 tracking-tighter`}>{s.value}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    {/* Character Illustration placeholder */}
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 opacity-20 pointer-events-none">
                        <Rocket size={200} className="text-blue-600" />
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative bg-gradient-to-r from-slate-900 to-[#020617] rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-3xl flex flex-col md:flex-row items-center justify-between gap-12"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="flex items-center gap-10 relative z-10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-bounce">
                        <Rocket size={48} className="text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-2">Ready to <span className="text-orange-500 italic">Launch</span> Your Career?</h2>
                        <p className="text-slate-400 font-medium max-w-lg">Enroll in our next batch and take the first step towards a successful future.</p>
                    </div>
                </div>

                <button 
                    onClick={() => openForm()}
                    className="relative z-10 px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                >
                    Claim My Seat Now <ArrowRight size={18} className="inline ml-2" />
                </button>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPlacementPage;

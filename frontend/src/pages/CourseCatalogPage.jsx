import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Clock, Users, BookOpen, ArrowRight, Loader2,
  Filter, Monitor, Code, Database, Layout, Globe, Smartphone,
  ChevronDown, Play, Award, CheckCircle
} from 'lucide-react';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';

const CATEGORIES = ['All', 'Web Development', 'App Development', 'Full Stack Development', 'UI/UX Design', 'Data Analytics Basics', 'Cloud Engineer', 'Digital Marketing', 'Software Testing', 'DevOps Basics'];
const MODES = ['All', 'Online', 'Offline', 'Both'];

const CAT_ICONS = {
  'Web Development': Globe, 'App Development': Smartphone, 'Full Stack Development': Code,
  'UI/UX Design': Layout, 'Data Analytics Basics': Database, 'Cloud Engineer': Monitor,
  'Digital Marketing': Monitor, 'Software Testing': CheckCircle, 'DevOps Basics': Monitor,
};

const DEMO_COURSES = [
  { _id: 'c1', title: 'Full Stack Development Bootcamp', category: 'Full Stack Development', fees: 15000, duration: '6 Months', mode: 'Both', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600', studentsCount: 1240, rating: 4.8, trainerInfo: 'Rajesh Kumar — 8 Years @ Zoho', description: 'Master MERN stack with live projects, deployment, and guaranteed placement support.' },
  { _id: 'c2', title: 'UI/UX Design Masterclass', category: 'UI/UX Design', fees: 12000, duration: '4 Months', mode: 'Online', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600', studentsCount: 890, rating: 4.9, trainerInfo: 'Priya Sharma — Senior Designer @ Swiggy', description: 'Figma, design systems, user research, and portfolio-ready projects.' },
  { _id: 'c3', title: 'Cloud Engineering with AWS & GCP', category: 'Cloud Engineer', fees: 18000, duration: '4 Months', mode: 'Online', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600', studentsCount: 560, rating: 4.7, trainerInfo: 'Arun Patel — AWS Solutions Architect', description: 'Get certified in AWS and GCP. Real cloud projects and hands-on labs.' },
  { _id: 'c4', title: 'Data Analytics with Python & Power BI', category: 'Data Analytics Basics', fees: 14000, duration: '3 Months', mode: 'Both', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', studentsCount: 780, rating: 4.6, trainerInfo: 'Meena Raj — Data Analyst @ TCS', description: 'From Excel to Python. Build dashboards and data pipelines for real businesses.' },
  { _id: 'c5', title: 'Digital Marketing Pro', category: 'Digital Marketing', fees: 9000, duration: '3 Months', mode: 'Online', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600', studentsCount: 1560, rating: 4.5, trainerInfo: 'Vikram Singh — Marketing Head @ Freshworks', description: 'SEO, social media, Google Ads, and analytics — master the full funnel.' },
  { _id: 'c6', title: 'React Native Mobile App Development', category: 'App Development', fees: 16000, duration: '5 Months', mode: 'Online', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600', studentsCount: 430, rating: 4.7, trainerInfo: 'Deepak M — Lead Dev @ Ola', description: 'Build cross-platform iOS & Android apps. Deploy to App Store & Play Store.' },
];

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const Icon = CAT_ICONS[course.category] || Code;
  const rating = course.rating || 4.5;
  const students = course.studentsCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img src={course.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600'} alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
            <Play size={24} className="text-blue-600 fill-blue-600 ml-1" />
          </div>
        </div>
        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
          {course.mode || 'Online'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon size={12} className="text-blue-600" />
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{course.category}</span>
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{course.description}</p>

        <div className="flex items-center gap-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
          <span className="flex items-center gap-1"><Users size={11} />{students.toLocaleString()} Students</span>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />)}
          </div>
          <span className="text-[10px] font-black text-slate-500">{rating}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Course Fee</p>
            <p className="text-2xl font-black text-blue-600">₹{course.fees?.toLocaleString()}</p>
          </div>
          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-lg">
            Enroll <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMode, setActiveMode] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/training/courses');
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(DEMO_COURSES);
        }
      } catch {
        setCourses(DEMO_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];
    if (search) result = result.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'All') result = result.filter(c => c.category === activeCategory);
    if (activeMode !== 'All') result = result.filter(c => c.mode === activeMode || c.mode === 'Both');
    if (sortBy === 'price-low') result.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    if (sortBy === 'price-high') result.sort((a, b) => (b.fees || 0) - (a.fees || 0));
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setFiltered(result);
  }, [search, activeCategory, activeMode, sortBy, courses]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 pb-20">
      <SEOMeta title="Courses & Training | Forge India Connect" description="Industry-aligned training with guaranteed placement support. Learn Full Stack, AI, Cloud, and more." />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-purple-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Award size={12} /> Skill Academy — FIC
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
              Learn. Build. <span className="text-yellow-300">Get Hired.</span>
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto mb-10">
              Industry-led courses with live projects, mentorship, and placement support.
            </p>
            <div className="flex items-center gap-3 max-w-xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <Search size={18} className="text-slate-400 ml-3 shrink-0" />
              <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 py-3 text-slate-900 font-medium text-sm outline-none bg-transparent" />
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Search</button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
          {[{ v: '12,500+', l: 'Students Trained' }, { v: '250+', l: 'Hiring Partners' }, { v: '92%', l: 'Placement Rate' }, { v: '80+', l: 'Expert Mentors' }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black text-indigo-600">{s.v}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.slice(0, 5).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-dark-bg text-slate-500 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select value={activeMode} onChange={e => setActiveMode(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white font-black text-[9px] uppercase tracking-widest rounded-xl outline-none cursor-pointer">
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-slate-100 dark:bg-dark-bg text-slate-700 dark:text-white font-black text-[9px] uppercase tracking-widest rounded-xl outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low</option>
              <option value="price-high">Price: High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 size={40} className="animate-spin text-indigo-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={60} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase">No courses found</h3>
            <button onClick={() => { setActiveCategory('All'); setSearch(''); }} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Reset Filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">{filtered.length} Courses Available</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogPage;

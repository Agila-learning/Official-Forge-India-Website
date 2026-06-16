import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Store, Briefcase, Truck, ArrowRight, 
  ChevronLeft, ChevronRight, Star, CheckCircle, MapPin, Search,
  TrendingUp, Users, Activity, FileText, Calendar, Network,
  BarChart, Settings, Zap, GraduationCap, LayoutDashboard, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import indiaMapModule from '@svg-maps/india';
const indiaMapData = indiaMapModule.default || indiaMapModule;

const slides = [
  {
    id: 1,
    title: 'Shopping Marketplace',
    heading: 'Shop Smarter, Connect Faster',
    subtitle: 'Discover quality products from trusted sellers.',
    primaryBtn: 'Start Shopping',
    secondaryBtn: 'Explore Products',
    primaryLink: '/explore-shop',
    secondaryLink: '/explore-shop',
    type: 'shopping'
  },
  {
    id: 2,
    title: 'Hiring & Careers',
    heading: 'Find Talent. Build Careers.',
    subtitle: 'Connect skilled professionals with opportunities and growing businesses.',
    primaryBtn: 'Find Jobs',
    secondaryBtn: 'Hire Talent',
    primaryLink: '/jobs',
    secondaryLink: '/contact',
    type: 'jobs'
  },
  {
    id: 3,
    title: 'Vendor Network',
    heading: 'Connect With Trusted Vendors',
    subtitle: 'Expand your business with verified partners.',
    primaryBtn: 'Join Marketplace',
    secondaryBtn: 'Become Vendor',
    primaryLink: '/register',
    secondaryLink: '/register',
    type: 'vendors'
  },
  {
    id: 4,
    title: 'Forge Services',
    heading: 'Power Your Business Growth',
    subtitle: 'Explore smart solutions and professional services.',
    primaryBtn: 'Explore Services',
    secondaryBtn: 'Get Started',
    primaryLink: '/services',
    secondaryLink: '/contact',
    type: 'services'
  }
];

const FloatingCard = ({ children, delay = 0, className = "", style = {} }) => {
  return (
    <div className={`absolute ${className}`} style={style}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay },
          opacity: { duration: 0.5 }
        }}
        whileHover={{ scale: 1.02, boxShadow: "0px 20px 40px rgba(0,87,255,0.15)" }}
        className="w-full h-full bg-white/95 backdrop-blur-xl border-t border-l border-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-2xl p-4 relative"
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const SlideVisuals = ({ type }) => {
  switch (type) {
    case 'shopping':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background Tracking Card */}
          <FloatingCard delay={0.2} className="w-56 z-10 absolute top-[25%] left-[65%] -translate-x-1/2 -translate-y-1/2 opacity-70">
            <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Truck size={16} className="text-green-600"/></div>
              <p className="font-bold text-xs text-gray-900">Order Tracking</p>
            </div>
            <div className="relative pl-4 space-y-3 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-0.5 before:bg-green-200">
              <div className="relative">
                <div className="absolute left-[-19px] top-1.5 w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-[9px] text-gray-400 font-bold uppercase">Dispatched</p>
              </div>
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-3 h-3 bg-[#0057FF] rounded-full ring-2 ring-white shadow-[0_0_10px_#0057FF]" />
                <p className="text-[9px] text-[#0057FF] font-bold uppercase">Out for delivery</p>
              </div>
            </div>
          </FloatingCard>

          {/* Main Product Card */}
          <FloatingCard delay={0} className="w-64 z-20 absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg rotate-12 z-10">
              <span className="font-black text-xs">-20%</span>
            </div>
            <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
              <ShoppingBag size={48} className="text-[#0057FF] opacity-50 drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex items-center gap-1 mb-1">
              <span className="bg-blue-100 text-[#0057FF] text-[8px] font-black uppercase px-2 py-0.5 rounded">Verified</span>
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
              </div>
            </div>
            <h4 className="font-bold text-gray-900 leading-tight">Premium Wireless Headphones</h4>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 line-through mr-1">₹5,999</span>
                <span className="font-black text-lg text-gray-900">₹4,999</span>
              </div>
              <button className="bg-[#0057FF] text-white text-[10px] px-3 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">Buy Now</button>
            </div>
          </FloatingCard>

          {/* Floating Elements */}
          <FloatingCard delay={0.5} className="absolute top-[20%] left-[30%] z-30 p-3 !rounded-full bg-white shadow-xl shadow-blue-500/10 border-none">
            <ShoppingCart size={20} className="text-blue-500" />
          </FloatingCard>
          
          <FloatingCard delay={0.8} className="absolute top-[55%] left-[65%] z-30 p-3 !rounded-full bg-white shadow-xl shadow-amber-500/10 border-none">
            <span className="text-xl drop-shadow-md">📦</span>
          </FloatingCard>
        </div>
      );
    case 'jobs':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Candidate Profile Card */}
          <FloatingCard delay={0.2} className="w-64 z-10 absolute top-[25%] left-[65%] -translate-x-1/2 -translate-y-1/2 opacity-90 border-l-[3px] border-l-emerald-500">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100/50">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-200 shadow-sm relative">
                <img src="https://i.pravatar.cc/150?img=11" alt="Candidate" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-black text-xs text-gray-900 uppercase tracking-widest">Candidate</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <Activity size={10} /> 98% Match
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_10px_#10b981]" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[8px] bg-emerald-50/80 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-md font-black tracking-widest uppercase">React</span>
                <span className="text-[8px] bg-blue-50/80 text-blue-700 border border-blue-100 px-2 py-1 rounded-md font-black tracking-widest uppercase">Node.js</span>
                <span className="text-[8px] bg-gray-50/80 text-gray-600 border border-gray-100 px-2 py-1 rounded-md font-black tracking-widest uppercase">5 Yrs</span>
              </div>
            </div>
          </FloatingCard>

          {/* Main Job Card */}
          <FloatingCard delay={0} className="w-72 z-20 absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">Senior Tech Lead</h4>
                  <p className="text-[10px] text-[#0057FF] font-bold uppercase tracking-widest mt-0.5">InnovateX Corp</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-5 font-medium leading-relaxed">Looking for an experienced leader to drive our enterprise SaaS architecture and mentor a team of growing developers.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> Location</p>
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Bangalore</p>
              </div>
              <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><BarChart size={10} /> Salary</p>
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">₹24L - ₹32L</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] py-3 rounded-xl font-black tracking-widest uppercase shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Apply Now
            </button>
          </FloatingCard>

          {/* Interview Calendar Popup */}
          <FloatingCard delay={0.5} className="w-48 z-30 absolute top-[55%] left-[65%] -translate-x-1/2 -translate-y-1/2 border-l-[3px] border-l-amber-400 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex flex-col items-center justify-center text-amber-500 relative overflow-hidden">
                <div className="w-full h-3 bg-amber-400 absolute top-0"></div>
                <span className="text-[8px] font-black uppercase mt-1 text-white z-10 absolute top-0">Oct</span>
                <span className="text-sm font-black mt-2">14</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-[10px] text-gray-900 uppercase tracking-widest">Interview</p>
                <p className="text-[9px] font-bold text-amber-600 mt-0.5">10:00 AM IST</p>
              </div>
            </div>
          </FloatingCard>

          {/* Glowing Connection Lines between cards */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }}>
            <path d="M 40 55 Q 60 45 70 30" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" className="animate-[dash_20s_linear_infinite]" />
          </svg>
        </div>
      );
    case 'vendors':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background Analytics Card */}
          <FloatingCard delay={0.4} className="w-64 z-10 absolute top-[25%] left-[65%] -translate-x-1/2 -translate-y-1/2 opacity-70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart size={16} className="text-indigo-500" />
                <p className="font-bold text-xs text-gray-900">Monthly Sales</p>
              </div>
              <span className="text-[10px] font-black text-emerald-500">+24.5%</span>
            </div>
            <div className="flex items-end gap-1 h-16 w-full mt-2">
              {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
                <div key={i} className="w-full bg-indigo-100 rounded-t-sm relative group">
                  <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500" style={{ height: `${height}%` }}></div>
                </div>
              ))}
            </div>
          </FloatingCard>

          {/* Main Vendor Card */}
          <FloatingCard delay={0} className="w-72 z-20 absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-50 text-[#0057FF] px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle size={10} /> <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-md relative">
                <img src="https://i.pravatar.cc/150?img=32" alt="Vendor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg leading-tight">Global Logistics</h4>
                <p className="text-xs text-gray-500 font-medium">B2B Supply Chain</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                <p className="text-[8px] text-gray-400 font-bold uppercase">Orders</p>
                <p className="font-black text-gray-900 text-sm">1.2k+</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                <p className="text-[8px] text-gray-400 font-bold uppercase">Rating</p>
                <p className="font-black text-gray-900 text-sm flex items-center justify-center gap-0.5">4.9<Star size={10} className="text-amber-400 fill-amber-400"/></p>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                <p className="text-[8px] text-gray-400 font-bold uppercase">Clients</p>
                <p className="font-black text-gray-900 text-sm">340</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#0057FF] text-white text-xs py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform">
                Connect
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          </FloatingCard>

          {/* Floating Elements */}
          <FloatingCard delay={0.6} className="absolute top-[20%] left-[30%] z-30 p-3 !rounded-full bg-white shadow-xl shadow-amber-500/10 border-none">
            <span className="text-xl drop-shadow-md">🤝</span>
          </FloatingCard>
          
          <FloatingCard delay={0.9} className="absolute top-[55%] left-[65%] z-30 p-3 !rounded-full bg-white shadow-xl shadow-indigo-500/10 border-none">
            <Network size={20} className="text-indigo-500" />
          </FloatingCard>
        </div>
      );
    case 'services':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Services Dashboard */}
          <FloatingCard delay={0} className="w-[340px] z-20 absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Business Solutions</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Explore Categories</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all group">
                <div className="w-8 h-8 bg-blue-100 text-[#0057FF] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Briefcase size={16} />
                </div>
                <h5 className="font-bold text-gray-900 text-xs">Consulting</h5>
                <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">Expert business strategy</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-gray-100 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer transition-all group">
                <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Settings size={16} />
                </div>
                <h5 className="font-bold text-gray-900 text-xs">Technology</h5>
                <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">IT & Software solutions</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer transition-all group">
                <div className="w-8 h-8 bg-amber-100 text-amber-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Star size={16} />
                </div>
                <h5 className="font-bold text-gray-900 text-xs">Marketing</h5>
                <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">Digital growth & SEO</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer transition-all group">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Zap size={16} />
                </div>
                <h5 className="font-bold text-gray-900 text-xs">Support</h5>
                <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">24/7 technical help</p>
              </div>
            </div>
            
            <button className="w-full bg-[#0057FF] text-white text-xs py-3 rounded-xl font-bold hover:scale-[1.02] shadow-lg shadow-blue-500/30 transition-transform flex items-center justify-center gap-2">
              View All Services <ArrowRight size={14} />
            </button>
          </FloatingCard>

          {/* Floating AI Glow */}
          <FloatingCard delay={0.5} className="absolute top-[20%] right-[25%] z-30 p-4 !rounded-full bg-white shadow-2xl shadow-cyan-500/20 border-none">
            <Zap size={24} className="text-cyan-500 animate-pulse" />
          </FloatingCard>
          <FloatingCard delay={0.8} className="absolute top-[55%] left-[25%] z-30 p-3 !rounded-full bg-white shadow-xl shadow-blue-500/10 border-none">
            <Settings size={20} className="text-blue-500" />
          </FloatingCard>
        </div>
      );
    default:
      return null;
  }
};

const IndiaNetworkMap = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-70">
      <svg 
        viewBox="0 0 612 696" 
        className="w-[120%] h-[120%] max-w-[1200px] drop-shadow-[0_0_15px_rgba(0,87,255,0.4)]" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render each state path from the vector library */}
        <g stroke="rgba(0, 87, 255, 0.4)" strokeWidth="1.5" fill="rgba(0, 87, 255, 0.05)">
          {indiaMapData.locations && indiaMapData.locations.map((loc) => (
            <path 
              key={loc.id} 
              d={loc.path} 
              className="hover:fill-[rgba(0,87,255,0.2)] transition-colors duration-500" 
            />
          ))}
        </g>
        
        {/* Animated Network Curves linking major regions across the actual map coordinates */}
        {/* Delhi to Mumbai */}
        <path d="M 210,180 Q 150,300 130,400" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
        {/* Mumbai to Bangalore */}
        <path d="M 130,400 Q 180,500 200,560" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
        {/* Bangalore to Chennai */}
        <path d="M 200,560 Q 250,580 260,540" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
        {/* Delhi to Kolkata */}
        <path d="M 210,180 Q 350,250 450,320" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
        {/* Kolkata to Hyderabad */}
        <path d="M 450,320 Q 350,400 240,430" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
        
        {/* Glowing Data Nodes marking hubs */}
        {[
          { cx: 210, cy: 180 }, // Delhi
          { cx: 130, cy: 400 }, // Mumbai
          { cx: 200, cy: 560 }, // Bangalore
          { cx: 260, cy: 540 }, // Chennai
          { cx: 450, cy: 320 }, // Kolkata
          { cx: 240, cy: 430 }  // Hyderabad
        ].map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.cx} cy={node.cy} r="4.5" fill="#10b981" className="shadow-[0_0_15px_#10b981]" />
            <circle cx={node.cx} cy={node.cy} r="12" fill="none" stroke="#10b981" strokeWidth="1.5">
              <animate attributeName="r" values="4.5; 18; 4.5" dur={`${2 + Math.random()}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1; 0; 1" dur={`${2 + Math.random()}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative w-full h-auto min-h-[100svh] lg:h-[100svh] pt-24 pb-12 lg:pt-28 lg:pb-0 bg-[#000d26] overflow-hidden flex items-center justify-center">
      {/* Animated Gradient & Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0057FF]/20 via-[#000d26] to-[#000d26] z-0" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#0057FF]/20 blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1], x: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-yellow-500/10 blur-[100px] mix-blend-screen"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full shadow-[0_0_10px_white]"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5 
              }}
              animate={{ 
                y: [null, Math.random() * -200 - 100],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Dynamic Abstract Network Map (Hidden on Jobs slide) */}
        {activeSlide.type !== 'jobs' && <IndiaNetworkMap />}

        {/* Futuristic Careers Network (Only on Jobs slide) */}
        {activeSlide.type === 'jobs' && (
          <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Abstract glowing arcs */}
              <path d="M -100 800 Q 500 100 1200 600" fill="none" stroke="rgba(0,87,255,0.2)" strokeWidth="1" />
              <path d="M 0 200 Q 800 -100 1600 800" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
              <path d="M 200 1000 Q 1000 400 1800 900" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
              {/* Vertical connecting lines simulating data transfer */}
              {[...Array(15)].map((_, i) => (
                <line 
                  key={i} 
                  x1={`${i * 7}%`} y1="0" 
                  x2={`${i * 7}%`} y2="100%" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="1" 
                />
              ))}
              {/* Horizontal connecting lines */}
              {[...Array(10)].map((_, i) => (
                <line 
                  key={`h-${i}`} 
                  x1="0" y1={`${i * 10}%`} 
                  x2="100%" y2={`${i * 10}%`} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="1" 
                />
              ))}
            </svg>
            {/* Soft glowing people/nodes animation */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`node-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-[1536px] mx-auto px-6 sm:px-8 md:px-12 lg:px-24 h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Left Content Area (Dynamic based on Slide) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left shrink-0 z-20 lg:pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pill-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-200">
                {activeSlide.title}
              </span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.h1 
              key={`heading-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black leading-[1.05] tracking-tighter text-white mb-6 drop-shadow-2xl"
            >
              {activeSlide.heading.split(',').map((part, index, array) => (
                <React.Fragment key={index}>
                  {index === 0 ? part + (array.length > 1 ? ',' : '') : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-amber-400 animate-gradient block mt-2">
                      {part}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p 
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-blue-100/70 font-medium mb-10 max-w-lg leading-relaxed"
            >
              {activeSlide.subtitle}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div 
              key={`btns-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary Button */}
              <button 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(activeSlide.primaryLink)}
                className="relative overflow-hidden group bg-[#0057FF] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,87,255,0.4)] hover:shadow-[0_0_60px_rgba(0,87,255,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[ripple_1s_ease-in-out_infinite]" />
                <span className="relative z-10">{activeSlide.primaryBtn}</span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  className="relative z-10"
                >
                  <ArrowRight size={18} />
                </motion.div>
              </button>

              {/* Secondary Button */}
              <button 
                onClick={() => navigate(activeSlide.secondaryLink)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-md shadow-lg"
              >
                {activeSlide.secondaryBtn}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Visual Area */}
        <div className="w-full lg:w-1/2 h-[450px] lg:h-[650px] relative flex items-center justify-center">


          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50, rotateY: -20 }}
              transition={{ duration: 0.7, type: "spring", damping: 25 }}
              className="absolute inset-0 z-10"
              style={{ perspective: 1000 }}
            >
              <SlideVisuals type={activeSlide.type} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 right-0 lg:-right-4 flex items-center gap-3 z-50">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#0057FF] hover:border-[#0057FF] hover:scale-110 active:scale-90 transition-all backdrop-blur-md shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#0057FF] hover:border-[#0057FF] hover:scale-110 active:scale-90 transition-all backdrop-blur-md shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

      </div>

      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 rounded-full ${
              currentSlide === idx 
                ? 'w-12 h-2.5 bg-[#0057FF] shadow-[0_0_15px_#0057FF]' 
                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

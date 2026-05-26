import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  ArrowRight, Briefcase, ShoppingBag, Wrench, ShieldCheck, 
  MapPin, Cpu, Users, Star, CheckCircle, Search, Package, Bell, Truck, LocateFixed,
  Headphones, Monitor, Calendar, ShoppingCart, Handshake, Laptop
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  // Pincode State
  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState('idle'); // idle, loading, success, error

  const handlePincodeSearch = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setPinStatus('error');
      return;
    }
    setPinStatus('loading');
    setTimeout(() => {
      if (pincode.startsWith('6') || pincode.startsWith('5') || pincode.startsWith('1') || pincode.startsWith('4')) {
        setPinStatus('success');
      } else {
        setPinStatus('error');
      }
    }, 1000);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Left Column Stagger Entry
      gsap.from(".gsap-left-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

      // Right Column Entry
      gsap.from(".gsap-right-col", {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.4
      });

      // Bottom Strip Entry
      gsap.from(".gsap-bottom-strip", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] bg-[#f8fafe] overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-20">
      
      {/* Background Map & Routing Ecosystem */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.07] flex items-center justify-center">
        {/* Abstract Dotted Map Representation */}
        <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#3b82f6" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGrid)" mask="url(#mapMask)" />
          
          {/* Animated Connecting Delivery Routes */}
          <motion.path 
            d="M 200 400 Q 300 150 500 300 T 800 200" 
            stroke="#2563eb" strokeWidth="4" strokeDasharray="10 10" fill="none"
            animate={{ strokeDashoffset: [0, -100] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M 150 200 Q 400 450 700 400" 
            stroke="#7c3aed" strokeWidth="4" strokeDasharray="10 10" fill="none"
            animate={{ strokeDashoffset: [0, -100] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Glowing GPS Pins */}
        <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-50" />
        <div className="absolute top-[50%] left-[50%] w-4 h-4 bg-purple-500 rounded-full animate-ping opacity-50" />
        <div className="absolute top-[35%] right-[20%] w-4 h-4 bg-green-500 rounded-full animate-ping opacity-50" />
        
        {/* Animated Scooter */}
        <motion.div 
          animate={{ x: [0, 300, 600, 0], y: [0, -150, 0, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[15%] w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-orange-100"
        >
          <Truck className="text-orange-500" size={24} />
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-20">
            {/* Top Tag */}
            <div className="gsap-left-item inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-700">
                One Platform Multiple Business Solutions
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="gsap-left-item text-5xl sm:text-6xl lg:text-[5rem] font-black text-slate-900 leading-[1.05] tracking-tighter mb-6">
              One Platform.<br />
              {/* CSS Animated Gradient Text */}
              <span className="gradient-heading">
                Multiple
              </span><br />
              Business<br />
              Solutions.
            </h1>

            {/* Description */}
            <p className="gsap-left-item text-lg text-slate-600 font-medium max-w-xl mb-10 leading-relaxed">
              A unified ecosystem for <span className="text-purple-600 font-bold">Job Opportunities</span>, 
              <span className="text-orange-500 font-bold"> Product Commerce</span>, and 
              <span className="text-green-600 font-bold"> Service Solutions</span>. 
              All in one intelligent platform.
            </p>

            {/* Action Buttons */}
            <div className="gsap-left-item flex flex-wrap items-center gap-4 mb-10">
              <button 
                onClick={() => navigate('/services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                Explore Services <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => navigate('/candidate/jobs')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
              >
                Find Jobs <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-green-600/20"
              >
                Join Partner <ArrowRight size={16} />
              </button>
            </div>

            {/* Trust Badge */}
            <div className="gsap-left-item flex items-center gap-4 mb-12">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://i.pravatar.cc/100?img=4" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">+</div>
              </div>
              <div>
                <div className="flex gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">Trusted by 5K+ Businesses</span>
              </div>
            </div>

            {/* Dynamic Pincode Search (Replacing Stats) */}
            <div className="gsap-left-item w-full max-w-xl bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <LocateFixed size={18} className="text-blue-600" /> Check Availability in your Area
              </h4>
              <form onSubmit={handlePincodeSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={pinStatus === 'loading'}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {pinStatus === 'loading' ? 'Checking...' : 'Check'}
                </button>
              </form>
              
              {/* Dynamic Status Display */}
              {pinStatus === 'success' && (
                <div className="mt-3 text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle size={14} /> Services are fully available in {pincode}!
                </div>
              )}
              {pinStatus === 'error' && (
                <div className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 px-3 py-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {pincode.length !== 6 ? 'Please enter a valid 6-digit pincode.' : 'Currently expanding to your area. Stay tuned!'}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Animated Ecosystem Map) */}
          <div className="gsap-right-col lg:col-span-6 relative w-full h-[600px] lg:h-[700px] flex items-center justify-center hidden sm:flex z-10 perspective-1000">
            
            {/* SVG Connecting Lines and Map Representation */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
              <svg className="w-[120%] h-[120%] opacity-40 animate-pulse-slow" viewBox="0 0 1000 1000">
                {/* Stylized Node Grid - Background */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#3b82f6" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Simulated Map Silhouette (Abstract Poly) */}
                <path d="M400,200 L500,100 L650,250 L600,400 L700,500 L650,700 L550,850 L450,750 L350,800 L300,600 L200,450 Z" 
                      fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="10 10" opacity="0.2" className="animate-pulse" />

                {/* Connecting Business Routes from Center to Cards */}
                <motion.path d="M500,500 L250,250" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L700,150" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L850,250" stroke="#f97316" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L150,450" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L900,450" stroke="#10b981" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L250,700" stroke="#10b981" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L450,850" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L750,750" stroke="#10b981" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.path d="M500,500 L850,600" stroke="#f97316" strokeWidth="2" strokeDasharray="8 8" fill="none" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
              </svg>
            </div>

            {/* Glowing Map Nodes */}
            <div className="absolute top-[30%] right-[20%] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] animate-ping opacity-80 z-10" />
            <div className="absolute bottom-[30%] left-[20%] w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_#8b5cf6] animate-ping opacity-80 z-10" />
            <div className="absolute top-[40%] left-[30%] w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_#10b981] animate-ping opacity-80 z-10" />
            <div className="absolute bottom-[20%] right-[30%] w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_20px_#f97316] animate-ping opacity-80 z-10" />

            {/* Central Hub */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-20 w-48 h-48 bg-white rounded-full shadow-[0_0_60px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center border-4 border-blue-50 backdrop-blur-xl"
            >
              <img src="/hero-logo.jpg" alt="Logo" className="w-[85%] h-[85%] object-contain rounded-full" />
            </motion.div>

            {/* --- 10 HTML FLOATING CARDS --- */}
            
            {/* 1. Job Hiring (Top Left, Blue) */}
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[0%] z-30 w-[160px]">
              <Link to="/hr" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-blue-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md"><Briefcase size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Job Hiring</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-blue-500 w-[80%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[60%]"><div className="h-full bg-blue-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 2. Remote Hiring (Top Center-Right, Purple) */}
            <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute top-[0%] right-[20%] z-30 w-[160px]">
              <Link to="/hr" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-purple-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md"><Users size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Remote Hiring</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-purple-500 w-[70%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[50%]"><div className="h-full bg-purple-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 3. Products (Top Right, Orange) */}
            <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="absolute top-[20%] right-[0%] z-30 w-[160px]">
              <Link to="/vendor/products" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-orange-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md"><Package size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Products</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-orange-500 w-[90%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[40%]"><div className="h-full bg-orange-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 4. Customer Support (Center Left, Purple) */}
            <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute top-[40%] left-[-10%] z-30 w-[160px]">
              <Link to="/contact" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-purple-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-md"><Headphones size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Support</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-purple-500 w-[60%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[80%]"><div className="h-full bg-purple-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 5. Ecommerce Orders (Center Right, Green) */}
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="absolute top-[45%] right-[-5%] z-30 w-[160px]">
              <Link to="/vendor/orders" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-green-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-md"><ShoppingCart size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Orders</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-green-500 w-[85%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[65%]"><div className="h-full bg-green-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 6. Digital Services (Bottom Left, Green) */}
            <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[20%] left-[5%] z-30 w-[160px]">
              <Link to="/services" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-green-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-md"><Monitor size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Digital Services</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-green-500 w-[75%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[45%]"><div className="h-full bg-green-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 7. Online Booking (Bottom Center, Blue) */}
            <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute bottom-[5%] left-[30%] z-30 w-[160px]">
              <Link to="/services" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-blue-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md"><Calendar size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Booking</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-blue-500 w-[55%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[95%]"><div className="h-full bg-blue-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 8. Services (Bottom Center Right, Green) */}
            <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} className="absolute bottom-[15%] right-[25%] z-30 w-[160px]">
              <Link to="/services" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-green-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-md"><Wrench size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Services</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-green-500 w-[80%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[60%]"><div className="h-full bg-green-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 9. Business Partners (Bottom Right, Orange) */}
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-[35%] right-[5%] z-30 w-[160px]">
              <Link to="/partner" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-orange-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md"><Handshake size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Partners</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-full"><div className="h-full bg-orange-500 w-[70%] animate-pulse" /></div>
                  <div className="h-1 bg-slate-100 rounded-full w-[50%]"><div className="h-full bg-orange-400 w-[100%]" /></div>
                </div>
              </Link>
            </motion.div>

            {/* 10. Find Jobs (Bottom Right Corner, Purple) */}
            <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} className="absolute bottom-[0%] right-[0%] z-30 w-[160px]">
              <Link to="/candidate/jobs" className="block bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-purple-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md"><Search size={14} /></div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Find Jobs</span>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white shadow-sm" />)}
                  <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-purple-600">+</div>
                </div>
              </Link>
            </motion.div>

          </div>

        </div>

        {/* Bottom Feature Strip */}
        <div className="gsap-bottom-strip mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 relative z-20">
          {[
            { icon: ShieldCheck, text: "Secure & Reliable" },
            { icon: MapPin, text: "Real-time Tracking" },
            { icon: Cpu, text: "Smart Automation" },
            { icon: Users, text: "AI Powered Platform" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={16} className="text-slate-400" />
              <span className="text-xs sm:text-sm font-semibold text-slate-600">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

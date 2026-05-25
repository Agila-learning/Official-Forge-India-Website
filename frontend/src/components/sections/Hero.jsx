import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Zap, Smartphone, Package, 
  ShoppingBag, Truck, CheckCircle, TrendingUp, Users, Target
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import toast from 'react-hot-toast';

const FloatingCard = ({ delay, className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, type: 'spring', stiffness: 100 }}
    className={`absolute bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const LocationPin = ({ top, left, delay, city, isActive = false }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="absolute flex items-center justify-center group z-20"
    style={{ top, left }}
  >
    {isActive && (
      <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping pointer-events-none" />
    )}
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'bg-primary text-white shadow-primary/30' : 'bg-white text-primary'}`}>
      <MapPin size={14} />
    </div>
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{city}</span>
    </div>
  </motion.div>
);

const Hero = () => {
  const navigate = useNavigate();
  const { setShowModal, updateManualLocation } = useLocation();
  const [typedText, setTypedText] = useState('');
  const fullText = "Hyperlocal Commerce & Delivery.";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const [pincodeInput, setPincodeInput] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#fafafa] select-none"
    >
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-100/40 rounded-full blur-[100px]" />
        
        {/* Dynamic Mouse Glow */}
        <div 
          className="absolute z-10 w-[400px] h-[400px] rounded-full opacity-40 blur-[100px] transition-all duration-300 ease-out pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            left: mousePos.x - 200,
            top: mousePos.y - 200
          }}
        />

        {/* Minimal Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container-xl relative z-20 px-4 sm:px-6 pt-32 pb-20 w-full min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-5 xl:col-span-6 space-y-8 min-w-0 z-30">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Enterprise Logistics Live</span>
            </motion.div>

            <div className="space-y-6 relative">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Smart India's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  {typedText}
                </span>
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                Connect your business to a futuristic logistics ecosystem. Real-time tracking, hyperlocal routing, and premium service delivery.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#choose-path" className="px-8 py-4 bg-slate-900 text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">
                Explore Services <ArrowRight size={16} />
              </a>
              <Link to="/register" className="px-8 py-4 bg-white text-slate-900 border border-gray-200 rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.15em] hover:bg-gray-50 transition-all shadow-sm">
                Partner Hub
              </Link>
            </div>

            {/* Verification Bar */}
            <div className="max-w-md pt-8">
              <div className="bg-white p-2 rounded-[1.5rem] border border-gray-200 shadow-lg shadow-gray-200/50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ml-1">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter Sector Pincode"
                    className="w-full bg-transparent text-slate-900 font-black uppercase tracking-tight outline-none placeholder:text-gray-400 text-sm"
                    maxLength={6}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (pincodeInput.length === 6 && /^\d+$/.test(pincodeInput)) {
                      updateManualLocation({ formatted: pincodeInput, manual: true });
                      toast.success(`Sector ${pincodeInput} Verified`);
                    } else {
                      toast.error('Enter valid 6-digit Pincode');
                    }
                  }}
                  className="px-6 py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Right Content: Ecosystem Map UI */}
          <div className="lg:col-span-7 xl:col-span-6 relative h-[600px] w-full mt-10 lg:mt-0">
            {/* The Map Container */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              
              {/* Map SVG Paths */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 600">
                <path d="M 100 500 C 200 400, 300 500, 400 300 C 500 100, 600 200, 700 100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M 150 150 C 250 250, 400 100, 500 250 C 600 400, 700 350, 750 450" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M 400 300 C 450 400, 550 450, 600 600" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" />
                
                {/* Animated Glowing Path */}
                <motion.path 
                  d="M 100 500 C 200 400, 300 500, 400 300 C 500 100, 600 200, 700 100" 
                  fill="none" 
                  stroke="url(#glowGradient)" 
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Location Pins */}
              <LocationPin top="80%" left="12%" delay={0.2} city="Chennai" />
              <LocationPin top="48%" left="48%" delay={0.4} city="Bangalore" isActive={true} />
              <LocationPin top="15%" left="85%" delay={0.6} city="Hyderabad" />
              <LocationPin top="25%" left="20%" delay={0.8} city="Mumbai" />
              <LocationPin top="70%" left="75%" delay={1.0} city="Delhi" />

              {/* Animated Scooter */}
              <motion.div
                className="absolute z-30 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-orange-500 flex items-center justify-center text-orange-500"
                animate={{
                  x: [80, 180, 280, 380, 480, 580, 680],
                  y: [480, 390, 490, 290, 110, 190, 90]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ top: 0, left: 0 }}
              >
                <Truck size={20} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <CheckCircle size={8} className="text-white" />
                </div>
              </motion.div>

              {/* Floating Product Cards */}
              <FloatingCard delay={1.2} className="top-10 left-10 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Electronics</p>
                    <p className="text-xs font-black text-slate-800 tracking-tight">MacBook Pro</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.4} className="bottom-20 right-10 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Grocery</p>
                    <p className="text-xs font-black text-slate-800 tracking-tight">Fresh Produce</p>
                  </div>
                </div>
              </FloatingCard>

              {/* Live Status UI */}
              <FloatingCard delay={1.6} className="top-40 right-8 p-4 w-48">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-3">Live Mission Status</p>
                <div className="space-y-3">
                  {['Confirmed', 'Packed', 'In Transit'].map((status, idx) => (
                    <div key={status} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${idx === 2 ? 'bg-primary text-white shadow-md shadow-primary/30 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                        <CheckCircle size={10} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 2 ? 'text-slate-800' : 'text-gray-400'}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </FloatingCard>

              {/* Analytics Widget */}
              <FloatingCard delay={1.8} className="bottom-10 left-8 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white">
                    <TrendingUp size={16} className="text-green-400 mb-1" />
                    <span className="text-[10px] font-black tracking-widest">99%</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Success Rate</p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">On-Time Delivery</p>
                  </div>
                </div>
              </FloatingCard>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

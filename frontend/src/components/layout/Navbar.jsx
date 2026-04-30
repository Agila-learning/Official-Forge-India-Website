import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, ChevronRight, Briefcase, Globe, Cpu, Smartphone, 
  Zap, ShoppingBag, User, LogOut, LayoutDashboard, ShoppingCart, 
  Heart, MapPin, Wrench, Bell, CheckSquare, Sparkles, Rocket, Building2, Shield, Code, Layout
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import ThemeToggle from '../ui/ThemeToggle';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { useNotifications } from '../../context/NotificationContext';
import RoleSelectionModal from '../ui/RoleSelectionModal';

const AnimatedConnectText = () => (
    <div className="relative flex items-center h-4 w-[80px] justify-start mt-1">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none"
        >
            <div className="w-[1.5px] h-[1.5px] bg-primary rounded-full shadow-[0_0_2px_#312e81]"></div>
            <div className="w-[1.5px] h-[1.5px] bg-gray-400 rounded-full"></div>
            <div className="w-[1.5px] h-[1.5px] bg-secondary rounded-full shadow-[0_0_2px_#0d9488]"></div>
        </motion.div>

        <motion.div
            initial={{ x: -15, scale: 0, opacity: 0 }}
            animate={{ x: 0, scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
            className="w-1.5 h-1.5 bg-primary shadow-[0_0_5px_#312e81] rounded-sm rotate-45 absolute"
        />
        <motion.div
            initial={{ x: 15, scale: 0, opacity: 0 }}
            animate={{ x: 0, scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
            className="w-1.5 h-1.5 bg-secondary shadow-[0_0_5px_#0d9488] rounded-sm rotate-45 absolute"
        />

        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 0] }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
            className="w-2.5 h-2.5 bg-white rounded-full absolute z-10 blur-[1.5px] shadow-[0_0_12px_3px_#0d9488]"
        />

        <motion.div
            initial={{ opacity: 0, letterSpacing: "-0.1em", filter: "blur(4px)", scale: 0.9 }}
            animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            className="text-amber-500 font-black uppercase tracking-[0.2em] text-[9px] absolute w-[80px] text-left"
        >
            CONNECT
        </motion.div>
    </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { favorites } = useWishlist();
  const { location: appLocation, setShowModal } = useUserLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const isLoggedIn = !!userInfo;
  const isPartner = isLoggedIn && ['Vendor', 'HR', 'Delivery Partner', 'Admin', 'Candidate', 'Trainer'].includes(userInfo.role);

  const handleDashboardClick = (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      switch(userInfo.role) {
        case 'Admin': navigate('/admin/dashboard'); break;
        case 'Vendor': navigate('/vendor'); break;
        case 'HR': navigate('/hr'); break;
        case 'Delivery Partner': navigate('/delivery'); break;
        case 'Candidate': navigate('/candidate/dashboard'); break;
        case 'Trainer': navigate('/trainer-dashboard'); break;
        default: navigate('/profile'); break;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    clearCart();
    toast.success('Logged out successfully!');
    navigate('/login');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'IT Solutions', path: '/services/it-solutions', icon: <Cpu size={20} /> },
    { name: 'Software Development', path: '/services/software-development', icon: <Code size={20} /> },
    { name: 'Web Development', path: '/services/website-development', icon: <Zap size={20} /> },
    { name: 'App Development', path: '/services/app-development', icon: <Smartphone size={20} /> },
    { name: 'AI & ML Solutions', path: '/services/ai-ml-solutions', icon: <Rocket size={20} /> },
    { name: 'UI/UX Design', path: '/services/ui-ux-design', icon: <Layout size={20} /> },
    { name: 'Digital Marketing', path: '/services/digital-marketing', icon: <Globe size={20} /> },
    { name: 'Job Consulting', path: '/services/job-consulting', icon: <Briefcase size={20} /> },
    { name: 'Insurance Services', path: '/services/insurance-services', icon: <Shield size={20} /> },
  ];

  const exploreOptions = [
    { name: 'Job Hub', desc: 'Careers & Recruitment', path: '/explore-jobs', icon: <Briefcase size={20} /> },
    { name: 'Home Services', desc: 'Book verified experts', path: '/home-services', icon: <Wrench size={20} /> },
    { name: 'Industrial Shop', desc: 'Direct Procurement', path: '/explore-shop', icon: <ShoppingBag size={20} /> }
  ];

  const getNavLinks = () => {
    if (!isLoggedIn) {
      return [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Explore', isDropdown: true, items: exploreOptions },
        { name: 'Services', isDropdown: true, items: services },
        { name: 'Training & Placement', path: '/training-placement' },
        { name: 'FAQs', path: '/faq' },
      ];
    }
    switch (userInfo.role) {
      case 'Customer':
      case 'Candidate':
        return [
          { name: 'Explore', isDropdown: true, items: exploreOptions },
          { name: 'Services', isDropdown: true, items: services },
          { name: 'Training', path: '/training-placement' },
          { name: 'My Activity', onClick: handleDashboardClick },
          { name: 'Wishlist', path: '/wishlist' },
        ];
      default:
        return [
          { name: 'Home', path: '/' },
          { name: 'Explore', isDropdown: true, items: exploreOptions },
          { name: 'Dashboard', onClick: handleDashboardClick },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed w-full z-[99999] transition-all duration-500 ${isScrolled ? 'py-3 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-2xl border-b border-gray-100 dark:border-gray-800' : 'py-6 bg-transparent'}`}>
      <div className="max-w-full mx-auto px-4 md:px-12 xl:px-20">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-3 md:gap-4 group relative shrink-0 h-12">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-dark-card rounded-xl md:rounded-2xl flex items-center justify-center p-0.5 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
                <motion.img 
                  src="/logo.jpg" 
                  alt="FIC Logo" 
                  className="w-[90%] h-[90%] object-contain rounded-lg"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <div className="flex flex-col justify-center h-full overflow-hidden">
                <span className="text-base md:text-xl font-black tracking-tighter block leading-none uppercase truncate">
                    <span className="text-blue-600 dark:text-blue-400">FORGE INDIA</span>
                </span>
                <div className="mt-1 scale-75 md:scale-100 origin-left flex justify-start">
                   <AnimatedConnectText key={location.pathname} />
                </div>
            </div>
          </Link>

          <div className="hidden xl:flex flex-1 justify-center items-center gap-8 mx-8">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isDropdown ? (
                  <div className="relative group py-4 flex items-center h-full">
                    <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all relative hover:scale-105 active:scale-95">
                      {link.name} 
                      <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </button>
                    <div className={`absolute top-[80%] left-1/2 -translate-x-1/2 mt-4 ${link.items.length > 6 ? 'w-[600px]' : 'w-72'} bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 border border-gray-100 dark:border-gray-800 translate-y-4 group-hover:translate-y-0 text-left`}>
                      <div className={`grid ${link.items.length > 6 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                        {link.items.map((item) => (
                          <Link 
                            key={item.name} 
                            to={item.path} 
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-3xl transition-all group/item border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-sm hover:shadow-md"
                          >
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                              {item.icon}
                            </div>
                            <div>
                                <p className="font-black text-gray-900 dark:text-white text-[11px] uppercase tracking-tight">{item.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 group-hover/item:text-primary/70 transition-colors">{item.desc || 'Explore Service'}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={link.path || '#'} 
                    onClick={link.onClick}
                    state={link.state}
                    className="group relative flex items-center h-full py-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3 2xl:gap-4 shrink-0 h-12">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center h-full gap-3 px-4 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full hover:border-primary/20 transition-all shadow-sm group/loc"
            >
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover/loc:scale-110 transition-transform">
                <MapPin size={16} />
              </div>
              <div className="text-left flex flex-col justify-center leading-none">
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Service Area</p>
                 <p className="text-[10px] font-black text-gray-900 dark:text-white truncate max-w-[80px] uppercase">
                    {appLocation?.city || 'Select Area'}
                 </p>
              </div>
            </button>

            <div className="flex items-center h-full">
               <ThemeToggle />
            </div>
            
            <Link to="/cart" className="relative flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full hover:border-primary transition-all shadow-sm group/cart">
              <ShoppingCart size={20} className="text-gray-600 dark:text-gray-300 group-hover/cart:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg shadow-lg animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="relative group/notif h-full">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full hover:border-secondary transition-all shadow-sm"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-300 group-hover/notif:text-secondary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-6 z-[100]"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black uppercase tracking-tighter italic">Intelligence <span className="text-secondary">Feed</span></h4>
                      <button onClick={markAllAsRead} className="text-[9px] font-black text-gray-400 uppercase hover:text-primary transition-colors">Wipe All</button>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-center py-10 text-[10px] font-black text-gray-300 uppercase italic tracking-widest">No signals detected</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n._id} className={`p-4 rounded-2xl border ${n.read ? 'bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-gray-800' : 'bg-secondary/5 border-secondary/20 shadow-md'} transition-all`}>
                             <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{n.message}</p>
                             <p className="text-[8px] font-black text-gray-400 uppercase mt-2">{new Date(n.createdAt).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <Link to="/notifications" onClick={() => setShowNotifications(false)} className="block text-center mt-6 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Operations</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {isLoggedIn ? (
              <div className="relative group/profile h-full">
                <button className="flex items-center h-full gap-3 px-2 pr-4 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full hover:border-primary/20 transition-all shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    {userInfo.firstName?.[0] ?? '?'}
                  </div>
                  <div className="text-left flex flex-col justify-center leading-none">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Welcome</p>
                     <p className="text-[10px] font-black text-gray-900 dark:text-white truncate max-w-[80px] uppercase">{userInfo.firstName}</p>
                  </div>
                </button>
                <div className="absolute top-[100%] right-0 mt-4 w-64 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-3 opacity-0 translate-y-4 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-500">
                  <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left rounded-2xl group/sub">
                    <User size={20} className="text-gray-400 group-hover/sub:text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Account Profile</span>
                  </button>
                  <button onClick={handleDashboardClick} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left rounded-2xl group/sub">
                    <LayoutDashboard size={20} className="text-gray-400 group-hover/sub:text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Control Hub</span>
                  </button>
                  <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-all text-left rounded-2xl group/sub">
                    <LogOut size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 h-full">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-primary transition-colors">Login</Link>
                <Link 
                  to="/contact" 
                  className="flex items-center h-full px-6 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all whitespace-nowrap"
                >
                  Hire Through FIC
                </Link>
              </div>
            )}
          </div>

          <div className="xl:hidden flex items-center gap-2 md:gap-3 relative z-[9999]">
             <Link to="/cart" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white relative">
                <ShoppingCart size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
             </Link>
             <ThemeToggle />
             <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white active:scale-90 transition-all shadow-sm"
             >
               <Menu size={20} />
             </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Redesigned) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100000]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-dark-bg z-[100001] shadow-3xl flex flex-col overflow-y-auto"
            >
              <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-black text-lg tracking-tighter text-blue-600 dark:text-blue-400 uppercase">FORGE INDIA</span>
                    <span className="font-black text-[10px] tracking-[0.2em] text-amber-500 uppercase mt-1 text-left">CONNECT</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-card rounded-2xl text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white dark:bg-dark-bg">
                <div className="space-y-10">
                  {navLinks.map((link, idx) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05), type: 'spring', damping: 25 }}
                  >
                    {link.isDropdown ? (
                      <div className="space-y-6">
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                           <span className="w-6 h-[2px] bg-primary rounded-full"></span> {link.name}
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {link.items.map(item => (
                            <Link 
                              key={item.name} 
                              to={item.path} 
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card/40 rounded-[1.5rem] border border-gray-100 dark:border-gray-800/50 active:scale-[0.98] transition-all shadow-sm"
                            >
                              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner shrink-0">
                                 {React.cloneElement(item.icon, { size: 18 })}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">{item.name}</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">{item.desc || 'Explore'}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                        <Link 
                          to={link.path || '#'} 
                          state={link.state}
                          onClick={() => { if(link.onClick) link.onClick(); setIsOpen(false); }}
                          className="flex items-center justify-between p-5 bg-slate-50 dark:bg-dark-card/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 active:scale-[0.98] transition-all shadow-sm font-black text-slate-900 dark:text-white text-base uppercase tracking-tight hover:text-primary group/moblink"
                        >
                          <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-primary/20 group-hover/moblink:bg-primary transition-colors"></div>
                             {link.name}
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover/moblink:text-primary transition-colors" />
                        </Link>
                    )}
                  </motion.div>
                ))}
              </div>
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-bg/50">
                {isLoggedIn ? (
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => { handleDashboardClick(); setIsOpen(false); }}
                        className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition-all"
                      >
                        <LayoutDashboard size={24} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Command Hub</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex flex-col items-center gap-3 p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 text-red-500 shadow-sm active:scale-95 transition-all"
                      >
                        <LogOut size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                      </button>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 text-center font-black text-gray-500 uppercase tracking-[0.2em] text-[11px] hover:text-primary transition-colors border border-gray-100 dark:border-gray-800 rounded-2xl"
                    >
                      Member Login
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 bg-primary text-white rounded-2xl text-center font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 active:scale-95 transition-all"
                    >
                      Hire Through FIC
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <RoleSelectionModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Briefcase, Globe, Cpu, Smartphone, 
  Zap, ShoppingBag, User, LogOut, LayoutDashboard, ShoppingCart, 
  Heart, MapPin, Wrench, Bell, CheckSquare, Sparkles, Rocket, Building2, Shield
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import ThemeToggle from '../ui/ThemeToggle';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { useNotifications } from '../../context/NotificationContext';
import RoleSelectionModal from '../ui/RoleSelectionModal';

const AnimatedConnectText = () => (
    <div className="relative flex items-center h-4 w-[65px] justify-center mt-1 ml-0.5">
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
            className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[9px] absolute w-[80px] text-center"
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
  const isPartner = isLoggedIn && ['Vendor', 'HR', 'Delivery Partner', 'Admin', 'Candidate'].includes(userInfo.role);

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
    { name: 'Web Development', path: '/services/website-development', icon: <Zap size={20} /> },
    { name: 'App Development', path: '/services/app-development', icon: <Smartphone size={20} /> },
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
        { name: 'FAQs', path: '/faq' },
      ];
    }
    // ... rest of the logic remains similar but with Explore added if needed
    switch (userInfo.role) {
      case 'Customer':
      case 'Candidate':
        return [
          { name: 'Explore', isDropdown: true, items: exploreOptions },
          { name: 'Services', isDropdown: true, items: services },
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
    <nav className={`fixed w-full z-[1000] transition-all duration-500 ${isScrolled ? 'py-3 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-2xl border-b border-gray-100 dark:border-gray-800' : 'py-6 bg-transparent'}`}>
      <div className="max-w-full mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group relative shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center p-1.5 shadow-2xl group-hover:rotate-6 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800">
                <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tighter block leading-none uppercase">
                    <span className="text-blue-600 dark:text-blue-400">FORGE INDIA</span>
                </span>
                <div className="mt-1">
                   <AnimatedConnectText key={location.pathname} />
                </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8 2xl:space-x-12">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isDropdown ? (
                  <div className="relative group py-4">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-black text-[9px] uppercase tracking-[0.25em] transition-all">
                      {link.name} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-4 w-72 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 border border-gray-100 dark:border-gray-800 translate-y-4 group-hover:translate-y-0 text-left">
                      <div className="grid grid-cols-1 gap-2">
                        {link.items.map((item) => (
                          <Link 
                            key={item.name} 
                            to={item.path} 
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all group/item"
                          >
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <div>
                                <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">{item.name}</p>
                                {item.desc && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>}
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
                    className="nav-link-underline text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-black text-[9px] uppercase tracking-[0.25em] transition-all"
                  >
                    {link.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Section CTAs */}
          <div className="hidden xl:flex items-center gap-6">
            {/* Location Button */}
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary/20 transition-all shadow-sm group/loc"
            >
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover/loc:scale-110 transition-transform">
                <MapPin size={16} />
              </div>
              <div className="text-left leading-none">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Service Area</p>
                 <p className="text-[10px] font-black text-gray-900 dark:text-white truncate max-w-[100px] uppercase">
                    {appLocation?.city || 'Select Area'}
                 </p>
              </div>
            </button>

            <ThemeToggle />
            
            {isLoggedIn ? (
              <div className="flex items-center gap-5">
                {/* Notifications & Profile (Rest stays similar but polished) */}
                <div className="relative group/profile">
                  <button className="flex items-center gap-3 p-2 pr-5 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary/20 transition-all shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-primary/20">
                      {userInfo.firstName[0]}
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Welcome</p>
                       <p className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[100px]">{userInfo.firstName}</p>
                    </div>
                  </button>
                  <div className="absolute top-[90%] right-0 mt-4 w-64 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-3 opacity-0 translate-y-4 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-500">
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
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors">Login</Link>
                <Link 
                  to="/contact" 
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all"
                >
                  Hire Through FIC
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="xl:hidden flex items-center gap-4">
             <ThemeToggle />
             <button 
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white active:scale-90 transition-all shadow-sm"
             >
               <Menu size={28} />
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
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md z-[2000]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[90vw] max-w-md bg-white dark:bg-dark-bg z-[2001] shadow-3xl flex flex-col overflow-hidden"
            >
              <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-black text-lg tracking-tighter text-blue-600 dark:text-blue-400 uppercase">FORGE INDIA</span>
                    <span className="font-black text-xs tracking-[0.2em] text-yellow-500 uppercase mt-1">CONNECT</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-card rounded-2xl text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {navLinks.map((link, idx) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                  >
                    {link.isDropdown ? (
                      <div className="space-y-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                           <span className="w-8 h-[1px] bg-gray-100 dark:bg-gray-800"></span> {link.name}
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {link.items.map(item => (
                            <Link 
                              key={item.name} 
                              to={item.path} 
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-card/50 rounded-2xl border border-gray-100 dark:border-gray-800 active:scale-95 transition-all"
                            >
                              <div className="w-10 h-10 bg-white dark:bg-dark-bg text-primary rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                 {React.cloneElement(item.icon, { size: 20 })}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <p className="font-black text-gray-900 dark:text-white text-[11px] md:text-sm uppercase truncate">{item.name}</p>
                                 <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">{item.desc || 'Explore details'}</p>
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
                          className="text-4xl font-black text-gray-900 dark:text-white block hover:text-primary transition-all tracking-tighter uppercase leading-none"
                        >
                          {link.name}
                        </Link>
                    )}
                  </motion.div>
                ))}
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

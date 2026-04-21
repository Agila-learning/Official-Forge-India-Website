import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Rocket, Sparkles, Shield, Briefcase, Zap, Globe, Cpu, Smartphone, ShoppingBag, UserPlus, Truck, UserCheck, User, LogOut, LayoutDashboard, ShoppingCart, Heart, MapPin, Wrench } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import ThemeToggle from '../ui/ThemeToggle';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { useNotifications } from '../../context/NotificationContext';
import RoleSelectionModal from '../ui/RoleSelectionModal';
import { Bell, CheckSquare } from 'lucide-react';

const AnimatedConnectText = () => (
    <div className="relative flex items-center h-4 w-[65px] justify-center mt-1 ml-0.5">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none"
        >
            <div className="w-[1.5px] h-[1.5px] bg-[#0A66C2] rounded-full shadow-[0_0_2px_#0A66C2]"></div>
            <div className="w-[1.5px] h-[1.5px] bg-gray-400 rounded-full"></div>
            <div className="w-[1.5px] h-[1.5px] bg-[#FFC107] rounded-full shadow-[0_0_2px_#FFC107]"></div>
        </motion.div>

        <motion.div
            initial={{ x: -15, scale: 0, opacity: 0 }}
            animate={{ x: 0, scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
            className="w-1.5 h-1.5 bg-[#0A66C2] shadow-[0_0_5px_#0A66C2] rounded-sm rotate-45 absolute"
        />
        <motion.div
            initial={{ x: 15, scale: 0, opacity: 0 }}
            animate={{ x: 0, scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
            className="w-1.5 h-1.5 bg-[#FFC107] shadow-[0_0_5px_#FFC107] rounded-sm rotate-45 absolute"
        />

        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 0] }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
            className="w-2.5 h-2.5 bg-white rounded-full absolute z-10 blur-[1.5px] shadow-[0_0_12px_3px_#FFC107]"
        />

        <motion.div
            initial={{ opacity: 0, letterSpacing: "-0.1em", filter: "blur(4px)", scale: 0.9 }}
            animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            className="text-[#FFC107] font-black uppercase tracking-[0.2em] text-[9px] absolute w-[80px] text-center"
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
  const { location: userLocation, setShowModal: setShowLocationModal } = useUserLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const isLoggedIn = !!userInfo;
  const isPartner = isLoggedIn && ['Vendor', 'HR', 'Delivery Partner', 'Admin', 'Candidate'].includes(userInfo.role);

  const handleDashboardClick = (e) => {
    e.preventDefault();
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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'Job Consulting', path: '/services/job-consulting', icon: <Briefcase size={20} /> },
    { name: 'IT Solutions', path: '/services/it-solutions', icon: <Cpu size={20} /> },
    { name: 'Digital Marketing', path: '/services/digital-marketing', icon: <Globe size={20} /> },
    { name: 'Insurance Services', path: '/services/insurance-services', icon: <Shield size={20} /> },
    { name: 'App Development', path: '/services/app-development', icon: <Smartphone size={20} /> },
    { name: 'Web Development', path: '/services/website-development', icon: <Zap size={20} /> },
  ];

  const exploreOptions = [
    { name: 'Job Hub', desc: 'Careers & Recruitment', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Home Services', desc: 'Book verified experts', path: '/home-services', icon: <Wrench size={20} /> },
    { name: 'Product Store', desc: 'Industrial Procurement', path: '/explore-shop', icon: <ShoppingBag size={20} /> }
  ];

  const getNavLinks = () => {
    if (!isLoggedIn) {
      return [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Services', isDropdown: true, items: services },
        { name: 'FAQs', path: '/faq' },
      ];
    }

    switch (userInfo.role) {
      case 'Customer':
      case 'Candidate':
        return [
          { name: 'Career Hub', path: '/jobs' },
          { name: 'Home Services', path: '/home-services' },
          { name: 'Industrial Shop', path: '/explore-shop' },
          { name: 'My Favorites', path: '/wishlist' },
        ];
      case 'HR':
        return [
          { name: 'Dashboard', path: '/hr' },
          { name: 'Job Postings', path: '/hr', state: { view: 'jobs' } },
          { name: 'Candidate Pipeline', path: '/hr', state: { view: 'applications' } },
          { name: 'Manage Services', path: '/hr', state: { view: 'services' } },
        ];
      case 'Vendor':
        return [
          { name: 'Seller Hub', path: '/vendor' },
          { name: 'My Inventory', path: '/vendor', state: { view: 'inventory' } },
          { name: 'Order Logs', path: '/vendor', state: { view: 'orders' } },
          { name: 'Performance', path: '/vendor', state: { view: 'overview' } },
        ];
      case 'Admin':
        return [
            { name: 'Main Console', path: '/admin/dashboard' },
            { name: 'User Matrix', path: '/admin/dashboard', state: { view: 'users' } },
            { name: 'Platform Shop', path: '/admin/dashboard', state: { view: 'products' } },
            { name: 'Order Control', path: '/admin/dashboard', state: { view: 'orders' } },
        ];
      default:
        return [
          { name: 'Home', path: '/' },
          { name: 'Dashboard', onClick: handleDashboardClick },
          { name: 'FAQs', path: '/faq' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed w-full z-[1000] transition-all duration-500 ${isScrolled ? 'py-2 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-2xl shadow-primary/5 border-b border-gray-100 dark:border-gray-800' : 'py-4 bg-transparent'}`}>
      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 md:gap-5 group relative shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center p-1 shadow-xl shadow-primary/5 group-hover:rotate-12 transition-transform duration-500 overflow-hidden border border-gray-100 dark:border-gray-800">
                <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black tracking-tighter block leading-none blinking-text">
                    <span className="text-[#0A66C2]">FORGE INDIA</span>
                </span>
                <AnimatedConnectText key={location.pathname} />
            </div>
          </Link>

          {/* Location Selector - Only for Customers or Guests */}
          {(!isLoggedIn || (userInfo && userInfo.role === 'Customer')) && (
            <button 
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary/30 transition-all group ml-4 shrink-0"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MapPin size={16} />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1 tracking-widest">Your Location</p>
                <p className="text-[10px] font-black text-gray-900 dark:text-white truncate max-w-[100px] leading-none">
                  {userLocation ? userLocation.city || userLocation.formatted : 'Detecting...'}
                </p>
              </div>
            </button>
          )}

          <div className={`hidden xl:flex items-center space-x-8 ${isLoggedIn ? 'ml-auto mr-8' : 'ml-6'}`}>
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isDropdown ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary font-black text-[9px] uppercase tracking-[0.2em] relative transition-colors group">
                      {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 border border-gray-100 dark:border-gray-800 translate-y-4 group-hover:translate-y-0 text-left">
                      {link.items.map((item) => (
                        <Link 
                          key={item.name} 
                          to={item.path} 
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all group/item"
                        >
                          <div className="text-primary opacity-50 group-hover/item:opacity-100 transition-opacity">
                            {item.icon}
                          </div>
                          <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : link.onClick ? (
                  <button 
                    onClick={link.onClick}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary font-black text-[9px] uppercase tracking-[0.2em] relative group transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-400"></span>
                  </button>
                ) : (
                  <Link 
                    to={link.path} 
                    state={link.state}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary font-black text-[9px] uppercase tracking-[0.2em] relative group transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-400"></span>
                  </Link>
                )}
              </React.Fragment>
            ))}

            {!isLoggedIn && (
               <div className="relative group">
                <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 border-2 border-secondary/30 text-secondary font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:text-dark-bg transition-all duration-500 shadow-[0_0_30px_rgba(255,193,7,0.1)] hover:shadow-[0_0_40px_rgba(255,193,7,0.3)] group text-left">
                  Explore <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
                
                <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 border border-gray-100 dark:border-gray-800 translate-y-4 group-hover:translate-y-0 text-left">
                  <div className="p-4 border-b border-gray-50 dark:border-gray-800 mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect Marketplace & Portals</span>
                  </div>
                  {exploreOptions.map((opt) => (
                    <Link key={opt.name} to={opt.path} state={opt.state} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-3xl transition-all group/item">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover/item:rotate-12 transition-transform text-primary">
                        {opt.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white leading-tight text-sm">{opt.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{opt.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`hidden xl:flex items-center gap-4 ${isPartner ? 'ml-auto' : ''}`}>
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                {/* Notifications Bell */}
                <div className="relative group/notifications">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 text-gray-500 hover:text-primary transition-colors group"
                  >
                    <Bell size={22} className={unreadCount > 0 ? "animate-pulse" : ""} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 border-2 border-white dark:border-dark-bg">
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
                        className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-3xl overflow-hidden z-50"
                      >
                        <div className="p-6 bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Signals</h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Real-time Intel Feed</p>
                          </div>
                          <button onClick={markAllAsRead} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Acknowledge All</button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n._id} 
                                onClick={() => markAsRead(n._id)}
                                className={`p-5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                              >
                                {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></div>}
                                <div className="flex gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                    {n.type === 'order' ? <ShoppingBag size={18} /> : n.type === 'alert' ? <Zap size={18} /> : <Bell size={18} />}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-xs font-black uppercase tracking-tight mb-1 ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{n.title}</p>
                                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed mb-2">{n.message}</p>
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 text-center">
                              <Bell size={40} className="mx-auto text-gray-100 mb-4" />
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No active signals</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
                          <Link to="/profile" onClick={() => setShowNotifications(false)} className="text-[9px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">View All Transmissions</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Only show Cart/Wishlist for Customers */}
                {userInfo.role === 'Customer' && (
                  <>
                    <Link to="/cart" className="relative p-2.5 text-gray-500 hover:text-primary transition-colors group">
                      <ShoppingCart size={22} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-secondary text-dark-bg text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-secondary/20">
                          {cartItems.length}
                        </span>
                      )}
                    </Link>

                    <Link to="/wishlist" className="relative p-2.5 text-gray-500 hover:text-red-500 transition-colors group">
                      <Heart size={22} fill={favorites.length > 0 ? "currentColor" : "none"} className={favorites.length > 0 ? "text-red-500" : ""} />
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                
                <div className="relative group/profile">
                  <button className="flex items-center gap-3 p-1 pr-4 rounded-full bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs uppercase">
                      {userInfo.firstName[0]}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Welcome</p>
                      <p className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[80px] leading-none">{userInfo.firstName}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover/profile:rotate-180 transition-transform" />
                  </button>
                  
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all z-50 overflow-hidden text-left">
                    <div className="p-6 bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                      <p className="font-black text-gray-900 dark:text-white text-xs truncate">{userInfo.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={(e) => {
                          if (!isLoggedIn) navigate('/login');
                          else {
                            switch(userInfo.role) {
                              case 'Admin': navigate('/admin/dashboard', { state: { view: 'profile' } }); break;
                              case 'Vendor': navigate('/vendor', { state: { view: 'profile' } }); break;
                              case 'HR': navigate('/hr', { state: { view: 'profile' } }); break;
                              case 'Delivery Partner': navigate('/delivery', { state: { view: 'profile' } }); break;
                              case 'Candidate': navigate('/candidate/dashboard', { state: { view: 'profile' } }); break;
                              default: navigate('/profile'); break;
                            }
                          }
                          setIsOpen(false);
                        }} 
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-2xl transition-all group/item text-left"
                      >
                        <User size={18} className="text-gray-400 group-hover/item:text-primary" />
                        <span className="font-bold text-gray-600 dark:text-gray-400">My Profile</span>
                      </button>
                      <button onClick={handleDashboardClick} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-2xl transition-all group/item">
                        <LayoutDashboard size={18} className="text-gray-400 group-hover/item:text-primary" />
                        <span className="font-bold text-gray-600 dark:text-gray-400">Dashboard</span>
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group/item text-red-500">
                        <LogOut size={18} />
                        <span className="font-black uppercase text-[10px] tracking-widest">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors">Login</Link>
                <button onClick={() => setIsRoleModalOpen(true)} className="px-6 py-2.5 rounded-full font-black text-white bg-primary hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]">Join FIC</button>
              </div>
            )}
          </div>

          <div className="xl:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 dark:text-white p-2">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="xl:hidden fixed inset-0 z-50 bg-white dark:bg-dark-bg p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
               <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-black">FORGE INDIA</Link>
               <button onClick={() => setIsOpen(false)} className="text-primary"><X size={40} /></button>
            </div>
            <div className="space-y-6">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.onClick ? (
                    <button 
                      onClick={() => { link.onClick(); setIsOpen(false); }}
                      className="flex items-center gap-4 text-3xl font-black text-gray-900 dark:text-white"
                    >
                      {link.name}
                    </button>
                  ) : link.isDropdown ? (
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-4">{link.name}</p>
                       <div className="grid grid-cols-1 gap-3">
                         {link.items.map(item => (
                            <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="text-primary">{item.icon}</div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                            </Link>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <Link 
                      to={link.path} 
                      state={link.state}
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center gap-4 text-3xl font-black text-gray-900 dark:text-white"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              {!isLoggedIn && (
                <div className="pt-6 space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Forge India Connect</p>
                  <div className="grid grid-cols-1 gap-3">
                    {exploreOptions.map(opt => (
                        <Link key={opt.name} to={opt.path} state={opt.state} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="text-primary">{opt.icon}</div>
                            <span className="font-bold text-gray-700 dark:text-gray-300">{opt.name}</span>
                        </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20">
                    <div className="flex items-center gap-4">
                        <ShoppingCart size={24} />
                        <span className="text-xl font-black">My Cart</span>
                    </div>
                    <span className="bg-white/20 px-4 py-1 rounded-full font-black text-sm">{cartItems.length}</span>
                </Link>
                {isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleDashboardClick} className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 gap-2">
                            <LayoutDashboard size={24} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Dashboard</span>
                        </button>
                        <button onClick={handleLogout} className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 gap-2 text-red-500">
                            <LogOut size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={() => { setIsRoleModalOpen(true); setIsOpen(false); }} className="block w-full text-center py-6 bg-secondary text-dark-bg font-black rounded-3xl text-xl shadow-xl shadow-secondary/20 uppercase tracking-widest">
                        Join Connect
                    </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <RoleSelectionModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </nav>
  );
};

export default Navbar;

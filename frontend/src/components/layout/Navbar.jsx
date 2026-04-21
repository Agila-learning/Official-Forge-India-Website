import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Briefcase, Globe, Cpu, Smartphone, 
  Zap, ShoppingBag, User, LogOut, LayoutDashboard, ShoppingCart, 
  Heart, MapPin, Wrench, Bell, CheckSquare, Sparkles, Rocket, Building2
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
            className="text-secondary font-black uppercase tracking-[0.2em] text-[9px] absolute w-[80px] text-center"
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
          { name: 'Candidates', path: '/hr', state: { view: 'applications' } },
        ];
      case 'Vendor':
        return [
          { name: 'Seller Hub', path: '/vendor' },
          { name: 'Inventory', path: '/vendor', state: { view: 'inventory' } },
          { name: 'Orders', path: '/vendor', state: { view: 'orders' } },
        ];
      case 'Admin':
        return [
          { name: 'Admin Console', path: '/admin/dashboard' },
          { name: 'Users', path: '/admin/dashboard', state: { view: 'users' } },
          { name: 'Platform', path: '/admin/dashboard', state: { view: 'products' } },
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
    <nav className={`fixed w-full z-[1000] transition-all duration-300 ${isScrolled ? 'py-3 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-gray-800' : 'py-5 bg-transparent'}`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group relative shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
                <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black tracking-tighter block leading-none">
                    <span className="text-primary dark:text-white">FORGE INDIA</span>
                </span>
                <AnimatedConnectText key={location.pathname} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6 2xl:space-x-10">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isDropdown ? (
                  <div className="relative group">
                    <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-bold text-[11px] uppercase tracking-wider transition-colors">
                      {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-dark-card shadow-xl rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-800 translate-y-2 group-hover:translate-y-0 text-left">
                      {link.items.map((item) => (
                        <Link 
                          key={item.name} 
                          to={item.path} 
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all group/item"
                        >
                          <div className="w-8 h-8 bg-primary/5 text-primary rounded-lg flex items-center justify-center opacity-60 group-hover/item:opacity-100 transition-opacity">
                            {item.icon}
                          </div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : link.onClick ? (
                  <button 
                    onClick={link.onClick}
                    className="nav-link-underline text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-bold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link 
                    to={link.path} 
                    state={link.state}
                    className="nav-link-underline text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-bold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Section CTAs */}
          <div className="hidden xl:flex items-center gap-4">
            <ThemeToggle />
            
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative group/notif">
                   <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-primary transition-colors relative"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  {/* Simplified dropdown for summary */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                      >
                         <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Signals</span>
                            <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary hover:underline">Clear All</button>
                         </div>
                         <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.slice(0, 5).map(n => (
                               <div key={n._id} className="p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                  <p className="text-xs font-bold text-gray-800 dark:text-white mb-0.5">{n.title}</p>
                                  <p className="text-[10px] text-gray-500 line-clamp-2">{n.message}</p>
                               </div>
                            ))}
                            {notifications.length === 0 && <div className="p-8 text-center text-[10px] text-gray-400 uppercase">No signals</div>}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {userInfo.role === 'Customer' && (
                  <Link to="/cart" className="p-2 text-gray-500 hover:text-primary transition-colors relative">
                    <ShoppingCart size={20} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-dark-bg text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative group/profile">
                  <button className="flex items-center gap-2.5 p-1.5 pr-3 bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full hover:border-primary/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs uppercase">
                      {userInfo.firstName[0]}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-white truncate max-w-[80px]">{userInfo.firstName}</span>
                    <ChevronDown size={14} className="text-gray-400 group-hover/profile:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-dark-card shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 py-2 opacity-0 translate-y-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all">
                    <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">My Profile</span>
                    </button>
                    <button onClick={handleDashboardClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                      <LayoutDashboard size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Dashboard</span>
                    </button>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors text-left">
                      <LogOut size={16} />
                      <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Login</Link>
                <Link 
                  to="/contact" 
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                  Hire Through FIC
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="xl:hidden flex items-center gap-3">
             <ThemeToggle />
             <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white active:scale-95 transition-transform"
             >
               <Menu size={24} />
             </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-dark-bg z-[2001] shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain invert grayscale brightness-200" />
                  </div>
                  <span className="font-black text-lg tracking-tighter text-primary">FORGE INDIA</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-card rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {navLinks.map((link, idx) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                  >
                    {link.isDropdown ? (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{link.name}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {link.items.map(item => (
                            <Link 
                              key={item.name} 
                              to={item.path} 
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800"
                            >
                              <div className="text-primary opacity-60">{item.icon}</div>
                              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link 
                        to={link.path || '#'} 
                        state={link.state}
                        onClick={() => { if(link.onClick) link.onClick(); setIsOpen(false); }}
                        className="text-2xl font-black text-gray-900 dark:text-white block hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                
                {!isLoggedIn && (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3"
                   >
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Portals</p>
                     <div className="grid grid-cols-1 gap-2">
                        {exploreOptions.map(opt => (
                          <Link 
                            key={opt.name} 
                            to={opt.path} 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform"
                          >
                             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{opt.icon}</div>
                             <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{opt.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">{opt.desc}</p>
                             </div>
                          </Link>
                        ))}
                     </div>
                   </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg/50">
                {isLoggedIn ? (
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { handleDashboardClick(); setIsOpen(false); }}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition-transform"
                      >
                        <LayoutDashboard size={20} className="text-primary" />
                        <span className="text-[10px] font-black uppercase text-gray-500">Dashboard</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex flex-col items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-500 shadow-sm active:scale-95 transition-transform"
                      >
                        <LogOut size={20} />
                        <span className="text-[10px] font-black uppercase">Sign Out</span>
                      </button>
                   </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-4 text-center font-black text-gray-500 uppercase tracking-widest text-xs hover:text-primary transition-colors"
                    >
                      Member Login
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-4 bg-primary text-white rounded-2xl text-center font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-transform"
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

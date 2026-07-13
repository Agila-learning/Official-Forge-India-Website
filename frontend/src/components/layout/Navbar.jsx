import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, ChevronRight, Briefcase, Globe, Cpu, Smartphone, 
  Zap, ShoppingBag, User, Users, LogOut, LayoutDashboard, ShoppingCart, 
  Heart, MapPin, Wrench, Bell, CheckSquare, Sparkles, Rocket, Building2, Shield, Code, Layout, Network, Droplets, Paintbrush, GraduationCap, Truck, Search, FileText, FileSpreadsheet, Gift, ShieldAlert, BadgeInfo, Wallet,
  Home, Settings, Headphones, Info, PhoneCall, ExternalLink, Compass
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
      className="text-amber-500 font-black uppercase tracking-[0.2em] text-[11px] lg:text-xs absolute w-[90px] text-left drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
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
  const [showActions, setShowActions] = useState(true);
  const [forceClose, setForceClose] = useState(false);

  useEffect(() => {
    if (forceClose) {
      const timer = setTimeout(() => setForceClose(false), 300);
      return () => clearTimeout(timer);
    }
  }, [forceClose]);

  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const isLoggedIn = !!userInfo;

  const handleDashboardClick = (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      switch(userInfo.role) {
        case 'Admin': 
        case 'Sub-Admin':
          navigate('/admin/dashboard'); 
          break;
        case 'Vendor': 
          navigate('/vendor'); 
          break;
        case 'Seller':
          navigate('/seller-dashboard');
          break;
        case 'Service Provider':
          navigate('/service-provider');
          break;
        case 'Stay Provider':
          navigate('/stay-partner');
          break;
        case 'Ride Provider':
        case 'Driver':
          navigate('/ride-partner');
          break;
        case 'HR': 
          navigate('/hr'); 
          break;
        case 'Delivery Partner': 
          navigate('/delivery'); 
          break;
        case 'Candidate': 
          navigate('/candidate/dashboard'); 
          break;
        case 'Trainer': 
          navigate('/trainer-dashboard'); 
          break;
        default: 
          navigate('/profile'); 
          break;
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

  const getNavLinks = () => {
    const iconClass = "w-3 h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4 mr-1 lg:mr-1.5 shrink-0";
    return [
      { name: 'Home', path: '/', icon: <Home className={iconClass} /> },
      {
        name: 'Forge Services',
        isMega: true,
        icon: <Settings className={iconClass} />,
        widthClass: 'w-[95vw] max-w-[1200px]',
        alignClass: 'left-1/2 -translate-x-1/2',
        gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        categories: [
          {
            title: 'Recruitment & HR Solutions',
            items: [
              { name: 'Job Consulting', path: '/job-consulting', icon: <Briefcase size={16} /> },
              { name: 'Recruitment Solutions', path: '/contact', icon: <Users size={16} /> },
              { name: 'HRMS Console', path: '/login', icon: <GraduationCap size={16} /> },
              { name: 'Staffing Solutions', path: '/contact', icon: <Building2 size={16} /> },
              { name: 'Payroll Services', path: '/contact', icon: <FileSpreadsheet size={16} /> },
              { name: 'Employee Management', path: '/login', icon: <Shield size={16} /> },
            ]
          },
          {
            title: 'IT & Digital Solutions',
            items: [
              { name: 'IT Solutions', path: '/it-solutions', icon: <Cpu size={16} /> },
              { name: 'Cloud Services', path: '/cloud-services', icon: <Network size={16} /> },
              { name: 'CRM Solutions', path: '/crm-solutions', icon: <Zap size={16} /> },
              { name: 'Website Development', path: '/web-development', icon: <Code size={16} /> },
              { name: 'Mobile App Development', path: '/app-development', icon: <Smartphone size={16} /> },
              { name: 'ERP Solutions', path: '/services/category/erp-solutions', icon: <Layout size={16} /> },
            ]
          },
          {
            title: 'Marketing & Branding',
            items: [
              { name: 'Digital Marketing', path: '/digital-marketing', icon: <Paintbrush size={16} /> },
              { name: 'SEO Services', path: '/services/sub/seo-optimization', icon: <Search size={16} /> },
              { name: 'Social Media Management', path: '/services/sub/social-media', icon: <Globe size={16} /> },
              { name: 'Branding & Design', path: '/services/sub/brand-identity', icon: <Sparkles size={16} /> },
              { name: 'Advertising Services', path: '/services/sub/advertising-services', icon: <Rocket size={16} /> },
            ]
          },
          {
            title: 'Insurance & Business Support',
            items: [
              { name: 'Insurance Services', path: '/insurance-services', icon: <Shield size={16} /> },
              { name: 'Financial Assistance', path: '/services/sub/financial-assistance', icon: <FileText size={16} /> },
              { name: 'Documentation Support', path: '/services/sub/documentation-support', icon: <FileText size={16} /> },
              { name: 'Business Registration', path: '/services/sub/business-registration', icon: <Building2 size={16} /> },
              { name: 'Business Compliance', path: '/services/sub/business-compliance', icon: <CheckSquare size={16} /> },
            ]
          }
        ]
      },
      {
        name: 'Explore More',
        isMega: true,
        icon: <Compass className={iconClass} />,
        widthClass: 'w-[90vw] max-w-[1000px]',
        alignClass: 'left-1/2 -translate-x-1/2',
        gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        categories: [
          {
            title: 'Customer Services',
            items: [
              { name: 'Product Ordering', path: '/explore-shop', icon: <ShoppingBag size={16} /> },
              { name: 'Job Openings', path: '/explore-jobs', icon: <Briefcase size={16} /> },
              { name: 'Ride Booking', path: '/rides/book', icon: <Truck size={16} /> },
              { name: 'Stay Bookings', path: '/pg-stays', icon: <Home size={16} /> },
              { name: 'Home Cleaning', path: '/home-services?category=cleaning', icon: <Sparkles size={16} /> },
              { name: 'Expert Repairs', path: '/home-services?category=repairs', icon: <Wrench size={16} /> },
              { name: 'Service Tracking', path: '/track-mission', icon: <Zap size={16} /> }
            ]
          },
          {
            title: 'Partner Network',
            items: [
              { name: 'Vendor Registration', path: '/register', state: { presetRole: 'Vendor' }, icon: <Building2 size={16} /> },
              { name: 'Delivery Partner', path: '/register', state: { presetRole: 'Delivery Partner' }, icon: <Truck size={16} /> },
              { name: 'Agent Network', path: '/agent-network', icon: <Users size={16} /> },
              { name: 'Partner Dashboard', path: '/login', icon: <LayoutDashboard size={16} /> }
            ]
          },
          {
            title: 'About & Support',
            items: [
              { name: 'About Forge India', path: '/about', icon: <Info size={16} /> },
              { name: 'Contact Support', path: '/contact', icon: <PhoneCall size={16} /> },
              { name: 'Atomy Wellness', path: '/atomy', icon: <Gift size={16} /> }
            ]
          }
        ]
      }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed top-0 w-full z-[99999] transition-all duration-500 ${isScrolled ? 'py-1 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-200/50 dark:border-gray-800/50' : 'py-2 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/30'}`}>
      <div className="w-full max-w-[1536px] mx-auto px-2 sm:px-4 md:px-6 xl:px-8">
        <div className="flex flex-nowrap items-center justify-between w-full gap-1 lg:gap-2 xl:gap-4 whitespace-nowrap overflow-visible h-16 lg:h-20">
          
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center gap-2 group relative shrink-0">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
              <motion.img 
                src="/logo.jpg" 
                alt="Forge India Connect" 
                decoding="async"
                className="w-[90%] h-[90%] object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo.jpg";
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] md:text-sm lg:text-[13px] xl:text-lg 2xl:text-xl font-black tracking-tighter block leading-none uppercase truncate">
                <span className="text-blue-600 dark:text-blue-400">FORGE INDIA</span>
              </span>
              <div className="mt-0.5 scale-[0.5] md:scale-[0.8] lg:scale-[0.7] xl:scale-100 origin-left flex justify-start">
                <AnimatedConnectText key={location.pathname} />
              </div>
            </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-4 xl:gap-6 2xl:gap-8 min-w-0">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isMega ? (
                  <div className="group py-4 flex items-center h-full">
                    <button className="group relative flex items-center h-full py-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-black text-[7px] lg:text-[7.5px] xl:text-[9px] 2xl:text-[10px] uppercase tracking-wide xl:tracking-wider 2xl:tracking-[0.1em] transition-all whitespace-nowrap">
                      {link.icon}
                      {link.name} 
                      <ChevronDown className="w-2.5 h-2.5 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-300 ml-0.5 xl:ml-1" />
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </button>
                    
                    <div className={`absolute top-[85%] ${link.alignClass || 'left-1/2 -translate-x-1/2'} mt-4 ${link.widthClass} bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] p-8 transition-all duration-500 border border-gray-100 dark:border-gray-800 text-left z-50 max-h-[85vh] overflow-y-auto ${forceClose ? 'opacity-0 invisible pointer-events-none' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0'}`}>
                      <div className={`grid ${link.gridClass} gap-8`}>
                        {link.categories.map((cat) => (
                          <div key={cat.title} className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary dark:text-orange-500 uppercase tracking-[0.2em] pb-2 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-2">
                              {cat.title}
                            </h4>
                            <div className="space-y-2">
                              {cat.items.map((item) => {
                                const isExternal = item.path.startsWith('http');
                                const LinkComponent = isExternal ? 'a' : Link;
                                const linkProps = isExternal ? { href: item.path, target: "_blank", rel: "noopener noreferrer" } : { to: item.path, state: item.state };
                                
                                return (
                                <LinkComponent 
                                  key={item.name} 
                                  {...linkProps}
                                  onClick={() => setForceClose(true)}
                                  className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-2xl transition-all group/item border border-transparent hover:border-gray-100/50 dark:hover:border-gray-800"
                                >
                                  <div className="w-8 h-8 bg-primary/10 text-primary dark:text-primary/90 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <p className="font-black text-gray-900 dark:text-white text-[11px] uppercase tracking-tight leading-tight">{item.name}</p>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Access System</p>
                                  </div>
                                </LinkComponent>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={link.path || '#'} 
                    className="group relative flex items-center h-full py-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-black text-[7px] lg:text-[7.5px] xl:text-[9px] 2xl:text-[10px] uppercase tracking-wide xl:tracking-wider 2xl:tracking-[0.1em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    {link.icon}
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </React.Fragment>
            ))}
            </div>

          {/* Right: Actions & Mobile Menu */}
          <div className="flex flex-nowrap items-center justify-end gap-1 xl:gap-2 shrink-0 whitespace-nowrap">
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 h-10 relative">

              {isLoggedIn ? (
                <div className="relative group/profile">
                  <button className="flex items-center justify-center w-10 h-10 bg-white/60 dark:bg-dark-card/60 border border-gray-200/50 dark:border-gray-800/50 rounded-full hover:border-primary/50 transition-all shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                      {userInfo.firstName?.[0] ?? '?'}
                    </div>
                  </button>
                  <div className="absolute top-[100%] right-0 mt-4 w-64 bg-white dark:bg-dark-card shadow-3xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-3 opacity-0 translate-y-4 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-500">
                    <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left rounded-2xl group/sub">
                      <User size={20} className="text-gray-400 group-hover/sub:text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Account Profile</span>
                    </button>
                    <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interface Theme</span>
                      <ThemeToggle />
                    </div>
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
                <div className="flex items-center gap-1 xl:gap-2 shrink-0">
                  <Link to="/login" className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 bg-gray-50 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-full transition-all" title="Login">
                    <User className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/contact" 
                    className="flex items-center h-7 lg:h-8 xl:h-9 px-2 lg:px-3 xl:px-4 bg-primary text-white rounded-full font-black text-[7px] lg:text-[7.5px] xl:text-[9px] 2xl:text-[10px] uppercase tracking-wide xl:tracking-wider 2xl:tracking-[0.1em] shadow-lg shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all whitespace-nowrap shrink-0"
                  >
                    Hire Through FIC <ExternalLink className="w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 ml-1" />
                  </Link>
                </div>
              )}
              
              {/* Location, Cart, Notifications (Moved out of dropdown) */}
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 h-8 lg:h-9 px-3 bg-white/60 dark:bg-dark-card/60 hover:bg-white dark:hover:bg-dark-card border border-gray-200/50 dark:border-gray-800/50 rounded-full transition-all group/loc shadow-sm shrink-0"
                title="Location"
              >
                <MapPin size={16} className="text-primary group-hover/loc:scale-110 transition-transform" />
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 truncate max-w-[80px] hidden md:block">
                  {appLocation?.city || 'Location'}
                </span>
              </button>

              {!['Admin', 'Sub-Admin'].includes(userInfo?.role) && (
                <Link to="/cart" className="relative flex items-center justify-center h-8 lg:h-9 px-3 lg:px-4 bg-white/60 dark:bg-dark-card/60 border border-gray-200/50 dark:border-gray-800/50 rounded-full hover:border-primary transition-all shadow-sm group/cart shrink-0">
                  <ShoppingCart size={16} className="text-gray-600 dark:text-gray-300 group-hover/cart:text-primary transition-colors mr-1 lg:mr-2" />
                  <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hidden sm:block">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg shadow-lg animate-bounce">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              <div className="relative group/notif">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 bg-white/60 dark:bg-dark-card/60 border border-gray-200/50 dark:border-gray-800/50 rounded-full hover:border-secondary transition-all shadow-sm shrink-0"
                >
                  <Bell size={16} className="text-gray-600 dark:text-gray-300 group-hover/notif:text-secondary transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg shadow-lg">
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
                        <h4 className="text-sm font-black uppercase tracking-tighter">Intelligence <span className="text-secondary">Feed</span></h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                          }} 
                          className="text-[10px] text-gray-400 hover:text-primary font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                        >
                          <CheckSquare size={12} /> Clear All
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <p className="text-center py-10 text-[10px] font-black text-gray-300 uppercase tracking-widest">No signals detected</p>
                        ) : (
                          notifications.map((n) => {
                            const isOTP = n.type === 'otp' || n.title?.toLowerCase().includes('otp');
                            return (
                              <div 
                                key={n._id} 
                                onClick={() => !n.isRead && markAsRead(n._id)}
                                className={`p-4 rounded-2xl border cursor-pointer group/notifitem transition-all ${n.isRead ? 'bg-gray-50/50 dark:bg-dark-bg/50 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-secondary/5 border-secondary/20 shadow-md ring-1 ring-secondary/10'}`}
                              >
                                <div className="flex items-start gap-3">
                                  {isOTP && (
                                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                      <Zap size={14} />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${n.isRead ? 'text-gray-400' : 'text-secondary'}`}>
                                      {n.title || (isOTP ? 'Security Alert' : 'System Message')}
                                    </p>
                                    <p className={`text-xs font-bold leading-tight ${n.isRead ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>{n.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <p className="text-[8px] font-black text-gray-400 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                      {!n.isRead && <div className="w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_8px_#0d9488]" />}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <Link to="/notifications" onClick={() => setShowNotifications(false)} className="block text-center mt-6 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Operations</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-2 md:gap-3 relative z-[9999]">
              <Link to="/cart" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white relative">
                <ShoppingCart size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
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
              className="fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-sm bg-white dark:bg-dark-bg z-[100001] shadow-3xl flex flex-col overflow-y-auto"
            >
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm sticky top-0 z-[10]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-1.5 shadow-lg shrink-0">
                    <img 
                      src="/logo.svg" 
                      alt="Logo" 
                      className="w-full h-full object-contain rounded-lg" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/logo.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col leading-none min-w-0">
                    <span className="font-black text-base md:text-lg tracking-tighter text-blue-600 dark:text-blue-400 uppercase truncate">FORGE INDIA</span>
                    <span className="font-black text-[10px] tracking-[0.2em] text-amber-500 uppercase mt-1 text-left truncate">CONNECT</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-card rounded-2xl text-gray-500 hover:text-red-500 transition-colors shadow-sm shrink-0 ml-4"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white dark:bg-dark-bg">
                <div className="space-y-6">
                  {navLinks.map((link, idx) => (
                    <motion.div 
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05), type: 'spring', damping: 25 }}
                    >
                      {link.isMega ? (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-primary rounded-full"></span> {link.name}
                          </p>
                          <div className="space-y-6 pl-4 border-l border-gray-100 dark:border-gray-800">
                            {link.categories.map((cat) => (
                              <div key={cat.title} className="space-y-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{cat.title}</p>
                                <div className="grid grid-cols-1 gap-2">
                                  {cat.items.map(item => (
                                    <Link 
                                      key={item.name} 
                                      to={item.path} 
                                      state={item.state}
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-dark-card/30 rounded-2xl border border-gray-100 dark:border-gray-800/50"
                                    >
                                      <div className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                        {React.cloneElement(item.icon, { size: 14 })}
                                      </div>
                                      <span className="font-bold text-gray-700 dark:text-gray-300 text-[10px] uppercase tracking-tight">{item.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link 
                          to={link.path || '#'} 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-card/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 active:scale-[0.98] transition-all shadow-sm font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight hover:text-primary group/moblink"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/moblink:bg-primary transition-colors"></div>
                            {link.name}
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover/moblink:text-primary transition-colors" />
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-bg/50">
                <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Night Mode</span>
                  </div>
                  <ThemeToggle />
                </div>
                {isLoggedIn ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { handleDashboardClick(); setIsOpen(false); }}
                      className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition-all"
                    >
                      <LayoutDashboard size={20} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Command Hub</span>
                    </button>
                    
                    <button 
                      onClick={() => { navigate('/notifications'); setIsOpen(false); }}
                      className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition-all relative"
                    >
                      <Bell size={20} className="text-secondary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="absolute top-4 right-4 w-4 h-4 bg-secondary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="flex flex-col items-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-500 shadow-sm active:scale-95 transition-all col-span-2"
                    >
                      <LogOut size={20} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 text-center font-black text-gray-500 uppercase tracking-[0.2em] text-[10px] hover:text-primary transition-colors border border-gray-100 dark:border-gray-800 rounded-2xl"
                    >
                      Member Login
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 bg-primary text-white rounded-2xl text-center font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all"
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

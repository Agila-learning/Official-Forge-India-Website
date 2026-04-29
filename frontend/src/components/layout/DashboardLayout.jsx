import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, ShoppingBag, Calendar, Package, 
    MessageSquare, Star, Link as LinkIcon, MapPin, Image, 
    MessageCircle as ReviewIcon, LogOut, ShieldCheck, Mail, Phone, 
    Trash2, Edit, AlertCircle, Store, Network, Briefcase, Wrench, 
    Upload, UserPlus, ClipboardList, XCircle, CheckCircle2, Menu, X,
    Bell, Settings, User, ChevronRight, PanelLeftClose, PanelLeftOpen,
    Shield, Target, Zap, LifeBuoy, Send, CreditCard, MessageCircle,
    GraduationCap, BookOpen, Share2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import LiveActivityToast from '../ui/LiveActivityToast';

const DashboardLayout = ({ 
    children, 
    activeTab, 
    setActiveTab, 
    stats = {}, 
    themeColor = 'primary' 
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const role = userInfo.role || 'Customer';

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(Array.isArray(data) ? data : []);
            } catch (err) {
                console.warn('Notifications fetch failed');
                setNotifications([]);
            }
        };
        if (role) fetchNotifications();
        
        // Refresh every 30 seconds
        const timer = setInterval(fetchNotifications, 30000);
        return () => clearInterval(timer);
    }, [role]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            toast.error('Failed to mark notification');
        }
    };

    const themeClasses = {
        'primary': {
            active: 'bg-primary text-white shadow-lg shadow-primary/30',
            hover: 'hover:bg-primary/5 hover:text-primary',
            text: 'text-primary',
            bg: 'bg-primary',
            shadow: 'shadow-primary/20'
        },
        'orange-500': {
            active: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30',
            hover: 'hover:bg-orange-500/5 hover:text-orange-500',
            text: 'text-orange-500',
            bg: 'bg-orange-500',
            shadow: 'shadow-orange-500/20'
        },
        'secondary': {
            active: 'bg-secondary text-dark-bg shadow-lg shadow-secondary/30',
            hover: 'hover:bg-secondary/5 hover:text-secondary',
            text: 'text-secondary',
            bg: 'bg-secondary',
            shadow: 'shadow-secondary/20'
        },
        'purple-600': {
            active: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30',
            hover: 'hover:bg-purple-600/5 hover:text-purple-600',
            text: 'text-purple-600',
            bg: 'bg-purple-600',
            shadow: 'shadow-purple-600/20'
        }
    };

    const theme = themeClasses[themeColor] || themeClasses['primary'];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const getSidebarTabs = () => {
        const commonTabs = [
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'profile', icon: User, label: 'My Profile' },
            { id: 'settings', icon: Settings, label: 'Settings' },
        ];

        switch (role) {
            case 'Admin':
            case 'Sub-Admin':
                const subAdminRestricted = ['locations', 'users'];
                const isSubAdmin = role === 'Sub-Admin';
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'users', icon: Users, label: 'Users & Partners' },
                    { id: 'vendors', icon: Store, label: 'Vendor Management' },
                    { id: 'orders', icon: ShoppingBag, label: 'Customer Orders' },
                    { id: 'events', icon: Calendar, label: 'Events' },
                    { id: 'atomy', icon: Package, label: 'Product Catalog' },
                    { id: 'services', icon: Wrench, label: 'Services' },
                    { id: 'home-cms', icon: LayoutDashboard, label: 'Home Service CMS' },
                    { id: 'jobs', icon: Briefcase, label: 'Job Postings' },
                    { id: 'applications', icon: ClipboardList, label: 'Candidate Tracking' },
                    { id: 'training', icon: GraduationCap, label: 'Training & Courses' },
                    { id: 'faqs', icon: MessageSquare, label: 'Manage FAQs' },
                    { id: 'testimonials', icon: Star, label: 'Testimonials' },
                    { id: 'locations', icon: LinkIcon, label: 'Service Areas' },
                    { id: 'location-requests', icon: MapPin, label: 'Integration Requests' },
                    { id: 'media', icon: Image, label: 'Media Manager' },
                    { id: 'tickets', icon: ReviewIcon, label: 'Support Tickets' },
                    { id: 'inquiries', icon: ClipboardList, label: 'Service Inquiries' },
                    { id: 'messages', icon: Send, label: 'Messages' },
                    { id: 'profile', icon: User, label: 'My Profile' }
                ].filter(tab => !isSubAdmin || !subAdminRestricted.includes(tab.id));

            case 'Vendor':
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'inventory', icon: Package, label: 'Inventory' },
                    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
                    { id: 'customers', icon: Users, label: 'Customers' },
                    { id: 'tickets', icon: LifeBuoy, label: 'Support' },
                    { id: 'profile', icon: User, label: 'My Profile' },
                    { id: 'settings', icon: Settings, label: 'Settings' },
                ];

            case 'HR':
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'jobs', icon: Briefcase, label: 'Job Postings' },
                    { id: 'applications', icon: ClipboardList, label: 'Candidate Pipeline' },
                    { id: 'services', icon: Wrench, label: 'Manage Services' },
                    { id: 'profile', icon: User, label: 'My Profile' },
                    { id: 'settings', icon: Settings, label: 'Settings' },
                ];

            case 'Delivery Partner':
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'missions', icon: Target, label: 'Active Missions' },
                    { id: 'fleet', icon: Network, label: 'Fleet Status' },
                    { id: 'tickets', icon: LifeBuoy, label: 'Support' },
                    { id: 'profile', icon: User, label: 'My Profile' },
                ];

            case 'Candidate':
                return [
                    { id: 'overview',     icon: LayoutDashboard, label: 'Control Center' },
                    { id: 'consulting',   icon: CreditCard,       label: 'Job Consulting 🌟' },
                    { id: 'shop',         icon: ShoppingBag,      label: 'Explore Shop' },
                    { id: 'orders',       icon: Package,          label: 'My Bookings' },
                    { id: 'browse',       icon: Briefcase,        label: 'Job Marketplace' },
                    { id: 'applications', icon: ClipboardList,    label: 'My Applications' },
                    { id: 'notifications',icon: Bell,             label: 'Alerts' },
                    { id: 'messages',     icon: Send,             label: 'Support Chat' },
                    { id: 'quippy',       icon: MessageSquare,    label: 'Chat with Quippy' },
                    { id: 'profile',      icon: User,             label: 'Strategy Profile' },
                ];

            case 'Trainer':
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Control Center' },
                    { id: 'batches', icon: BookOpen, label: 'My Batches' },
                    { id: 'students', icon: Users, label: 'Candidates' },
                    { id: 'chat', icon: MessageCircle, label: 'Communication' },
                    { id: 'materials', icon: Share2, label: 'Course Content' },
                    { id: 'assignments', icon: ClipboardList, label: 'Assessments' },
                    { id: 'profile', icon: User, label: 'My Profile' },
                ];

            case 'Employer':
                return [
                    { id: 'overview', icon: LayoutDashboard, label: 'Enterprise Hub' },
                    { id: 'jobs', icon: Briefcase, label: 'Job Requisitions' },
                    { id: 'applicants', icon: Users, label: 'Talent Pool' },
                    { id: 'profile', icon: User, label: 'Company Profile' },
                    { id: 'settings', icon: Settings, label: 'Console Settings' },
                ];

            default:
                return commonTabs;
        }
    };

    const tabs = getSidebarTabs();

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col md:flex-row font-inter antialiased">
    
            
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 z-[200]">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform p-1">
                        <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{role} Hub</span>
                        <span className="text-sm font-black uppercase tracking-tighter text-gray-900 dark:text-white">FIC <span className="text-yellow-500">CON</span></span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {role === 'Candidate' && (
                        <Link to="/cart" className="w-10 h-10 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-xl flex items-center justify-center relative">
                            <ShoppingBag size={20} />
                        </Link>
                    )}
                    <button 
                        onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsSidebarOpen(false); }}
                        className="w-10 h-10 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-xl flex items-center justify-center relative"
                    >
                        <Bell size={20} />
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-dark-card"></span>
                        )}
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 ml-1">
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'md:w-24' : 'md:w-80'} fixed md:sticky top-0 left-0 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen z-[210] transition-all duration-500 ease-in-out`}>
                <div className="p-8 mb-4 relative">
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden absolute top-8 right-6 w-10 h-10 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800"
                    >
                        <X size={20} />
                    </button>
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="p-1 bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg shrink-0 w-12 h-12 overflow-hidden group-hover:scale-105 transition-transform">
                            <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                        </div>
                        {!isCollapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-xl font-black uppercase tracking-tighter leading-none text-gray-900 dark:text-white flex flex-col">
                                    <span className="text-blue-600 dark:text-blue-400">FORGE INDIA</span>
                                    <span className="text-yellow-500 mt-1">CONNECT</span>
                                </h2>
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">{role} CONSOLE</p>
                            </motion.div>
                        )}
                    </Link>
                </div>
                
                <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? theme.active : `text-gray-500 ${theme.hover}`}`}
                            title={isCollapsed ? tab.label : ''}
                        >
                            <tab.icon className={isCollapsed ? '' : 'mr-4'} size={20} />
                            {!isCollapsed && tab.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2 px-4 pb-6">
                    <Link 
                        to="/"
                        className={`w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-500 hover:text-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                    >
                        <Zap size={isCollapsed ? 20 : 18} className={isCollapsed ? '' : 'mr-3'} />
                        {!isCollapsed && 'Visit Landing'}
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className={`w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                    >
                        <LogOut size={isCollapsed ? 20 : 18} className={isCollapsed ? '' : 'mr-3'} />
                        {!isCollapsed && 'Logout Signal'}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen overflow-y-auto bg-gray-50/30 dark:bg-dark-bg/30 mt-20 md:mt-0 relative">
                {/* Desktop Header */}
                <header className="hidden md:flex bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-10 py-8 justify-between items-center sticky top-0 z-[100]">
                    <div className="flex items-center gap-4">
                        <div className={`w-1 h-8 ${theme.bg} rounded-full`}></div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter leading-none italic font-poppins">
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                {activeTab === 'overview' ? 'Management Hub' : activeTab.replace('-', ' ')}
                            </span>
                        </h1>
                    </div>
                    
                    <div className="flex gap-4">
                         <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hidden md:flex p-3 bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 ${theme.hover} transition-all`}>
                             {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                         </button>
                        
                        {role === 'Candidate' && (
                            <Link to="/cart" className="w-12 h-12 bg-gray-50 dark:bg-dark-bg text-gray-400 hover:text-primary rounded-2xl flex items-center justify-center transition-all relative">
                                <ShoppingBag size={20} />
                            </Link>
                        )}

                        {/* Notification Toggle */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`w-12 h-12 bg-gray-50 dark:bg-dark-bg text-gray-400 hover:text-primary rounded-2xl flex items-center justify-center transition-all relative ${isNotificationOpen ? 'ring-2 ring-primary/20 text-primary' : ''}`}
                            >
                                <Bell size={20} />
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-dark-card">
                                        {notifications.filter(n => !n.isRead).length > 9 ? '9+' : notifications.filter(n => !n.isRead).length}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationOpen && (
                                    <>
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="fixed inset-0 z-[1001]"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute right-0 mt-4 w-96 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-3xl z-[1002] overflow-hidden"
                                        >
                                            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                                <h3 className="text-lg font-black uppercase tracking-tighter italic">Alerts <span className="text-primary">&</span> Updates</h3>
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg">Real-time</span>
                                            </div>
                                            
                                            <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="py-16 text-center">
                                                        <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-3xl flex items-center justify-center mx-auto mb-4 grayscale opacity-40">
                                                            <Bell size={24} />
                                                        </div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">All systems clear.</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((n) => (
                                                        <div 
                                                            key={n._id} 
                                                            onClick={() => {
                                                                if (!n.isRead) markAsRead(n._id);
                                                                if (n.link) navigate(n.link);
                                                                setIsNotificationOpen(false);
                                                            }}
                                                            className={`p-6 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors cursor-pointer group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                                                        >
                                                            <div className="flex gap-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'Order' ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                                                                    {n.type === 'Order' ? <ShoppingBag size={18} /> : <Target size={18} />}
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-primary transition-colors">{n.title}</h4>
                                                                        {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 leading-relaxed font-medium mb-2">{n.message}</p>
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            
                                            <button 
                                                onClick={() => { setActiveTab('notifications'); setIsNotificationOpen(false); }}
                                                className="w-full py-6 bg-gray-50 dark:bg-dark-bg/50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors border-t border-gray-50 dark:border-gray-800"
                                            >
                                                View Strategic Archive <ChevronRight size={10} className="inline ml-1" />
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-10 w-[1px] bg-gray-100 dark:border-gray-800 mx-2"></div>
                        <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-bg p-2 rounded-2xl transition-all">
                            <div className="text-right hidden xl:block">
                                <p className="text-xs font-black text-gray-900 dark:text-white uppercase leading-none mb-1">{userInfo.firstName} {userInfo.lastName}</p>
                                <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">{role}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                <div className="w-full h-full bg-white dark:bg-dark-card rounded-[10px] flex items-center justify-center font-black text-primary uppercase text-sm">
                                    {userInfo.firstName?.[0]}
                                </div>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Viewport */}
                <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-dark-bg/60 backdrop-blur-sm z-[205] md:hidden"
                    />
                )}
            </AnimatePresence>

            {role === 'Customer' && <LiveActivityToast />}
        </div>
    );
};

export default DashboardLayout;

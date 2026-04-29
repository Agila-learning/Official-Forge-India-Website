import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, ShoppingBag, Calendar, Package, 
    MessageSquare, Star, Link as LinkIcon, MapPin, Image, 
    MessageCircle as ReviewIcon, LogOut, ShieldCheck, Mail, Phone, 
    Trash2, Edit, AlertCircle, Store, Network, Briefcase, Wrench, Upload, UserPlus, ClipboardList, XCircle, CheckCircle2,
    Search, Plus, FileText, PlusCircle, Zap, Sparkles, Bell, Send
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import gsap from 'gsap';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import SubServiceManager from '../components/ui/SubServiceManager';
import HomeServiceCMS from '../components/admin/HomeServiceCMS';
import TrainingManager from '../components/admin/TrainingManager';
import DashboardLayout from '../components/layout/DashboardLayout';
import NoDataFound from '../components/ui/NoDataFound';

const AdminDashboard = () => {
  const [data, setData] = useState({ events: [], jobs: [], products: [], faqs: [], users: [], contacts: [], candidates: [], testimonials: [], tickets: [], inquiries: [], homeCategories: [], homeSubCategories: [] });
  const [locationRequests, setLocationRequests] = useState([]);
  const [loadStatus, setLoadStatus] = useState({ loading: false, error: '' });
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState({ events: null, jobs: null, products: null, faqs: null, candidates: null, locations: null, testimonials: null });
  const [selectedUserKYC, setSelectedUserKYC] = useState(null);
  const { fetchNotifications } = useNotifications();
  const [managedSlots, setManagedSlots] = useState([]);
  const [managedServiceConfig, setManagedServiceConfig] = useState([]);

  useEffect(() => {
    if (editingItem.products) {
        setManagedSlots(editingItem.products.slots || []);
        setManagedServiceConfig(editingItem.products.serviceConfig || []);
    } else {
        setManagedSlots([]);
        setManagedServiceConfig([]);
    }
  }, [editingItem.products]);

  useEffect(() => {
    if (location.state?.view) {
      setActiveTab(location.state.view);
    }
  }, [location.state]);

  const [dashboardStats, setDashboardStats] = useState({});
  const [uploadStatus, setUploadStatus] = useState({ loading: false, url: '', error: '' });
  const [userSearch, setUserSearch] = useState('');
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [vendorFilter, setVendorFilter] = useState('all');
  const [locations, setLocations] = useState([]);
  const [selectedVendorForAsset, setSelectedVendorForAsset] = useState(null);

  // Messaging state
  const [chatContacts, setChatContacts] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [chatRoleFilter, setChatRoleFilter] = useState('All');
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminEditData, setAdminEditData] = useState({
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    mobile: userInfo?.mobile || ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isSubAdmin = userInfo.role === 'Sub-Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus({ loading: true, url: '', error: '' });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: uploadData } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = uploadData.startsWith('/') ? `http://localhost:5000${uploadData}` : uploadData;
      setUploadStatus({ loading: false, url: fullUrl, error: '' });
    } catch (error) {
      setUploadStatus({ loading: false, url: '', error: 'Failed to upload image' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoadStatus({ loading: true, error: '' });
        try {
            const [eventsRes, jobsRes, productsRes, faqsRes, candidatesRes, usersRes, locationsRes, reviewsRes, ordersRes, appsRes, testimonialsRes, locationRequestsRes, ticketsRes, inquiriesRes] = await Promise.all([
                api.get('/events').catch(() => ({ data: [] })),
                api.get('/jobs').catch(() => ({ data: [] })),
                api.get('/products').catch(() => ({ data: [] })),
                api.get('/faqs').catch(() => ({ data: [] })),
                api.get('/candidates').catch(() => ({ data: [] })),
                api.get('/users').catch(() => ({ data: [] })),
                api.get('/locations').catch(() => ({ data: [] })),
                api.get('/reviews').catch(() => ({ data: [] })),
                api.get('/orders').catch(() => ({ data: [] })),
                api.get('/applications').catch(() => ({ data: [] })),
                api.get('/testimonials').catch(() => ({ data: [] })),
                api.get('/location-requests').catch(() => ({ data: [] })),
                api.get('/tickets').catch(() => ({ data: [] })),
                api.get('/inquiries').catch(() => ({ data: [] }))
            ]);
            
            setData(prev => ({ 
                ...prev, 
                events: eventsRes.data || [], 
                jobs: jobsRes.data || [], 
                products: productsRes.data || [],
                faqs: faqsRes.data || [],
                candidates: candidatesRes.data || [],
                users: usersRes.data || [],
                applications: appsRes.data || [],
                testimonials: testimonialsRes.data || [],
                tickets: ticketsRes.data || (Array.isArray(ticketsRes) ? ticketsRes : []),
                inquiries: inquiriesRes.data || []
            }));
            setReviews(reviewsRes.data || []);
            setOrders(ordersRes.data || []);
            setLocations(locationsRes.data || []);
            setDeliveryPartners((usersRes.data || []).filter(u => u.role === 'Delivery Partner'));
            setLocationRequests(locationRequestsRes.data || []);
            
            if (activeTab === 'overview') {
                const rev = (ordersRes.data || []).reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
                const hiredCount = (appsRes.data || []).filter(app => app.status === 'Hired').length;
                const serviceBookingsCount = (ordersRes.data || []).filter(order => 
                    order.orderItems?.some(item => item.isService)
                ).length;

                setDashboardStats({
                    totalUsers: (usersRes.data || []).length,
                    revenue: (rev / 1000).toFixed(1) + 'k',
                    activeSessions: 142,
                    hiredCount: hiredCount,
                    serviceBookings: serviceBookingsCount
                });
            }

            setLoadStatus({ loading: false, error: '' });

            // Final sync for categories with extra safety
            const catsResponse = await api.get('/home-categories').catch(() => ({ data: [] }));
            const subsResponse = await api.get('/home-categories/sub').catch(() => ({ data: [] }));
            
            // Normalize data structures
            const finalCats = Array.isArray(catsResponse.data) ? catsResponse.data : (Array.isArray(catsResponse) ? catsResponse : []);
            const finalSubs = Array.isArray(subsResponse.data) ? subsResponse.data : (Array.isArray(subsResponse) ? subsResponse : []);
            
            setData(prev => ({ 
                ...prev, 
                homeCategories: finalCats, 
                homeSubCategories: finalSubs 
            }));

            gsap.from('.glass-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power4.out'
            });
        } catch (err) {
            setLoadStatus({ loading: false, error: 'Failed to fetch dashboard data' });
        }
    };
    if (activeTab === 'media') return;
    fetchData();

  }, [activeTab]);

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    // Auto-detect service vs product based on active tab
    if (activeTab === 'services') payload.isService = true;
    else if (payload.isService) payload.isService = true;
    else payload.isService = false;
    
    if (endpoint === 'testimonials') {
        payload.featured = payload.featured === 'on';
        payload.rating = Number(payload.rating || 5);
    }
    
    if (endpoint === 'products') {
        payload.price = Number(payload.price) || 0;
        if (payload.discountPrice) payload.discountPrice = Number(payload.discountPrice);
        if (payload.countInStock) payload.countInStock = Number(payload.countInStock);
        if (payload.tags) payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        if (payload.highlights) payload.highlights = payload.highlights.split(',').map(h => h.trim()).filter(Boolean);
        if (payload.whatsIncluded) payload.whatsIncluded = payload.whatsIncluded.split(',').map(h => h.trim()).filter(Boolean);

        // Provide default image for services if none given
        if (!payload.image || payload.image.trim() === '') {
            payload.image = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
        }

        payload.slots = managedSlots;
        payload.serviceConfig = managedServiceConfig;
        payload.deliveryCharge = Number(payload.deliveryCharge || 0);
        payload.freeDeliveryThreshold = Number(payload.freeDeliveryThreshold || 0);
        if (payload.serviceableArea) payload.serviceableArea = payload.serviceableArea.split(',').map(s => s.trim()).filter(Boolean);
        
        payload.viewImages = {
            front: payload.viewImages_front || '',
            back: payload.viewImages_back || '',
            top: payload.viewImages_top || '',
            bottom: payload.viewImages_bottom || ''
        };
        delete payload.viewImages_front;
        delete payload.viewImages_back;
        delete payload.viewImages_top;
        delete payload.viewImages_bottom;

        // Service-specific fields
        payload.teamSize = Number(payload.teamSize || 0);
        payload.equipmentProvided = payload.equipmentProvided === 'true';
        if (payload.safetyMeasures) payload.safetyMeasures = payload.safetyMeasures.split(',').map(s => s.trim()).filter(Boolean);
    }

    const currentEdit = editingItem[endpoint];
    
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        if (currentEdit) {
            const { data: updatedItem } = await api.put(`/${endpoint}/${currentEdit._id}`, payload);
            setData(prev => ({
                ...prev,
                [endpoint]: prev[endpoint].map(item => item._id === currentEdit._id ? updatedItem : item)
            }));
            toast.success(`${endpoint.slice(0, -1)} updated successfully!`);
            setEditingItem(prev => ({ ...prev, [endpoint]: null }));
        } else {
            const { data: newItem } = await api.post(`/${endpoint}`, payload);
            setData(prev => ({
                ...prev,
                [endpoint]: [...prev[endpoint], newItem]
            }));
            toast.success(`${endpoint.slice(0, -1)} created successfully!`);
        }
        e.target.reset();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this item?')) return;
    try {
        await api.delete(`/${endpoint}/${id}`);
        
        setData(prev => ({
            ...prev,
            [endpoint]: prev[endpoint].filter(item => item._id !== id)
        }));
        toast.success('Item deleted securely.');
    } catch (err) {
        toast.error('Failed to delete item');
    }
  };

  const cancelEdit = (endpoint) => {
    setEditingItem(prev => ({...prev, [endpoint]: null}));
  };

  const handleUpdateAdminProfile = async () => {
    try {
      const { data } = await api.put('/users/profile', adminEditData);
      const updatedInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      toast.success('Admin profile updated!');
      setIsAdminEditing(false);
      window.location.reload(); // Refresh to sync header/state
    } catch (err) {
      toast.error('Profile sync failed');
    }
  };

  const handleAssignPartner = async (orderId, partnerId) => {
    if (!partnerId) {
        toast.error('Strategic Error: Please select a valid Partner first');
        return;
    }
    try {
      await api.put(`/orders/${orderId}/assign`, { partnerId });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryPartner: partnerId, status: 'Partner Assigned' } : o));
      toast.success('Partner assigned successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign partner');
    }
  };

  const subAdminRestrictedTabs = ['locations', 'users'];
  
  const sidebarTabs = [
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
    { id: 'faqs', icon: MessageSquare, label: 'Manage FAQs' },
    { id: 'testimonials', icon: Star, label: 'Testimonials' },
    { id: 'locations', icon: LinkIcon, label: 'Service Areas' },
    { id: 'location-requests', icon: MapPin, label: 'Integration Requests' },
    { id: 'media', icon: Image, label: 'Media Manager' },
    { id: 'tickets', icon: ReviewIcon, label: 'Support Tickets' },
{ id: 'inquiries', icon: ClipboardList, label: 'Service Inquiries' },
    { id: 'messages', icon: Send, label: 'Messages' },
    { id: 'profile', icon: Users, label: 'My Profile' }
  ].filter(tab => !isSubAdmin || !subAdminRestrictedTabs.includes(tab.id));

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={dashboardStats}>
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 mt-12">
                        <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl min-h-[400px]">
                            <h3 className="text-2xl font-black mb-8 italic">Recent <span className="text-primary italic">Activity</span></h3>
                            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                      {orders.slice(0, 20).map(order => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><ShoppingBag size={20} /></div>
                              <div>
                                 <p className="font-bold text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                                 <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{order.user?.firstName} • ₹{order.totalPrice}</p>
                              </div>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-center py-10 text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">No recent activity logged</p>}
                   </div>
                </div>
                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                   <h3 className="text-2xl font-black mb-6">New Partnerships</h3>
                   <div className="space-y-4">
                      {data.users.filter(u => u.approvalStatus === 'Pending').slice(0, 5).map(user => (
                        <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"><UserPlus size={20} /></div>
                              <div>
                                 <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                                 <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{user.role}</p>
                              </div>
                           </div>
                           <button onClick={() => { setActiveTab('users'); setSelectedUserKYC(user); }} className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Review</button>
                        </div>
                      ))}
                      {data.users.filter(u => u.approvalStatus === 'Pending').length === 0 && (
                        <div className="py-10 text-center text-gray-500 dark:text-gray-400 font-bold italic">No pending applications</div>
                      )}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                   <h3 className="text-2xl font-black mb-6">Recent Job Applications</h3>
                   <div className="space-y-4">
                      {data.applications?.slice(0, 5).map(app => (
                        <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600"><ClipboardList size={20} /></div>
                              <div>
                                 <p className="font-bold text-sm">{app.fullName}</p>
                                 <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">{app.jobRole}</p>
                              </div>
                           </div>
                           <button onClick={() => setActiveTab('applications')} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">Track</button>
                        </div>
                      ))}
                      {(data.applications?.length || 0) === 0 && (
                        <div className="py-10 text-center text-gray-500 dark:text-gray-400 font-bold italic">No recent applications</div>
                      )}
                      {data.applications?.length > 5 && (
                        <button onClick={() => setActiveTab('applications')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">View All Applications ({data.applications.length})</button>
                      )}
                   </div>
                </div>
                    </div>
                )}

        {activeTab !== 'overview' && activeTab !== 'messages' && (
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold capitalize">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Manage</span>{' '}
              <span className="text-gray-900 dark:text-white">{activeTab.replace('-', ' ')}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Official Forge India Connect Administrative Suite.</p>
          </header>
        )}

        {activeTab === 'events' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editingItem.events ? 'Edit Networking Event' : 'Create New Networking Event'}</h3>
                        {editingItem.events && (
                            <button onClick={() => cancelEdit('events')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.events ? editingItem.events._id : 'new'} onSubmit={(e) => handleSubmit(e, 'events')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Event Title</label>
                            <input name="title" defaultValue={editingItem.events?.title || ''} required type="text" placeholder="FIC Networking Summit" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Date & Time</label>
                            <input name="date" defaultValue={editingItem.events?.date || ''} required type="text" placeholder="Oct 25, 2024 - 10:00 AM" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Location</label>
                            <input name="location" defaultValue={editingItem.events?.location || ''} required type="text" placeholder="Bangalore, Virtual" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Image URL (from Media Manager)</label>
                            <input name="image" defaultValue={editingItem.events?.image || ''} type="text" placeholder="https://..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2 uppercase">Full Description</label>
                            <textarea name="description" defaultValue={editingItem.events?.description || ''} rows="3" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none"></textarea>
                        </div>
                        <button type="submit" className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">
                            {editingItem.events ? 'Update Event Details' : 'Publish Event'}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
                    <h3 className="text-2xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Currently Published Events</h3>
                    <div className="space-y-4">
                        {data.events.map(event => (
                            <div key={event._id} className="flex items-center justify-between p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group">
                                <div>
                                    <h4 className="font-black text-lg group-hover:text-primary transition-colors">{event.title}</h4>
                                    <p className="text-sm text-gray-500">{event.date} | {event.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        setEditingItem(prev => ({...prev, events: event}));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Edit">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete('events', event._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Delete">
                                        <AlertCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'training' && (
            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                <TrainingManager />
            </div>
        )}

        {activeTab === 'jobs' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editingItem.jobs ? 'Edit Job Opening' : 'Post New Job Opening'}</h3>
                        {editingItem.jobs && (
                            <button onClick={() => cancelEdit('jobs')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.jobs ? editingItem.jobs._id : 'new'} onSubmit={(e) => handleSubmit(e, 'jobs')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Job Title</label>
                            <input name="title" defaultValue={editingItem.jobs?.title || ''} required type="text" placeholder="Senior Web Developer" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Company Name</label>
                            <input name="companyName" defaultValue={editingItem.jobs?.companyName || ''} required type="text" placeholder="Forge India Connect" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Location</label>
                            <input name="location" defaultValue={editingItem.jobs?.location || ''} required type="text" placeholder="Bangalore / Remote" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Salary Package</label>
                            <input name="salary" defaultValue={editingItem.jobs?.salary || ''} required type="text" placeholder="2.5 - 3 LPA" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Experience Required</label>
                            <input name="experience" defaultValue={editingItem.jobs?.experience || ''} required type="text" placeholder="2+ Years" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Requirements (Comma Separated)</label>
                            <input name="requirements" defaultValue={Array.isArray(editingItem.jobs?.requirements) ? editingItem.jobs.requirements.join(', ') : (editingItem.jobs?.requirements || '')} type="text" placeholder="React, Node.js, AWS" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2 uppercase">Job Description</label>
                            <textarea name="description" defaultValue={editingItem.jobs?.description || ''} rows="3" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none"></textarea>
                        </div>
                        <button type="submit" className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">
                            {editingItem.jobs ? 'Save Job Modifications' : 'Post Job Opportunity'}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
                    <h3 className="text-2xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Active Job Openings</h3>
                    <div className="space-y-4">
                        {data.jobs.map(job => (
                            <div key={job._id} className="flex items-center justify-between p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group">
                                <div>
                                    <h4 className="font-black text-lg group-hover:text-primary transition-colors">{job.title}</h4>
                                    <p className="text-sm text-gray-500">{job.location} | {job.salary}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        setEditingItem(prev => ({...prev, jobs: job}));
                                        setManagedSlots(job.slots || []);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Edit">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete('jobs', job._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Delete">
                                        <AlertCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'atomy' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editingItem.products ? 'Edit Product Listing' : 'Manage Product Catalog'}</h3>
                        {editingItem.products && (
                            <button onClick={() => cancelEdit('products')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.products ? editingItem.products._id : 'new'} onSubmit={(e) => handleSubmit(e, 'products')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Product Name</label>
                            <input name="name" defaultValue={editingItem.products?.name || ''} required type="text" placeholder="Atomy HemoHim" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Category</label>
                            <select name="category" defaultValue={editingItem.products?.category || ''} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="">Select Category</option>
                                {data.homeCategories?.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Base Price (INR)</label>
                            <input name="price" defaultValue={editingItem.products?.price || ''} required type="number" placeholder="5000" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Discount Price (INR)</label>
                            <input name="discountPrice" defaultValue={editingItem.products?.discountPrice || ''} type="number" placeholder="4500" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Stock Count</label>
                            <input name="countInStock" defaultValue={editingItem.products?.countInStock || 0} type="number" placeholder="100" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Marketing Tags (CSV)</label>
                            <input name="tags" defaultValue={editingItem.products?.tags?.join(', ') || ''} type="text" placeholder="Summer Sale, Exclusive" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-primary">Global Highlights (CSV)</label>
                            <input name="highlights" defaultValue={editingItem.products?.highlights?.join(', ') || ''} type="text" placeholder="Premium Quality, Fast Shipping" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-secondary">Service Provider / Vendor</label>
                            <select name="vendorId" defaultValue={editingItem.products?.vendorId?._id || editingItem.products?.vendorId || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
                                <option value="">Platform (Admin)</option>
                                {data.users.filter(u => u.role === 'Vendor').map(v => (
                                    <option key={v._id} value={v._id}>{v.businessName || `${v.firstName} ${v.lastName}`}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Shop Name</label>
                            <input name="shopName" defaultValue={editingItem.products?.shopName || ''} required type="text" placeholder="Forge India Official" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Image URL (from Media Manager)</label>
                            <input name="image" defaultValue={editingItem.products?.image || ''} required type="text" placeholder="http://..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-primary">Fulfillment Type</label>
                                <select name="fulfillmentType" defaultValue={editingItem.products?.fulfillmentType || 'Direct Shopping'} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
                                    <option value="Direct Shopping">Direct Shopping (Pickup)</option>
                                    <option value="Delivery Partner">Delivery Partner (Home Delivery)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-primary">Delivery Charge (₹)</label>
                                <input name="deliveryCharge" defaultValue={editingItem.products?.deliveryCharge || 0} type="number" placeholder="99" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-primary">Serviceable Pincodes (CSV)</label>
                                <input name="serviceableArea" defaultValue={editingItem.products?.serviceableArea?.join(', ') || ''} type="text" placeholder="641604, 641603" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-primary">Pickup Instructions</label>
                                <textarea name="pickupInstructions" defaultValue={editingItem.products?.pickupInstructions || ''} rows="2" placeholder="Wait for 'Ready' notification. Bring order ID." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm"></textarea>
                            </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30">
                            <h4 className="md:col-span-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
                                <Image size={14} /> 360° Visual Assets (Optional)
                            </h4>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Front View URL</label>
                                <input name="viewImages_front" defaultValue={editingItem.products?.viewImages?.front || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Back View URL</label>
                                <input name="viewImages_back" defaultValue={editingItem.products?.viewImages?.back || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Top View URL</label>
                                <input name="viewImages_top" defaultValue={editingItem.products?.viewImages?.top || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Bottom View URL</label>
                                <input name="viewImages_bottom" defaultValue={editingItem.products?.viewImages?.bottom || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-bold mb-2 uppercase">Product Description</label>
                             <textarea name="description" defaultValue={editingItem.products?.description || ''} required rows="3" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm"></textarea>
                        </div>
                        <div className="md:col-span-2">
                             <SlotManager slots={managedSlots} setSlots={setManagedSlots} />
                        </div>
                        <button type="submit" className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">
                            {editingItem.products ? 'Save Product Changes' : 'Publish Product Listing'}
                        </button>
                    </form>
                </div>

{/* PRODUCT INVENTORY LIST */}
                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black italic">Live <span className="text-primary italic">Inventory</span></h3>
                        <div className="px-5 py-2 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                            Total Assets: {data.products.filter(p => !p.isService).length}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.products.filter(p => !p.isService).map(product => (
                            <div key={product._id} className="group p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shrink-0">
                                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                                    </div>
                                    <div className="truncate">
                                        <h4 className="font-black text-sm group-hover:text-primary transition-colors truncate uppercase tracking-tighter">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 text-[8px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                                            <span className="text-xs font-black text-primary">₹{product.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button 
                                        onClick={() => {
                                            setEditingItem(prev => ({...prev, products: product}));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }} 
                                        className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete('products', product._id)} 
                                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'services' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tighter">{editingItem.products ? 'Edit Service Specification' : 'Onboard New Service Offering'}</h3>
                        {editingItem.products && (
                            <button onClick={() => cancelEdit('products')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.products ? editingItem.products._id : 'new-service'} onSubmit={(e) => handleSubmit(e, 'products')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Service Name</label>
                            <input name="name" defaultValue={editingItem.products?.name || ''} required type="text" placeholder="Deep Cleaning" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <select name="category" defaultValue={editingItem.products?.category || ''} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="Inspection">Inspection Services</option>
                                <option value="Cleaning">Cleaning & Hygiene</option>
                                <option value="Maintenance">Maintenance & Repair</option>
                                <option value="IT Services">IT & Consulting</option>
                                <option value="Healthcare">Healthcare & Wellness</option>
                                <option value="Construction">Construction & Renovation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-blue-600">Home Service Category (CMS)</label>
                            <select name="categoryRef" defaultValue={editingItem.products?.categoryRef?._id || editingItem.products?.categoryRef || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="">Legacy / Unmapped</option>
                                {data.homeCategories?.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-blue-400">Home Service Sub-Category (CMS)</label>
                            <select name="subCategoryRef" defaultValue={editingItem.products?.subCategoryRef?._id || editingItem.products?.subCategoryRef || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="">None / Unmapped</option>
                                {data.homeSubCategories?.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name} ({sub.categoryId?.name})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-primary">Hover Video Preview (Cloudinary/YouTube)</label>
                            <input name="hoverVideo" defaultValue={editingItem.products?.hoverVideo || ''} type="text" placeholder="https://..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-orange-500">Service Badge Label</label>
                            <input name="badgeLabel" defaultValue={editingItem.products?.badgeLabel || ''} type="text" placeholder="Most Booked" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-orange-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-primary">Service Type (Logic)</label>
                            <select name="serviceType" defaultValue={editingItem.products?.serviceType || 'None'} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="None">None</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Painting">Painting</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Tiling">Tiling</option>
                                <option value="Inspection">Inspection</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase text-purple-600">Assigned Vendor / Expert</label>
                            <select name="vendorId" defaultValue={editingItem.products?.vendorId?._id || editingItem.products?.vendorId || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                <option value="">Internal Staff (Admin)</option>
                                {data.users.filter(u => u.role === 'Vendor').map(v => (
                                    <option key={v._id} value={v._id}>{v.businessName || `${v.firstName} ${v.lastName}`}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Base Price (INR)</label>
                            <input name="price" defaultValue={editingItem.products?.price || ''} required type="number" placeholder="1999" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Shop Name</label>
                            <input name="shopName" defaultValue={editingItem.products?.shopName || ''} required type="text" placeholder="Forge India Official" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100 dark:border-purple-800/30">
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Fulfillment Strategy</label>
                                <select name="fulfillmentType" defaultValue={editingItem.products?.fulfillmentType || 'Direct Shopping'} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
                                    <option value="Direct Shopping">Direct Shopping (Pickup)</option>
                                    <option value="Delivery Partner">Delivery Partner (Home Delivery)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Base Warranty / Service Guarantee</label>
                                <input name="warranty" defaultValue={editingItem.products?.warranty || ''} type="text" placeholder="30 Days Warranty" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Estimated Duration</label>
                                <input name="duration" defaultValue={editingItem.products?.duration || ''} type="text" placeholder="2-3 Hours" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Estimated Delivery / Fulfillment</label>
                                <input name="estimatedDeliveryTime" defaultValue={editingItem.products?.estimatedDeliveryTime || ''} type="text" placeholder="3-5 Business Days" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Service Highlights (CSV)</label>
                                <input name="highlights" defaultValue={editingItem.products?.highlights?.join(', ') || ''} type="text" placeholder="Eco-friendly, Trained Pros" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">What's Included (CSV)</label>
                                    <textarea name="whatsIncluded" defaultValue={editingItem.products?.whatsIncluded?.join(', ') || ''} rows="2" placeholder="Labor, Materials, Basic Cleanup" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm"></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black mb-3 uppercase tracking-widest text-purple-600">Pickup / Site Instructions</label>
                                    <textarea name="pickupInstructions" defaultValue={editingItem.products?.pickupInstructions || ''} rows="2" placeholder="Clear the area before arrival. Ensure water/power supply." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4 p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100 dark:border-purple-800/30">
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Sparkles size={14} /> Property-Based Configuration</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-[9px] font-black mb-1 uppercase tracking-widest text-gray-400 ml-1">Property Type</label>
                                    <select name="propertyType" defaultValue={editingItem.products?.propertyType || 'None'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs font-bold">
                                        <option value="None">None</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Individual House">Individual House</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black mb-1 uppercase tracking-widest text-gray-400 ml-1">Furnishing</label>
                                    <select name="furnishingStatus" defaultValue={editingItem.products?.furnishingStatus || 'None'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs font-bold">
                                        <option value="None">None</option>
                                        <option value="Furnished">Furnished</option>
                                        <option value="Unfurnished">Unfurnished</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black mb-1 uppercase tracking-widest text-gray-400 ml-1">BHK Type</label>
                                    <input name="bhkType" defaultValue={editingItem.products?.bhkType || ''} placeholder="e.g. 2BHK" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black mb-1 uppercase tracking-widest text-gray-400 ml-1">Area (Sqft)</label>
                                    <input name="sqft" type="number" defaultValue={editingItem.products?.sqft || 0} placeholder="e.g. 1200" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">Pricing Rules (JSON)</label>
                             <textarea name="pricingRules" defaultValue={editingItem.products?.pricingRules ? JSON.stringify(editingItem.products.pricingRules, null, 2) : '{}'} rows="4" className="w-full px-6 py-4 rounded-2xl border border-purple-100/50 bg-white dark:bg-dark-bg outline-none font-mono text-xs" placeholder="{}"></textarea>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100 dark:border-purple-800/30">
                            <h4 className="md:col-span-4 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 mb-2 flex items-center gap-2">
                                <Image size={14} /> 360° Visual Assets (Optional)
                            </h4>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Front View URL</label>
                                <input name="viewImages_front" defaultValue={editingItem.products?.viewImages?.front || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Back View URL</label>
                                <input name="viewImages_back" defaultValue={editingItem.products?.viewImages?.back || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Top View URL</label>
                                <input name="viewImages_top" defaultValue={editingItem.products?.viewImages?.top || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">Bottom View URL</label>
                                <input name="viewImages_bottom" defaultValue={editingItem.products?.viewImages?.bottom || ''} type="text" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none text-xs" />
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-green-50 dark:bg-green-900/10 rounded-[2rem] border border-green-100 dark:border-green-800/30">
                            <h4 className="md:col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2 flex items-center gap-2">
                                <Users size={14} /> Service Logistics & Safety
                            </h4>
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase text-gray-500">Team Size</label>
                                <input name="teamSize" type="number" defaultValue={editingItem.products?.teamSize || 1} placeholder="1" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase text-gray-500">Equipment Provided</label>
                                <select name="equipmentProvided" defaultValue={editingItem.products?.equipmentProvided ? 'true' : 'false'} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase text-gray-500">Safety Measures (CSV)</label>
                                <input name="safetyMeasures" defaultValue={editingItem.products?.safetyMeasures?.join(', ')} placeholder="Masks, Sanitized tools" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-bold mb-2 uppercase text-gray-500">Specific Service Terms</label>
                                <textarea name="serviceTerms" defaultValue={editingItem.products?.serviceTerms} rows="3" placeholder="Customer must be present during service..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold resize-none"></textarea>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <SubServiceManager value={managedServiceConfig} onChange={setManagedServiceConfig} />
                        </div>
                        <div className="md:col-span-2">
                             <SlotManager slots={managedSlots} setSlots={setManagedSlots} />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-bold mb-2 uppercase">Service Scope & Description</label>
                             <textarea name="description" defaultValue={editingItem.products?.description || ''} required rows="3" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Explain what is included in this service..."></textarea>
                        </div>
                        <button type="submit" className="md:col-span-2 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all uppercase tracking-widest text-xs">
                            {editingItem.products ? 'Update Service Parameters' : 'Authorize FIC Service Offering'}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
                    <h3 className="text-2xl font-black mb-8 text-purple-600 uppercase tracking-tighter italic">Live Service Portfolio</h3>
                    <div className="space-y-4">
                        {data.products.filter(p => p.isService).map(service => (
                            <div key={service._id} className="flex items-center justify-between p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group border-l-4 border-l-purple-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                         <Wrench size={32} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg group-hover:text-purple-600 transition-colors uppercase tracking-tight">{service.name}</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{service.category} • Avg ₹{service.price}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        setEditingItem(prev => ({...prev, products: service}));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} className="p-3 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete('products', service._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'home-cms' && (
            <div className="space-y-12">
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tighter italic">Pro Tip: Strategic Service Management</h4>
                            <p className="text-[11px] text-gray-500 font-medium">Use the <strong className="text-primary font-black uppercase">Services</strong> tab in the sidebar to add actual service offerings (Plumbing, Cleaning, etc.) with pricing and slots. Use this CMS tab to manage categories and page layout.</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('services')} className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">Go to Services Catalog</button>
                </div>
                <HomeServiceCMS data={data} onUpdate={() => fetchData()} />
            </div>
        )}

        {activeTab === 'faqs' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black">{editingItem.faqs ? 'Edit FAQ Entry' : 'Create New FAQ'}</h3>
                        {editingItem.faqs && (
                            <button onClick={() => cancelEdit('faqs')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.faqs ? editingItem.faqs._id : 'new'} onSubmit={(e) => handleSubmit(e, 'faqs')} className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Question</label>
                            <input name="question" defaultValue={editingItem.faqs?.question || ''} required type="text" placeholder="e.g., What services does Forge India Connect provide?" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Answer</label>
                            <textarea name="answer" defaultValue={editingItem.faqs?.answer || ''} required rows="5" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none leading-relaxed" placeholder="Detailed answer..."></textarea>
                        </div>
                        <button type="submit" className="py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">
                            {editingItem.faqs ? 'Save FAQ Modifications' : 'Publish FAQ'}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
                    <h3 className="text-2xl font-black mb-8">Current FAQs</h3>
                    <div className="space-y-4">
                        {data.faqs.map(faq => (
                            <div key={faq._id} className="p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-lg group-hover:text-primary transition-colors flex-1 pr-4 leading-tight">{faq.question}</h4>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => {
                                            setEditingItem(prev => ({...prev, faqs: faq}));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete('faqs', faq._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                            <AlertCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'candidates' && (
            <div className="space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black">{editingItem.candidates ? 'Edit Success Story' : 'Add Success Story'}</h3>
                        {editingItem.candidates && (
                            <button onClick={() => cancelEdit('candidates')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form key={editingItem.candidates ? editingItem.candidates._id : 'new'} onSubmit={(e) => handleSubmit(e, 'candidates')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Candidate Name</label>
                            <input name="name" defaultValue={editingItem.candidates?.name || ''} required type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Domain</label>
                            <select name="domain" defaultValue={editingItem.candidates?.domain || 'IT'} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none appearance-none cursor-pointer font-bold">
                                <option value="IT">IT</option>
                                <option value="Banking">Banking</option>
                                <option value="Non-IT">Non-IT</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Automobile">Automobile</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Image URL</label>
                            <input name="image" defaultValue={editingItem.candidates?.image || ''} required type="text" placeholder="https://..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Video URL (Optional)</label>
                            <input name="videoUrl" defaultValue={editingItem.candidates?.videoUrl || ''} type="text" placeholder="https://youtube.com/..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Success Story Testimonial</label>
                            <textarea name="text" defaultValue={editingItem.candidates?.text || ''} required rows="4" placeholder="Share the career journey..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold"></textarea>
                        </div>
                        <button type="submit" className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
                            {editingItem.candidates ? 'Update Success Story' : 'Post Candidate Success Story'}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
                    <h3 className="text-2xl font-black mb-8">Success Stories Registry</h3>
                    <div className="space-y-4">
                        {data.candidates?.map(candidate => (
                            <div key={candidate._id} className="p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group flex items-start gap-4">
                                <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-lg group-hover:text-primary transition-colors truncate">{candidate.name}</h4>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{candidate.domain}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => {
                                        setEditingItem(prev => ({...prev, candidates: candidate}));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete('candidates', candidate._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                        <AlertCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="space-y-6 md:space-y-12">
                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h3 className="text-3xl font-black mb-1">Users & Partners</h3>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Registered: {data.users.length}</p>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Manual Onboarding */}
                    <div className="mb-8 md:mb-12 p-4 md:p-8 bg-primary/5 dark:bg-primary/10 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-primary/20">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                            <UserPlus size={18} /> Manual Partner Onboarding
                        </h4>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const payload = Object.fromEntries(new FormData(e.target));
                            try {
                                await api.post('/auth/onboard', payload);
                                toast.success('Account Created Successfully!');
                                const { data: usersRes } = await api.get('/users');
                                setData(prev => ({ ...prev, users: Array.isArray(usersRes) ? usersRes : (usersRes.data || []) }));
                                e.target.reset();
                            } catch (err) { toast.error(err.response?.data?.message || 'Onboarding failed'); }
                        }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input name="firstName" required placeholder="First Name" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                            <input name="lastName" required placeholder="Last Name" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                            <input name="email" required type="email" placeholder="Email" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                            <input name="password" required type="password" placeholder="Temp Password" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                            <select name="role" required className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-black uppercase text-[10px] tracking-widest">
                                <option value="Vendor">Vendor / Seller</option>
                                <option value="HR">HR Partner</option>
                                <option value="Delivery Partner">Logistics Support</option>
                                <option value="Sub-Admin">Regional Admin</option>
                                <option value="Admin">Master Admin</option>
                            </select>
                            <select name="vendorType" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-black uppercase text-[10px] tracking-widest">
                                <option value="Product Seller">Product Seller (Retail)</option>
                                <option value="Service Provider">Service Provider (Home)</option>
                                <option value="Both">Omni-Channel (Both)</option>
                            </select>
                            <input name="mobile" placeholder="Mobile" className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
                            <button type="submit" className="sm:col-span-1 py-3.5 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Onboard Partner</button>
                        </form>
                    </div>

                    <div className="mobile-table-scroll">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    {['User Identity', 'Contact', 'Role', 'Status', 'Manage'].map(h => (
                                        <th key={h} className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {/* PENDING REQUESTS FIRST */}
                                {data.users.filter(u => u.approvalStatus === 'Pending').map(user => (
                                    <tr key={user._id} className="bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 animate-pulse">
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 font-black uppercase">
                                                    {user.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                                    <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Awaiting Approval</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-sm font-bold text-gray-500">{user.email}</td>
                                        <td className="py-6 px-4">
                                            <span className="px-3 py-1 bg-white dark:bg-dark-card border border-yellow-200 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="flex items-center gap-2 text-yellow-600 font-black text-[10px] uppercase tracking-widest">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div> Pending
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={async () => {
                                                        await api.put(`/users/${user._id}/approve`, { status: 'Approved' });
                                                        toast.success('Approved!');
                                                        const { data: usersRes } = await api.get('/users');
                                                        setData(prev => ({ ...prev, users: usersRes.data || usersRes }));
                                                    }}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 shadow-md shadow-green-500/10 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={async () => {
                                                        await api.put(`/users/${user._id}/approve`, { status: 'Rejected' });
                                                        toast.success('Rejected');
                                                        const { data: usersRes } = await api.get('/users');
                                                        setData(prev => ({ ...prev, users: usersRes.data || usersRes }));
                                                    }}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-md shadow-red-500/10 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* REST OF THE USERS */}
                                {data.users.filter(u => u.approvalStatus !== 'Pending').filter(u => 
                                    `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                                    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                                ).map(user => (
                                    <tr key={user._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary font-black uppercase text-xs">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{user.firstName} {user.lastName}</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-secondary text-dark-bg' : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-500 dark:text-gray-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.approvalStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.approvalStatus === 'Approved' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                {user.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex gap-2">
                                                {user.role !== 'Customer' && user.role !== 'Admin' && (
                                                    <button onClick={() => setSelectedUserKYC(user)} className="px-3 py-1.5 bg-gray-100 dark:bg-dark-card rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">KYC</button>
                                                )}
                                                <button onClick={() => handleDelete('users', user._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                    <AlertCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* SERVICE AREAS TAB - Consolidate to bottom block */}

        {/* MEDIA MANAGER TAB */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <h3 className="text-2xl font-black mb-3 flex items-center gap-3"><Upload className="text-primary" /> Central Asset Library</h3>
              <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed">Upload marketing assets, product images, or banners to FIC's secure asset server.</p>
              
              <div className="relative group cursor-pointer bg-primary/5 dark:bg-white/5 rounded-[2.5rem] border-4 border-dashed border-primary/20 hover:border-primary/50 transition-all overflow-hidden h-64 flex flex-col items-center justify-center">
                <input type="file" onChange={handleFileUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {uploadStatus.loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                        <span className="font-black uppercase text-[10px] tracking-widest text-primary animate-pulse">Uploading to FIC Server...</span>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                            <Upload size={32} className="text-primary" />
                        </div>
                        <p className="font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest text-xs mb-2">Drag & Drop or Click</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Max 10MB • JPG, PNG, WEBP</p>
                    </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><LinkIcon className="text-secondary" /> Asset MetaData</h3>
              {uploadStatus.url ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div className="aspect-video w-full rounded-[2rem] overflow-hidden border-2 border-primary/10 bg-gray-50 p-2">
                     <img src={uploadStatus.url} alt="Uploaded" className="w-full h-full object-cover rounded-xl shadow-inner" />
                   </div>
                   <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                     <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-3">Permanent Asset Hash URL</label>
                     <div className="flex gap-2">
                        <input type="text" readOnly value={uploadStatus.url} className="flex-1 bg-transparent outline-none font-mono text-xs font-bold text-gray-600 truncate" />
                        <button onClick={() => { navigator.clipboard.writeText(uploadStatus.url); toast.success('URL Copied!'); }} className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline">Copy</button>
                     </div>
                   </div>
                   <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600 leading-relaxed">Asset whitelisted and ready for production use across all FIC portals.</p>
                   </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] border-4 border-dashed border-gray-50 dark:border-gray-800/50 rounded-[2.5rem]">
                  <Image size={48} className="opacity-10 mb-6" />
                  Asset Preview Waiting
                </div>
              )}
            </div>
          </div>
        )}

        {/* VENDOR MANAGEMENT TAB */}
        {activeTab === 'vendors' && (() => {
          const vendors = data.users.filter(u => u.role === 'Vendor');
          const productSellers = vendors.filter(v => v.vendorType === 'Product Seller' || v.vendorType === 'Both');
          const serviceProviders = vendors.filter(v => v.vendorType === 'Service Provider' || v.vendorType === 'Both');
          const list = vendorFilter === 'all' ? vendors : vendors.filter(v => v.vendorType === vendorFilter || v.vendorType === 'Both');
          return (
            <div className="space-y-6 md:space-y-8">
              <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black mb-1 text-gray-900 dark:text-white">Vendor Registry</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">{vendors.length} total vendors · {productSellers.length} sellers · {serviceProviders.length} service providers</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'Product Seller', 'Service Provider'].map(f => (
                      <button key={f} onClick={() => setVendorFilter(f)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${vendorFilter === f ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-white dark:hover:bg-dark-bg'}`}>
                        {f === 'all' ? 'All Vendors' : f === 'Product Seller' ? 'Sellers' : 'Services'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {list.map(vendor => {
                    const vendorProducts = data.products.filter(p => p.vendorId === vendor._id || p.vendorId?.toString() === vendor._id?.toString());
                    const productCount = vendorProducts.filter(p => !p.isService).length;
                    const serviceCount = vendorProducts.filter(p => p.isService).length;
                    return (
                      <div key={vendor._id} className="p-6 bg-white dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase text-xl">
                            {vendor.firstName?.[0]}{vendor.lastName?.[0]}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-black text-gray-900 dark:text-white truncate">{vendor.firstName} {vendor.lastName}</p>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">{vendor.email}</p>
                            <span className={`mt-1 inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              vendor.vendorType === 'Product Seller' ? 'bg-blue-100 text-blue-600' :
                              vendor.vendorType === 'Service Provider' ? 'bg-purple-100 text-purple-600' :
                              'bg-green-100 text-green-600'
                            }`}>{vendor.vendorType}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-xl text-center border border-gray-100 dark:border-gray-800">
                            <p className="text-xl font-black text-primary">{productCount}</p>
                            <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mt-1">Products</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-xl text-center border border-gray-100 dark:border-gray-800">
                            <p className="text-xl font-black text-purple-500">{serviceCount}</p>
                            <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mt-1">Services</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-xl text-center border border-gray-100 dark:border-gray-800">
                            <p className={`text-[9px] font-black uppercase tracking-widest leading-none ${ vendor.approvalStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>{vendor.approvalStatus}</p>
                            <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mt-1">Status</p>
                          </div>
                        </div>

                        {vendorProducts.length > 0 && (
                          <div className="space-y-2 mb-6">
                            <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Recent Inventory</p>
                            {vendorProducts.slice(0, 2).map(p => (
                              <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />
                                  <span className="text-xs font-bold truncate">{p.name}</span>
                                </div>
                                <button onClick={() => handleDelete('products', p._id)} className="p-1.5 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button 
                          onClick={() => setSelectedVendorForAsset(vendor)}
                          className="w-full py-3.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Integrate Asset
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ASSET CREATION MODAL */}
              <AnimatePresence>
                {selectedVendorForAsset && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-dark-bg/90 backdrop-blur-xl p-6"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                      className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-[3rem] border border-gray-100 dark:border-gray-800 p-12 shadow-3xl relative overflow-y-auto max-h-[90vh] custom-scrollbar"
                    >
                      <button onClick={() => setSelectedVendorForAsset(null)} className="absolute top-10 right-10 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={32} />
                      </button>
                      
                      <h3 className="text-3xl font-black mb-2 text-gray-900 dark:text-white italic">INTEGRATE <span className="text-primary">ASSET</span></h3>
                      <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 italic opacity-60">TARGET VENDOR: {selectedVendorForAsset.firstName} {selectedVendorForAsset.lastName}</p>
                      
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const formDataObj = Object.fromEntries(formData.entries());
                        formDataObj.vendorId = selectedVendorForAsset._id;
                        formDataObj.isService = formDataObj.isService === 'on';
                        formDataObj.price = Number(formDataObj.price);
                        formDataObj.countInStock = Number(formDataObj.countInStock || 50);
                        
                        // Handle 360 View Images
                        formDataObj.viewImages = {
                            front: formDataObj.viewImages_front,
                            back: formDataObj.viewImages_back,
                            top: formDataObj.viewImages_top,
                            bottom: formDataObj.viewImages_bottom
                        };
                        
                        try {
                          const { data: newItem } = await api.post('/products', formDataObj);
                          setData(prev => ({ ...prev, products: [...prev.products, newItem] }));
                          toast.success('Asset published successfully!');
                          setSelectedVendorForAsset(null);
                        } catch (err) { toast.error('Publication failed'); }
                      }} className="grid grid-cols-1 md:grid-cols-2 gap-10 italic">
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Asset Designation</label>
                          <input name="name" required className="w-full px-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white placeholder:text-gray-300" placeholder="e.g. Industrial Compute Node" />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Domain Category</label>
                          <select name="category" required className="w-full px-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white">
                              <option value="">Select Domain</option>
                              {data.homeCategories?.map(cat => (
                                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Pricing Strategy (INR)</label>
                          <input name="price" type="number" required className="w-full px-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white placeholder:text-gray-300" placeholder="0.00" />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Global Stock Quantity</label>
                          <input name="countInStock" type="number" defaultValue={50} required className="w-full px-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white" placeholder="50" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Media Asset Reference (Primary)</label>
                          <div className="flex gap-2">
                             <input name="image" required className="flex-1 px-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white placeholder:text-gray-300" placeholder="https://..." />
                             <button type="button" onClick={() => { setActiveTab('media'); setSelectedVendorForAsset(null); }} className="px-6 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all border border-primary/20"><Image size={24} /></button>
                          </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 font-sans not-italic">
                          <h4 className="md:col-span-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">360° Visual Assets (Optional)</h4>
                          <input name="viewImages_front" placeholder="Front URL" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg text-xs" />
                          <input name="viewImages_back" placeholder="Back URL" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg text-xs" />
                          <input name="viewImages_top" placeholder="Top URL" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg text-xs" />
                          <input name="viewImages_bottom" placeholder="Bottom URL" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg text-xs" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-6 py-6 px-8 bg-primary/5 dark:bg-white/5 rounded-[2rem] border border-primary/10">
                          <input name="isService" type="checkbox" className="w-8 h-8 rounded-xl accent-primary cursor-pointer" />
                          <div>
                            <p className="font-black text-sm uppercase tracking-widest text-primary leading-none mb-1">Service Protocol</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic opacity-60">Authorize this asset as an on-demand service entity.</p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-widest">Operational Brief</label>
                          <textarea name="description" required rows="4" className="w-full px-8 py-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-black text-gray-800 dark:text-white placeholder:text-gray-300 resize-none" placeholder="Provide full technical documentation..."></textarea>
                        </div>
                        <button type="submit" className="md:col-span-2 py-7 bg-primary text-white font-black rounded-[2rem] hover:bg-blue-600 shadow-3xl shadow-primary/30 uppercase tracking-[0.4em] text-sm transition-all active:scale-[0.98]">
                          Authorize Global Publication
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}

        {/* CUSTOMER REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black mb-1">Customer Reviews</h3>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{reviews.length} total reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="p-6 bg-white dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800 group hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase shrink-0">
                          {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black text-gray-900 dark:text-white">{review.name}</p>
                            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'fill-secondary text-secondary' : 'text-gray-300'} />)}</div>
                          </div>
                          {editingReview?._id === review._id ? (
                            <div className="space-y-3">
                              <textarea
                                defaultValue={review.comment}
                                onChange={e => setEditingReview({...editingReview, comment: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card outline-none font-medium text-sm resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button onClick={async () => {
                                  await api.put(`/reviews/${editingReview._id}/admin`, { comment: editingReview.comment });
                                  setReviews(prev => prev.map(r => r._id === editingReview._id ? { ...r, comment: editingReview.comment } : r));
                                  setEditingReview(null);
                                  toast.success('Review updated');
                                }} className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Save</button>
                                <button onClick={() => setEditingReview(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 font-medium">{review.comment}</p>
                          )}
                          {review.product && (
                            <p className="mt-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Product: {review.product.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setEditingReview(editingReview?._id === review._id ? null : review)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"><Edit size={18} /></button>
                        <button onClick={async () => {
                          if (!window.confirm('Delete this review?')) return;
                          await api.delete(`/reviews/${review._id}/admin`);
                          setReviews(prev => prev.filter(r => r._id !== review._id));
                          toast.success('Review deleted');
                        }} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><AlertCircle size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">No reviews yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="mb-8">
                <h3 className="text-3xl font-black mb-1">All Customer Orders</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{orders.length} total orders</p>
              </div>
              <div className="mobile-table-scroll">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Paid', 'Delivered', 'Partner', 'Date', 'Action'].map(h => (
                        <th key={h} className="pb-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {orders.map(order => (
                      <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                        <td className="py-5 pr-4">
                          <p className="font-mono text-xs font-bold text-gray-500">#{order._id?.slice(-8).toUpperCase()}</p>
                        </td>
                        <td className="py-5 pr-4">
                          <p className="font-bold text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{order.user?.email}</p>
                        </td>
                        <td className="py-5 pr-4">
                          <p className="font-bold text-sm">{order.orderItems?.length} item(s)</p>
                        </td>
                        <td className="py-5 pr-4">
                          <p className="font-black text-primary">₹{order.totalPrice?.toLocaleString()}</p>
                        </td>
                        <td className="py-5 pr-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ order.isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-5 pr-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.isDelivered ? 'Delivered' : 'In Transit'}
                          </span>
                        </td>
                        <td className="py-5 pr-4">
                           <select 
                              value={order.deliveryPartner?._id || order.deliveryPartner || ''}
                              onChange={(e) => handleAssignPartner(order._id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg cursor-pointer shadow-sm text-primary"
                           >
                              <option value="">Select Partner</option>
                              {deliveryPartners.map(p => (
                                <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                              ))}
                           </select>
                        </td>
                        <td className="py-5 pr-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-5">
                          {!order.isDelivered && (
                            <button onClick={async () => {
                              await api.put(`/orders/${order._id}/deliver`, {});
                              setOrders(prev => prev.map(o => o._id === order._id ? { ...o, isDelivered: true } : o));
                              toast.success('Order marked as delivered');
                            }} className="px-3 py-1.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={8} className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="mb-8">
                <h3 className="text-3xl font-black mb-1">Global Job Applications</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{data.applications?.length || 0} total applications</p>
              </div>
              <div className="mobile-table-scroll">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {['Candidate', 'Role', 'Status', 'Date', 'Dossier'].map(h => (
                        <th key={h} className="pb-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {data.applications?.map(app => (
                      <tr key={app._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                        <td className="py-5 pr-4">
                          <p className="font-bold text-sm">{app.fullName}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{app.email}</p>
                        </td>
                        <td className="py-5 pr-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">{app.jobRole}</span>
                        </td>
                        <td className="py-5 pr-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Hired' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-5 pr-4 text-xs font-bold text-gray-500 dark:text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="py-5">
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all inline-block">
                              <FileText size={18} />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="mb-8">
                <h3 className="text-3xl font-black mb-1 text-primary">Support Ticket Queue</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{data.tickets?.length || 0} active tickets from vendors & customers</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {data.tickets?.map(ticket => (
                  <div key={ticket._id} className={`p-8 bg-white dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all shadow-sm ${ticket.priority === 'High' ? 'border-l-8 border-l-red-500' : ticket.priority === 'Medium' ? 'border-l-8 border-l-orange-500' : 'border-l-8 border-l-blue-500'}`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${ticket.status === 'Open' ? 'bg-green-100 text-green-600' : ticket.status === 'Resolved' ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-gray-100 text-gray-700`}>
                            {ticket.category}
                          </span>
                        </div>
                        <h4 className="text-xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tighter">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium italic">"{ticket.description}"</p>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px] font-black uppercase">
                              {ticket.user?.firstName?.[0]}
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase">{ticket.user?.firstName} {ticket.user?.lastName}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-3 shrink-0">
                        {ticket.status !== 'Resolved' && (
                          <button 
                            onClick={async () => {
                              try {
                                await api.put(`/tickets/${ticket._id}`, { status: 'Resolved' });
                                toast.success('Ticket marked as resolved');
                                const { data: tixRes } = await api.get('/tickets');
                                setData(prev => ({ ...prev, tickets: tixRes.data || tixRes }));
                              } catch { toast.error('Failed to update ticket'); }
                            }}
                            className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                          >
                            Resolve
                          </button>
                        )}
                        <button 
                           onClick={async () => {
                             try {
                               await api.put(`/tickets/${ticket._id}`, { status: 'In Progress' });
                               toast.success('Status updated');
                               const { data: tixRes } = await api.get('/tickets');
                               setData(prev => ({ ...prev, tickets: tixRes.data || tixRes }));
                             } catch { toast.error('Failed to update status'); }
                           }}
                           className="flex-1 md:flex-none px-6 py-3 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                          Mark In Progress
                        </button>
                        <button 
                           onClick={async () => {
                             if(!window.confirm('Purge this ticket documentation?')) return;
                             try {
                               await api.delete(`/tickets/${ticket._id}`);
                               toast.success('Ticket purged');
                               setData(prev => ({ ...prev, tickets: prev.tickets.filter(t => t._id !== ticket._id) }));
                             } catch { toast.error('Failed to delete'); }
                           }}
                           className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data.tickets || data.tickets.length === 0) && (
                  <div className="py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem]">
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-black text-gray-400 uppercase tracking-widest text-sm">No support tickets found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SERVICE INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
               <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-black mb-1 italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Service Inquiries</h3>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{data.inquiries?.length || 0} trackable service requests</p>
                  </div>
               </div>

               <div className="mobile-table-scroll">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-gray-100 dark:border-gray-800">
                          {['Client', 'Type', 'Requirement', 'Message', 'Contact', 'Status', 'Actions'].map(h => (
                             <th key={h} className="pb-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 pr-4">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                       {data.inquiries?.map(inquiry => (
                          <tr key={inquiry._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                             <td className="py-5 pr-4">
                               <p className="font-bold text-sm">{inquiry.user?.firstName} {inquiry.user?.lastName}</p>
                               <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{inquiry.user?.email}</p>
                             </td>
                             <td className="py-5 pr-4">
                               <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{inquiry.serviceType}</span>
                             </td>
                             <td className="py-5 pr-4">
                               <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{inquiry.specificRequirement}</p>
                             </td>
                             <td className="py-5 pr-4 max-w-xs">
                               <p className="text-xs text-gray-500 line-clamp-2">{inquiry.message}</p>
                             </td>
                             <td className="py-5 pr-4">
                               <p className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">{inquiry.contactNumber}</p>
                             </td>
                             <td className="py-5 pr-4">
                                <select 
                                   value={inquiry.status}
                                   onChange={async (e) => {
                                      try {
                                         await api.put(`/inquiries/${inquiry._id}/status`, { status: e.target.value });
                                         setData(prev => ({
                                            ...prev,
                                            inquiries: prev.inquiries.map(i => i._id === inquiry._id ? { ...i, status: e.target.value } : i)
                                         }));
                                         toast.success('Status updated');
                                      } catch { toast.error('Failed to update status'); }
                                   }}
                                   className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg
                                      ${inquiry.status === 'Pending' ? 'text-orange-500' : inquiry.status === 'In Progress' ? 'text-blue-500' : inquiry.status === 'Resolved' ? 'text-green-500' : 'text-red-500'}`}
                                >
                                   <option value="Pending">Pending</option>
                                   <option value="In Progress">In Progress</option>
                                   <option value="Resolved">Resolved</option>
                                   <option value="Cancelled">Cancelled</option>
                                </select>
                             </td>
                             <td className="py-5">
                                <button 
                                   onClick={async () => {
                                      if (!window.confirm('Remove inquiry?')) return;
                                      try {
                                         await api.delete(`/inquiries/${inquiry._id}`);
                                         setData(prev => ({ ...prev, inquiries: prev.inquiries.filter(i => i._id !== inquiry._id) }));
                                         toast.success('Inquiry removed');
                                      } catch { toast.error('Removal failed'); }
                                   }}
                                   className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                >
                                   <Trash2 size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-12">
            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editingItem.locations ? 'Edit Service Area' : 'Register New Service Area'}</h3>
                {editingItem.locations && (
                  <button onClick={() => cancelEdit('locations')} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
                    Cancel Edit
                  </button>
                )}
              </div>
              <form key={editingItem.locations ? editingItem.locations._id : 'new'} onSubmit={async (e) => {
                e.preventDefault();
                const payload = Object.fromEntries(new FormData(e.target));
                payload.isServiceable = payload.isServiceable === 'on';
                try {
                  if (editingItem.locations) {
                    const { data: updated } = await api.put(`/locations/${editingItem.locations._id}`, payload);
                    setLocations(prev => prev.map(l => l._id === updated._id ? updated : l));
                    toast.success('Location updated');
                  } else {
                    const { data: newItem } = await api.post('/locations', payload);
                    setLocations(prev => [...prev, newItem]);
                    toast.success('Location registered');
                  }
                  setEditingItem(prev => ({ ...prev, locations: null }));
                  e.target.reset();
                } catch (err) { toast.error('Operation failed'); }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">City / Region</label>
                  <input name="city" defaultValue={editingItem.locations?.city || ''} required type="text" placeholder="Chennai" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Pincode</label>
                  <input name="pincode" defaultValue={editingItem.locations?.pincode || ''} required type="text" placeholder="600001" className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
                </div>
                <div className="flex items-center gap-4 py-4 px-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                  <input name="isServiceable" type="checkbox" defaultChecked={editingItem.locations?.isServiceable ?? true} className="w-6 h-6 accent-primary" />
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white">Active Serviceability</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Enable or disable service for this area</p>
                  </div>
                </div>
                <button type="submit" className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all uppercase tracking-widest">
                  {editingItem.locations ? 'Authorize Update' : 'Initialize Service Hub'}
                </button>
              </form>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-y-auto max-h-[60vh]">
              <h3 className="text-2xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Active Service Registry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(loc => (
                  <div key={loc._id} className="p-6 bg-white dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl ${loc.isServiceable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {loc.isServiceable ? 'Live' : 'Inactive'}
                    </div>
                    <h4 className="font-black text-lg group-hover:text-primary transition-colors">{loc.city}</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">PIN: {loc.pincode}</p>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => { setEditingItem(prev => ({...prev, locations: loc})); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Edit</button>
                      <button onClick={async () => {
                        if (!window.confirm('Terminate this service area?')) return;
                        await api.delete(`/locations/${loc._id}`);
                        setLocations(prev => prev.filter(l => l._id !== loc._id));
                        toast.success('Location purged');
                      }} className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  </div>
                ))}
                {locations.length === 0 && <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 font-bold italic">No regional service hubs registered.</div>}
              </div>
            </div>
          </div>
        )}

        {/* KYC MODAL */}
        <AnimatePresence>
            {selectedUserKYC && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-dark-bg/90 backdrop-blur-xl p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                        className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-[3rem] border border-gray-100 dark:border-gray-800 p-12 shadow-3xl relative"
                    >
                        <button onClick={() => setSelectedUserKYC(null)} className="absolute top-10 right-10 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                            <AlertCircle size={32} />
                        </button>
                        
                        <h3 className="text-3xl font-black mb-2">KYC Review</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">{selectedUserKYC.role} Profile Verification</p>
                        
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                <label className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-1">Business Name</label>
                                <p className="font-black text-lg text-primary">{selectedUserKYC.businessName || selectedUserKYC.firstName + ' ' + selectedUserKYC.lastName}</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 col-span-2">
                                <label className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-1">Business Motive</label>
                                <p className="font-bold text-sm italic">"{selectedUserKYC.businessMotive || 'Excellence in Service Delivery'}"</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            <label className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">Verification Packets</label>
                            <div className="flex flex-wrap gap-4">
                                {selectedUserKYC.profileDocuments?.map((doc, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <a href={doc} target="_blank" rel="noopener noreferrer" className="px-8 py-5 bg-white dark:bg-dark-bg border-2 border-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3">
                                            <ShieldCheck size={18} /> Packet {i+1} Review
                                        </a>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center">Encrypted Hash</p>
                                    </div>
                                ))}
                                {(!selectedUserKYC.profileDocuments || selectedUserKYC.profileDocuments.length === 0) && (
                                    <div className="w-full p-8 bg-red-50 dark:bg-red-900/10 border border-dashed border-red-200 rounded-2xl text-center">
                                        <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
                                        <p className="text-red-600 dark:text-red-400 font-black uppercase text-[10px] tracking-widest">Identity Documents Missing</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 mb-10">
                            <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Administrative Action</label>
                            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">Verify that the business license and identity packets match the registered information before authorization.</p>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={async () => {
                                    await api.put(`/users/${selectedUserKYC._id}/approve`, { status: 'Approved' });
                                    toast.success('Partner Verified & Authorized');
                                    const { data: usersRes } = await api.get('/users');
                                    setData(prev => ({ ...prev, users: usersRes.data || usersRes }));
                                    setSelectedUserKYC(null);
                                }}
                                className="flex-1 py-5 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 shadow-xl shadow-green-500/20 uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
                            >
                                Validate & Approve
                            </button>
                            <button 
                                onClick={async () => {
                                    await api.put(`/users/${selectedUserKYC._id}/approve`, { status: 'Rejected' });
                                    toast.success('KYC Profile Flagged');
                                    const { data: usersRes } = await api.get('/users');
                                    setData(prev => ({ ...prev, users: usersRes.data || usersRes }));
                                    setSelectedUserKYC(null);
                                }}
                                className="px-10 py-5 bg-red-100 text-red-600 font-black rounded-2xl hover:bg-red-200 uppercase tracking-widest text-xs transition-all hover:bg-red-600 hover:text-white"
                            >
                                Reject
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        {/* TESTIMONIALS MANAGEMENT TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-12">
            <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Initialize Testimonial</h3>
              <form onSubmit={(e) => handleSubmit(e, 'testimonials')} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Client Name</label>
                  <input name="name" defaultValue={editingItem.testimonials?.name || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold" placeholder="e.g. Akash Sharma" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Designation / Role</label>
                  <input name="role" defaultValue={editingItem.testimonials?.role || ''} required className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold" placeholder="e.g. CEO, TechForge" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Client Feedback</label>
                  <textarea name="content" defaultValue={editingItem.testimonials?.content || ''} required rows="4" className="w-full px-8 py-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold resize-none" placeholder="Deeply satisfied with the service protocol..."></textarea>
                </div>
                <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <input name="featured" type="checkbox" defaultChecked={editingItem.testimonials?.featured || false} className="w-6 h-6 accent-primary" />
                  <div>
                    <label className="block font-black text-xs uppercase text-primary">Feature on Landing Page</label>
                    <p className="text-[10px] text-gray-500 font-bold">Showcase this feedback in the main website carousel.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-black uppercase text-gray-500">Rating (1-5)</label>
                    <input name="rating" type="number" min="1" max="5" defaultValue={editingItem.testimonials?.rating || 5} className="w-20 px-4 py-2 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 font-black text-center" />
                </div>
                <button type="submit" className="md:col-span-2 py-6 bg-primary text-white font-black rounded-3xl hover:bg-blue-600 shadow-xl shadow-primary/30 uppercase tracking-[0.3em] text-xs transition-all">
                  {editingItem.testimonials ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.testimonials?.map(t => (
                    <div key={t._id} className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
                        {t.featured && <div className="absolute top-0 right-0 px-4 py-1 bg-secondary text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Featured</div>}
                        <h4 className="font-black text-lg mb-1">{t.name}</h4>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-4 italic">{t.role}</p>
                        <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-3">"{t.comment}"</p>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < (t.rating || 5) ? 'fill-secondary text-secondary' : 'text-gray-300'} />)}</div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingItem(prev => ({...prev, testimonials: t})); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><Edit size={16} /></button>
                                <button onClick={() => handleDelete('testimonials', t._id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="glass-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-3xl">
                    <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter text-gray-900 dark:text-white">Platform Configuration</h3>
                    
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-8 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tight mb-2 text-gray-900 dark:text-white">Delivery Infrastructure</h4>
                                <p className="text-sm text-gray-500 font-bold max-w-md">Enable or disable platform-wide delivery logistics. If disabled, all orders will default to "In-Store Pickup".</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={data.configs?.find(c => c.key === 'deliveryEnabled')?.value === true}
                                    onChange={async (e) => {
                                        try {
                                            await api.put(`/configs/deliveryEnabled`, { value: e.target.checked, description: 'Master toggle for delivery services' });
                                            toast.success(`Delivery ${e.target.checked ? 'Enabled' : 'Disabled'} Successfully`);
                                            const { data: configRes } = await api.get('/configs');
                                            setData(prev => ({ ...prev, configs: configRes }));
                                        } catch (err) { toast.error('Failed to update config'); }
                                    }}
                                />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl flex items-start gap-4">
                            <AlertCircle className="text-blue-500 mt-1" size={24} />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Administrative Advisory</p>
                                <p className="text-xs font-bold text-blue-800 dark:text-blue-200 leading-relaxed">
                                    Strategic modifications to delivery infrastructure will affect real-time checkout flows and delivery partner assignments. Ensure all regional hubs are notified before major logic shifts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'location-requests' && (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Integration <span className="text-primary italic">Requests</span></h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">{locationRequests.length} total requests</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {locationRequests.map(req => (
                        <div key={req._id} className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 dark:text-white">{req.name}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{req.industry || 'General'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    req.status === 'Integrated' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                    req.status === 'Reviewed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                }`}>{req.status}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                                    <MapPin size={14} className="text-primary shrink-0" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{req.location}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                                    <Mail size={14} className="text-gray-400 shrink-0" />
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                                    <Phone size={14} className="text-gray-400 shrink-0" />
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{req.mobile}</span>
                                </div>
                                {req.message && (
                                    <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Message</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{req.message}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <select
                                    value={req.status}
                                    onChange={async (e) => {
                                        try {
                                            await api.put(`/location-requests/${req._id}`, { status: e.target.value });
                                            toast.success('Status updated');
                                            setLocationRequests(prev => prev.map(r => r._id === req._id ? { ...r, status: e.target.value } : r));
                                        } catch { toast.error('Update failed'); }
                                    }}
                                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-sm font-bold outline-none focus:border-primary transition-all cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Integrated">Integrated</option>
                                </select>
                                <button
                                    onClick={async () => {
                                        if (!window.confirm('Delete this request?')) return;
                                        try {
                                            await api.delete(`/location-requests/${req._id}`);
                                            toast.success('Request deleted');
                                            setLocationRequests(prev => prev.filter(r => r._id !== req._id));
                                        } catch { toast.error('Delete failed'); }
                                    }}
                                    className="px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-4">
                                Submitted: {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                    {locationRequests.length === 0 && (
                        <div className="md:col-span-2 py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem]">
                            <MapPin className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
                            <p className="font-black text-gray-400 uppercase tracking-widest text-sm">No integration requests yet</p>
                            <p className="text-gray-400 text-xs mt-2">Requests submitted via the landing page will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        )}
        {/* ADMIN MESSAGING TAB */}
        {activeTab === 'messages' && (() => {
          const loadContacts = async () => {
            try {
              const [contactsRes, threadsRes] = await Promise.all([
                api.get('/chat/contacts'),
                api.get('/chat/threads')
              ]);
              setChatContacts(contactsRes.data || []);
              setChatThreads(threadsRes.data || []);
            } catch { console.warn('Failed to load contacts'); }
          };

          const loadMessages = async (userId) => {
            setChatLoading(true);
            try {
              const { data } = await api.get(`/chat/${userId}`);
              setChatMessages(data || []);
            } catch { toast.error('Failed to load messages'); }
            setChatLoading(false);
          };

          const handleSendMessage = async () => {
            if (!newMessage.trim() || !selectedChatUser) return;
            try {
              const { data } = await api.post('/chat', {
                receiverId: selectedChatUser._id,
                content: newMessage.trim(),
                messageType: 'text'
              });
              setChatMessages(prev => [...prev, data]);
              setNewMessage('');
              // Refresh threads
              const threadsRes = await api.get('/chat/threads');
              setChatThreads(threadsRes.data || []);
            } catch { toast.error('Failed to send message'); }
          };

          // Auto-load contacts on tab open
          if (chatContacts.length === 0 && chatThreads.length === 0) {
            loadContacts();
          }

          const roleColors = {
            'Vendor': 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800/30',
            'HR': 'bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800/30',
            'Candidate': 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800/30',
            'Customer': 'bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-800/30',
            'Delivery Partner': 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800/30',
            'Admin': 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800/30',
            'Sub-Admin': 'bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800/30',
          };

          const roleDotColors = {
            'Vendor': 'bg-orange-500',
            'HR': 'bg-violet-500',
            'Candidate': 'bg-emerald-500',
            'Customer': 'bg-sky-500',
            'Delivery Partner': 'bg-amber-500',
            'Admin': 'bg-red-500',
            'Sub-Admin': 'bg-pink-500',
          };

          const availableRoles = ['All', ...new Set(chatContacts.map(c => c.role))];
          
          const filteredContacts = chatContacts.filter(c => {
            const matchesSearch = `${c.firstName} ${c.lastName} ${c.businessName || ''} ${c.companyName || ''}`.toLowerCase().includes(contactSearch.toLowerCase());
            const matchesRole = chatRoleFilter === 'All' || c.role === chatRoleFilter;
            return matchesSearch && matchesRole;
          });

          // Map threads to get unread counts per user
          const threadMap = {};
          chatThreads.forEach(t => {
            if (t.partner) threadMap[t.partner._id] = t;
          });

          return (
            <div className="flex gap-6 h-[calc(100vh-180px)]">
              {/* Contacts Sidebar */}
              <div className="w-[380px] shrink-0 flex flex-col bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1 flex items-center gap-3">
                    <Send size={20} /> Command Center
                  </h3>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Direct messaging across all roles</p>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 outline-none text-sm font-bold focus:border-indigo-400 transition-colors"
                    />
                  </div>
                  {/* Role Filters */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {availableRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => setChatRoleFilter(role)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          chatRoleFilter === role
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-gray-50 dark:bg-dark-bg text-gray-500 hover:text-indigo-600 border border-gray-100 dark:border-gray-800'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact list */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredContacts.length === 0 ? (
                    <div className="py-20 text-center px-6">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={40} className="text-gray-300 dark:text-gray-700" />
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">No Active Contacts</p>
                      <p className="text-[10px] font-medium text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">We couldn't find any approved users matching your criteria.</p>
                      <button 
                        onClick={loadContacts}
                        className="px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Sync Global Registry
                      </button>
                    </div>
                  ) : (
                    filteredContacts.map(contact => {
                      const thread = threadMap[contact._id];
                      const isSelected = selectedChatUser?._id === contact._id;
                      return (
                        <button
                          key={contact._id}
                          onClick={() => {
                            setSelectedChatUser(contact);
                            loadMessages(contact._id);
                          }}
                          className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-all text-left border-b border-gray-50 dark:border-gray-800/50 group ${
                            isSelected ? 'bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : ''
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm uppercase ${roleColors[contact.role] || 'bg-gray-100 text-gray-500'}`}>
                              {contact.firstName?.[0]}{contact.lastName?.[0]}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${roleDotColors[contact.role] || 'bg-gray-400'} rounded-full border-2 border-white dark:border-dark-card`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                                {contact.firstName} {contact.lastName}
                              </h4>
                              {thread?.unreadCount > 0 && (
                                <span className="w-5 h-5 bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center rounded-full shrink-0">
                                  {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${roleColors[contact.role] || 'bg-gray-100 text-gray-500'}`}>
                                {contact.role}
                              </span>
                              {thread?.lastMessage && (
                                <p className="text-[10px] text-gray-400 truncate">{thread.lastMessage.content?.slice(0, 25)}...</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Refresh button */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={loadContacts}
                    className="w-full py-3 bg-gray-50 dark:bg-dark-bg text-gray-500 hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
                  >
                    ↻ Refresh Contacts
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                {!selectedChatUser ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-[2rem] flex items-center justify-center mb-8 rotate-6">
                      <Send size={40} className="text-indigo-500 -rotate-6" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3">
                      Admin <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Messaging</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md leading-relaxed">
                      Select a vendor, HR, candidate, or any user from the contacts panel to start a direct conversation.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-8 justify-center">
                      {['Vendor', 'HR', 'Candidate', 'Customer'].map(r => (
                        <span key={r} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${roleColors[r] || 'bg-gray-50 text-gray-500'}`}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-indigo-50/30 dark:from-dark-card dark:to-indigo-900/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm uppercase ${roleColors[selectedChatUser.role] || 'bg-gray-100 text-gray-500'}`}>
                          {selectedChatUser.firstName?.[0]}{selectedChatUser.lastName?.[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 dark:text-white text-lg">
                            {selectedChatUser.firstName} {selectedChatUser.lastName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${roleDotColors[selectedChatUser.role] || 'bg-gray-400'}`}></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              {selectedChatUser.role} {selectedChatUser.businessName ? `• ${selectedChatUser.businessName}` : ''}{selectedChatUser.companyName ? `• ${selectedChatUser.companyName}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedChatUser(null); setChatMessages([]); }}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-dark-bg/30">
                      {chatLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageSquare size={40} className="text-gray-300 dark:text-gray-700 mb-4" />
                          <p className="text-sm font-bold text-gray-400">No messages yet</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Start the conversation below</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, idx) => {
                          const isMine = msg.sender?._id === userInfo._id || msg.sender === userInfo._id;
                          return (
                            <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${isMine
                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-[1.5rem] rounded-br-md shadow-lg shadow-indigo-600/20'
                                : 'bg-white dark:bg-dark-card text-gray-900 dark:text-white rounded-[1.5rem] rounded-bl-md border border-gray-100 dark:border-gray-800 shadow-sm'
                              } px-5 py-3.5`}>
                                {!isMine && (
                                  <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-indigo-500">
                                    {msg.sender?.firstName} {msg.sender?.lastName}
                                  </p>
                                )}
                                <p className={`text-sm font-medium leading-relaxed ${isMine ? 'text-white' : ''}`}>{msg.content}</p>
                                <p className={`text-[9px] mt-2 font-bold ${isMine ? 'text-white/50' : 'text-gray-400'}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {msg.isEdited && ' • edited'}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                          placeholder={`Message ${selectedChatUser.firstName}...`}
                          className="flex-1 px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 outline-none text-sm font-bold focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition-all"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                          <Send size={18} /> Send
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="glass-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-10 rotate-12">
                            <ShieldCheck size={48} />
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">Administrative <span className="text-primary">Profile</span></h3>
                        <p className="text-lg text-gray-500 font-medium mb-12">Authorized Personnel Access Only</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
                            {isAdminEditing ? (
                                <>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">First Name</label>
                                        <input 
                                            value={adminEditData.firstName} 
                                            onChange={e => setAdminEditData({...adminEditData, firstName: e.target.value})} 
                                            className="w-full bg-transparent border-b border-primary outline-none font-bold text-gray-900 dark:text-white" 
                                        />
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Name</label>
                                        <input 
                                            value={adminEditData.lastName} 
                                            onChange={e => setAdminEditData({...adminEditData, lastName: e.target.value})} 
                                            className="w-full bg-transparent border-b border-primary outline-none font-bold text-gray-900 dark:text-white" 
                                        />
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Contact</label>
                                        <input 
                                            value={adminEditData.mobile} 
                                            onChange={e => setAdminEditData({...adminEditData, mobile: e.target.value})} 
                                            className="w-full bg-transparent border-b border-primary outline-none font-bold text-gray-900 dark:text-white" 
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                        <p className="font-bold text-gray-900 dark:text-white underline decoration-primary/30 decoration-4 underline-offset-4">{userInfo.firstName} {userInfo.lastName}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Assigned Role</p>
                                        <p className="font-bold text-primary italic uppercase tracking-tight">{userInfo.role}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Official Email & Mobile</p>
                                        <p className="font-bold text-gray-900 dark:text-white uppercase">{userInfo.email} {userInfo.mobile && ` | ${userInfo.mobile}`}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center mb-12">
                            {isAdminEditing ? (
                                <>
                                    <button onClick={handleUpdateAdminProfile} className="px-10 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Save Profile</button>
                                    <button onClick={() => setIsAdminEditing(false)} className="px-10 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-red-500 transition-all">Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => setIsAdminEditing(true)} className="px-10 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Edit Administrative Profile</button>
                            )}
                        </div>

                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Account Privileges</p>
                            <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                                "As an {userInfo.role}, you have access to core FIC platform operations. Your actions are logged and encrypted for security compliance. Please ensure all data modifications follow the Forge India Connect governance policy."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
            </motion.div>
        </AnimatePresence>
    </DashboardLayout>
  );
};


const SlotManager = ({ slots, setSlots }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const addDate = () => {
        if (!newDate) return;
        if (slots.find(s => s.date === newDate)) {
            toast.error('Date already exists');
            return;
        }
        setSlots([...slots, { date: newDate, times: [], isAvailable: true }]);
        setNewDate('');
    };

    const addTime = (dateIndex) => {
        if (!newTime) return;
        const updatedSlots = [...slots];
        if (updatedSlots[dateIndex].times.includes(newTime)) {
             toast.error('Time slot already exists for this date');
             return;
        }
        updatedSlots[dateIndex].times.push(newTime);
        setSlots(updatedSlots);
        setNewTime('');
    };

    const removeTime = (dateIndex, timeIndex) => {
        const updatedSlots = [...slots];
        updatedSlots[dateIndex].times.splice(timeIndex, 1);
        setSlots(updatedSlots);
    };

    const removeDate = (dateIndex) => {
        const updatedSlots = [...slots];
        updatedSlots.splice(dateIndex, 1);
        setSlots(updatedSlots);
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-primary" /> Availability Management
            </h4>
            
            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <input 
                        type="date" 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm"
                    />
                </div>
                <button 
                    type="button"
                    onClick={addDate}
                    className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-blue-700 transition-all text-xs uppercase tracking-widest"
                >
                    Add Date
                </button>
            </div>

            <div className="space-y-4">
                {slots.map((slot, dIdx) => (
                    <div key={dIdx} className="p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group/date">
                        <button 
                            type="button" 
                            onClick={() => removeDate(dIdx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-opacity"
                        >
                            <XCircle size={14} />
                        </button>
                        
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-black text-primary uppercase text-xs tracking-widest">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {slot.times.map((time, tIdx) => (
                                <div key={tIdx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-primary/10 text-primary rounded-lg border border-primary/20 group/time">
                                    <span className="text-[10px] font-black">{time}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeTime(dIdx, tIdx)}
                                        className="text-primary/40 hover:text-red-500 transition-colors"
                                    >
                                        <XCircle size={12} />
                                    </button>
                                </div>
                            ))}
                            {slot.times.length === 0 && <span className="text-[10px] text-gray-400 font-bold italic">No time slots added</span>}
                        </div>

                        <div className="flex gap-2">
                             <input 
                                type="time" 
                                value={newTime} 
                                onChange={(e) => setNewTime(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-xs font-bold"
                             />
                             <button 
                                type="button" 
                                onClick={() => addTime(dIdx)}
                                className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all"
                             >
                                 Add Time
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;

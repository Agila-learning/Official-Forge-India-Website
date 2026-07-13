import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { LayoutDashboard, ShoppingBag, Package, Users, Star, Plus, Edit, Trash2, LogOut, FileText, CheckCircle, XCircle, Menu, X, Trash, Image, LifeBuoy, Bell, ShieldCheck, Mail, Phone, MapPin, Search, Wrench, Calendar, Clock, ChevronRight, PanelLeftClose, PanelLeftOpen, Tag, Percent, Box, Info, TrendingUp, Settings, User, Sparkles, CheckCircle2, CreditCard, Upload, AlertTriangle, Truck, Megaphone, Gift, MessageCircle, Filter, Download, RefreshCw, Eye, BarChart2 } from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import ServiceBuilder from '../components/vendor/ServiceBuilder';
import OrderInvoice from '../components/ui/OrderInvoice';
import SubServiceManager from '../components/ui/SubServiceManager';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNotifications } from '../context/NotificationContext';
import NoDataFound from '../components/ui/NoDataFound';
import HomeServiceCMS from '../components/admin/HomeServiceCMS';
import InvoiceModal from '../components/ui/InvoiceModal';
import { useCart } from '../context/CartContext';
import MembershipUpgradeWidget from '../components/ui/MembershipUpgradeWidget';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const VendorDashboard = () => {
 const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo') || '{}'));
 const { addToCart } = useCart();
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isAdding, setIsAdding] = useState(false);
 const [editingProduct, setEditingProduct] = useState(null);
 const location = useLocation();
 const [view, setView] = useState(location.state?.view || 'overview'); 

 const [orders, setOrders] = useState([]);
 const [tickets, setTickets] = useState([]);
 const [notifications, setNotifications] = useState([]);
 const [deliveryPartners, setDeliveryPartners] = useState([]);
 const [categories, setCategories] = useState([]);
 const [membershipPlans, setMembershipPlans] = useState([]);
 const [subCategories, setSubCategories] = useState([]);
 const [selectedCategory, setSelectedCategory] = useState('');
 const [dashboardStats, setDashboardStats] = useState({});
 const [filterRange, setFilterRange] = useState('Month'); 
 const [isServiceDefault, setIsServiceDefault] = useState(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 const [managedSlots, setManagedSlots] = useState([]);
 const [managedServiceConfig, setManagedServiceConfig] = useState([]);
 const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(true);
 const [viewingInvoice, setViewingInvoice] = useState(null);
 const [customers, setCustomers] = useState([]);
 const [salesReport, setSalesReport] = useState({ totalRevenue: 0, totalOrders: 0, successRate: 0 });
 const [stockReport, setStockReport] = useState([]);
 const [isAddingCategory, setIsAddingCategory] = useState(false);
 const [settingsData, setSettingsData] = useState({
 businessName: userInfo?.businessName || '',
 firstName: userInfo?.firstName || '',
 lastName: userInfo?.lastName || '',
 mobile: userInfo?.mobile || ''
 });

 const [bankData, setBankData] = useState({
 accountNumber: userInfo.bankDetails?.accountNumber || '',
 ifscCode: userInfo.bankDetails?.ifscCode || '',
 bankName: userInfo.bankDetails?.bankName || '',
 holderName: userInfo.bankDetails?.holderName || '',
 panNumber: userInfo.panNumber || ''
 });
  const [settlements, setSettlements] = useState([]);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedAvailabilityProduct, setSelectedAvailabilityProduct] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState({});
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [offerSearchTerm, setOfferSearchTerm] = useState('');
  const [selectedOfferProduct, setSelectedOfferProduct] = useState(null);
  const [discountVal, setDiscountVal] = useState('');

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews');
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews');
    }
  };

  const handleAvailabilityProductChange = (productId) => {
    setSelectedAvailabilityProduct(productId);
    const prod = products.find(p => p._id === productId);
    setManagedSlots(prod?.slots || []);
  };

  const handleSaveAvailability = async () => {
    if (!selectedAvailabilityProduct) return toast.error('No service selected');
    try {
      const prod = products.find(p => p._id === selectedAvailabilityProduct);
      if (!prod) return;
      await api.put(`/products/${selectedAvailabilityProduct}`, {
        ...prod,
        slots: managedSlots
      });
      toast.success('Availability slots successfully updated!');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to update availability slots');
    }
  };

  const handleUpdatePrice = async (product, newPrice, newDiscount, newGst) => {
    try {
      await api.put(`/products/${product._id}`, {
        ...product,
        price: Number(newPrice),
        discountPrice: newDiscount ? Number(newDiscount) : undefined,
        gstPercentage: Number(newGst)
      });
      toast.success(`Commercial parameters updated for ${product.name}`);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to update pricing details');
    }
  };

  const vendorReviews = reviews.filter(rev => {
    const productId = rev.product?._id || rev.product;
    return products.some(p => p._id === productId);
  });

  useEffect(() => {
    if (products.length > 0 && !selectedAvailabilityProduct) {
      const firstService = products.find(p => p.isService);
      if (firstService) {
        setSelectedAvailabilityProduct(firstService._id);
        setManagedSlots(firstService.slots || []);
      }
    }
  }, [products, selectedAvailabilityProduct]);

  const handleSaveSettings = async () => {
    try {
      const { data } = await api.put('/users/profile', settingsData);
      const updatedInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      toast.success('Store settings synchronized!');
      window.location.reload();
    } catch (err) {
      toast.error('Sync failed');
    }
  };
  const { fetchNotifications: fetchGlobalNotifications } = useNotifications();
  const navigate = useNavigate();



 const fetchTickets = async () => {
 try {
 const { data } = await api.get('/tickets');
 setTickets(data);
 } catch (err) { console.error('Failed to load tickets'); }
 };

 const handleDeleteTicket = async (id) => {
 if (!window.confirm('Delete this support query?')) return;
 try {
 await api.delete(`/tickets/${id}`);
 toast.success('Ticket deleted');
 fetchTickets();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Delete failed');
 }
 };

 const handleUpdateTicket = async (ticket) => {
 const subject = prompt("Edit Subject:", ticket.subject);
 const description = prompt("Edit Description:", ticket.description);
 if (subject && description) {
 try {
 await api.put(`/tickets/${ticket._id}`, { subject, description });
 toast.success('Ticket updated');
 fetchTickets();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Update failed');
 }
 }
 };

  useEffect(() => {
    fetchProducts();
    fetchNotifications();
    fetchDeliveryPartners();
    fetchCategories();
    fetchTickets();
    fetchReviews();
    fetchInquiries();

    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/membership-plans');
        setMembershipPlans(data);
      } catch (err) {
        console.error('Failed to load membership plans');
      }
    };
    fetchPlans();

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to sync profile');
      }
    };
    fetchProfile();
  }, []);

 const fetchCategories = async () => {
 try {
 const [catRes, subRes] = await Promise.all([
 api.get('/home-categories').catch(() => ({ data: [] })),
 api.get('/home-categories/sub').catch(() => ({ data: [] }))
 ]);
 setCategories(catRes.data || []);
 setSubCategories(subRes.data || []);
 } catch (err) { console.error('Failed to load categories'); }
 };

 const fetchDeliveryPartners = async () => {
 try {
 const { data } = await api.get('/users');
 setDeliveryPartners(data.filter(u => u.role === 'Delivery Partner'));
 } catch (err) { console.error('Failed to load partners'); }
 };

 const fetchNotifications = async () => {
 try {
 await fetchGlobalNotifications();
 } catch (err) { console.error('Failed to load notifications'); }
 };

 const fetchSettlements = async () => {
 try {
 const { data } = await api.get('/settlements/vendor');
 setSettlements(data);
 } catch (err) {
 console.error('Failed to fetch settlements');
 }
 };

 const fetchInquiries = async () => {
 try {
 const { data } = await api.get('/inquiries').catch(() => ({ data: [] }));
 setInquiries(Array.isArray(data) ? data : []);
 } catch (err) { console.error('Failed to fetch inquiries'); }
 };

 const uploadDocFile = async (file, docName) => {
 if (!file) return null;
 setUploadingDoc(prev => ({ ...prev, [docName]: true }));
 try {
 const fd = new FormData();
 fd.append('file', file);
 const { data: url } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
 toast.success(`${docName} uploaded successfully`);
 return url;
 } catch (err) {
 toast.error(`Failed to upload ${docName}`);
 return null;
 } finally {
 setUploadingDoc(prev => ({ ...prev, [docName]: false }));
 }
 };


 const fetchOrders = async (currentProducts) => {
 try {
 const res = await api.get('/orders');
 const vendorOrders = Array.isArray(res.data) ? res.data.filter(order => 
 Array.isArray(order.orderItems) && order.orderItems.some(item => (currentProducts || products).some(p => p._id === item.product))
 ) : [];
 setOrders(vendorOrders);
 generateReports(vendorOrders);
 } catch (err) {
 console.error('Failed to load orders');
 }
 };

 const fetchProducts = async () => {
    try {
      const [prodRes, servRes] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/services').catch(() => ({ data: [] }))
      ]);
      
      const vendorProducts = Array.isArray(prodRes.data) ? prodRes.data.filter(p => (p.vendorId?._id || p.vendorId) === userInfo?._id) : [];
      const vendorServices = Array.isArray(servRes.data) ? servRes.data.filter(s => (s.vendorId?._id || s.vendorId) === userInfo?._id).map(s => ({...s, isService: true, name: s.serviceName, price: s.basePrice})) : [];
      
      const combined = [...vendorProducts, ...vendorServices];
      setProducts(combined);
      
      const rentalAssets = combined.filter(p => p.propertyType && p.propertyType !== 'None');
      const rideAssets = combined.filter(p => p.category === 'Rides' || p.serviceType === 'Ride');
      
      const lowStock = vendorProducts.filter(p => !p.isService && p.countInStock < 10);
      setStockReport(lowStock);
      
      fetchOrders(combined);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      setLoading(false);
    }
  };

  const generateReports = (vendorOrders) => {
 const totalRevenue = vendorOrders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
 const totalOrders = vendorOrders.length;
 const successRate = totalOrders > 0 ? ((vendorOrders.filter(o => o.status === 'Delivered').length / totalOrders) * 100).toFixed(1) : 0;
 
 setSalesReport({ totalRevenue, totalOrders, successRate });
 
 // Unique Customers
 const uniqueCustomers = [];
 const customerIds = new Set();
 
 vendorOrders.forEach(order => {
 if (order.user && !customerIds.has(order.user._id)) {
 customerIds.add(order.user._id);
 uniqueCustomers.push({
 ...order.user,
 lastOrder: order.createdAt,
 totalSpent: vendorOrders.filter(o => o.user?._id === order.user._id && o.isPaid).reduce((acc, o) => acc + (o.totalPrice || 0), 0)
 });
 }
 });
 setCustomers(uniqueCustomers);
 };

 useEffect(() => {
 if (products.length >= 0) {
 const now = new Date();
 const filteredOrders = (orders || []).filter(o => {
 const orderDate = new Date(o.createdAt);
 if (filterRange === 'Day') return orderDate.toLocaleDateString() === now.toLocaleDateString();
 if (filterRange === 'Week') {
 const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
 return orderDate >= weekAgo;
 }
 if (filterRange === 'Month') {
 const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
 return orderDate >= monthAgo;
 }
 return true;
 });

 const sales = filteredOrders.reduce((acc, o) => acc + o.totalPrice, 0);
 const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.countInStock || 0)), 0);
 const lowStockCount = products.filter(p => !p.isService && (p.countInStock || 0) < 5).length;
 
 setDashboardStats({
 inventoryCount: products.length,
 dailySales: `₹${sales.toLocaleString()}`,
 totalStockValue: `₹${totalStockValue.toLocaleString()}`,
 lowStockCount: lowStockCount,
 rating: '4.9',
 conversion: '3.2%',
 label: filterRange === 'Day' ? "Today's Revenue" : filterRange === 'Week' ? "Weekly Revenue" : "Monthly Revenue"
 });
 }
 }, [products, orders, filterRange]);

 useEffect(() => {
 if (view === 'payouts') fetchSettlements();
 if (view === 'leads') fetchInquiries();
 }, [view]);


 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  data.isService = data.isService === 'true';
  data.price = Number(data.price);
  data.discountPrice = data.discountPrice ? Number(data.discountPrice) : undefined;
  data.countInStock = Number(data.countInStock || 0);
  data.tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
  if (data.highlights) data.highlights = data.highlights.split(',').map(s => s.trim());
  if (data.whatsIncluded) data.whatsIncluded = data.whatsIncluded.split(',').map(s => s.trim());
  if (data.whatsExcluded) data.whatsExcluded = data.whatsExcluded.split(',').map(s => s.trim());
  if (data.amenities) data.amenities = data.amenities.split(',').map(s => s.trim());
  if (data.pricingRules) {
    try { data.pricingRules = JSON.parse(data.pricingRules); } catch { data.pricingRules = {}; }
  }
  data.slots = managedSlots;
  data.serviceConfig = managedServiceConfig;
  data.deliveryCharge = Number(data.deliveryCharge || 0);
  data.freeDeliveryThreshold = Number(data.freeDeliveryThreshold || 0);
  data.gstPercentage = Number(data.gstPercentage || 18);
  if (data.serviceableArea) data.serviceableArea = data.serviceableArea.split(',').map(s => s.trim());
  data.teamSize = Number(data.teamSize || 0);
  data.equipmentProvided = data.equipmentProvided === 'true';
  if (data.safetyMeasures) data.safetyMeasures = data.safetyMeasures.split(',').map(s => s.trim());
  data.viewImages = {
    front: data.viewImages_front,
    back: data.viewImages_back,
    top: data.viewImages_top,
    bottom: data.viewImages_bottom
  };
  delete data.viewImages_bottom;

  // Specialized fields
  if (data.perKmRate) data.perKmRate = Number(data.perKmRate);
  if (data.sqft) data.sqft = Number(data.sqft);
  if (data.isOnline) data.isOnline = data.isOnline === 'true';
  
  // Auto-populate data.category from selected category reference name to satisfy mongoose validation requirement
  const selectedCatObj = categories.find(c => c._id === data.categoryRef || c._id === selectedCategory);
  if (selectedCatObj) {
    data.category = selectedCatObj.name;
    if (selectedCatObj.type === 'service' || selectedCatObj.type === 'rental' || selectedCatObj.type === 'ride') {
      data.isService = true;
    } else {
      data.isService = false;
      data.propertyType = 'None';
      data.vehicleType = 'None';
    }
  } else {
    data.isService = isServiceDefault;
    if (!isServiceDefault) {
      data.propertyType = 'None';
      data.vehicleType = 'None';
    }
  }
  
  try {
 if (editingProduct) {
 await api.put(`/products/${editingProduct._id}`, data);
 toast.success('Asset optimized and synced');
 } else {
 await api.post('/products', data);
 toast.success('Asset published to global marketplace');
 }
 setIsAdding(false);
 setEditingProduct(null);
 fetchProducts();
 } catch (err) {
 const msg = err.response?.data?.message || err.message || 'Publication failed';
 toast.error(msg);
 console.error('Product submit error:', err.response?.data || err);
 }
 };

 const handleDelete = async (id) => {
 if (!window.confirm('Are you sure?')) return;
 try {
 await api.delete(`/products/${id}`);
 toast.success('Product deleted');
 fetchProducts();
 } catch (err) {
 toast.error('Deletion failed');
 }
 };

 return (
 <DashboardLayout activeTab={view} setActiveTab={setView} stats={dashboardStats}>
 <div className="space-y-12">
 <AnimatePresence mode="wait">
 {view === 'overview' && (
 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
 <div className="flex flex-wrap items-center gap-6">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Business Statistics</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Growth <span className="text-primary">Stats</span></h2>
 </div>
 <div className="flex flex-wrap gap-4">
 <div className="px-5 py-2 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl shadow-xl shadow-primary/20 flex flex-col justify-center">
 <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">Current Tier</p>
 <p className="text-sm font-black text-white uppercase tracking-tighter">{userInfo?.subscriptionLevel || 'Basic Node'}</p>
 </div>
 <div className={`px-5 py-2 border rounded-2xl shadow-xl flex flex-col justify-center ${userInfo?.isVerified ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200'}`}>
 <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${userInfo?.isVerified ? 'text-green-600' : 'text-amber-600'}`}>Security Status</p>
 <p className={`text-sm font-black uppercase tracking-tighter flex items-center gap-2 ${userInfo?.isVerified ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
 {userInfo?.isVerified ? <><ShieldCheck size={14} /> Verified</> : <><Info size={14} /> Verification Pending</>}
 </p>
 </div>
 <div className="px-5 py-2 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl flex flex-col justify-center">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Shop Code</p>
 <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{userInfo?.shopCode || 'PENDING'}</p>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex bg-white dark:bg-dark-card rounded-2xl p-1 border border-gray-100 dark:border-gray-800 shadow-xl">
 {['Day', 'Week', 'Month'].map(r => (
 <button key={r} onClick={() => setFilterRange(r)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterRange === r ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary'}`}>{r}</button>
 ))}
 </div>
 <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2"></div>
 <button onClick={() => { setIsServiceDefault(false); setIsAdding(true); setEditingProduct(null); setView('inventory'); }} className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
 <Plus size={16} /> Product
 </button>
 <button onClick={() => { setIsServiceDefault(true); setIsAdding(true); setEditingProduct(null); setView('inventory'); }} className="px-6 py-3 bg-secondary text-dark-bg rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-yellow-500 shadow-xl shadow-secondary/20 transition-all flex items-center gap-2">
 <Wrench size={16} /> Service
 </button>
 </div>
 </div>
 <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
 <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors" />
 <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Recent <span className="text-primary">Operations</span></h3>
 <div className="space-y-4 relative z-10">
 {orders.slice(0, 5).map(order => (
 <div key={order._id} className="flex items-center justify-between p-6 bg-white/50 dark:bg-dark-bg/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all group/item">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
 <Package size={20} />
 </div>
 <div>
 <p className="font-black text-sm uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</p>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">₹{order.totalPrice.toLocaleString()} • {order.status}</p>
 </div>
 </div>
 <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shadow-inner"><TrendingUp size={18} /></div>
 </div>
 ))}
 {orders.length === 0 && (
 <div className="py-20 text-center">
 <div className="w-20 h-20 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
 <Package size={32} />
 </div>
 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No active orders in the current cycle.</p>
 </div>
 )}
 </div>
 </div>
 <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-secondary/10 transition-colors" />
 <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Inventory <span className="text-secondary">Status</span></h3>
 <div className="space-y-4 relative z-10">
 {products.slice(0, 5).map(prod => (
 <div key={prod._id} className="flex items-center justify-between p-6 bg-white/50 dark:bg-dark-bg/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-secondary/30 transition-all group/item">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-card p-1 border border-gray-100 dark:border-gray-800 shadow-sm group-hover/item:scale-105 transition-transform overflow-hidden">
 <img src={prod.image} className="w-full h-full object-cover rounded-xl" alt="" />
 </div>
 <div>
 <p className="font-black text-sm uppercase truncate w-32 tracking-tight">{prod.name}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Stock: {prod.countInStock || 0} • Value: ₹{(prod.price * (prod.countInStock || 0)).toLocaleString()}</p>
 </div>
 </div>
 <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${prod.isService ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'}`}>
 {prod.isService ? 'Service' : 'Product'}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {view === 'inventory' && (
 <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
 {isAdding || editingProduct ? (
 <div className="glass-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
 <div className="flex justify-between items-center mb-10">
 <h2 className="text-3xl font-black uppercase tracking-tighter">{editingProduct ? 'Edit Item' : isServiceDefault ? 'Add New Service' : 'Add New Product'}</h2>
 <div className="flex items-center gap-3">
 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isServiceDefault ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>Type: {isServiceDefault ? 'Service' : 'Product'}</span>
 </div>
 </div>
 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <input type="hidden" name="isService" value={isServiceDefault ? 'true' : 'false'} />
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{isServiceDefault ? 'Service Name' : 'Product Name'}</label>
 <input name="name" defaultValue={editingProduct?.name} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder={isServiceDefault ? "Cleaning" : "HemoHim"} />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (INR)</label>
 <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
 <div className="flex gap-2">
 <select 
    name="categoryRef" 
    value={selectedCategory} 
    onChange={(e) => {
      const catId = e.target.value;
      setSelectedCategory(catId);
      const catObj = categories.find(c => c._id === catId);
      if (catObj) {
        setIsServiceDefault(catObj.type === 'service' || catObj.type === 'rental' || catObj.type === 'ride');
      }
    }} 
    required 
    className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm"
  >
    <option value="">Select Category</option>
    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
  </select>
 <button type="button" onClick={() => setIsAddingCategory(true)} className="px-4 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all"><Plus size={20} /></button>
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sub-Category</label>
 <select name="subCategoryRef" defaultValue={editingProduct?.subCategoryRef?._id} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="">Select Sub-Category</option>
 {subCategories.filter(s => !selectedCategory || s.categoryId?._id === selectedCategory).map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
 </select>
 </div>
 {!isServiceDefault ? (
   <>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity (Beds/Rooms/Stock)</label>
     <input name="countInStock" type="number" defaultValue={editingProduct?.countInStock || 0} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Images (Link)</label>
     <input name="image" defaultValue={editingProduct?.image} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
     </div>
     <div className="md:col-span-2 space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
     <textarea name="description" defaultValue={editingProduct?.description} rows="3" className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none resize-none"></textarea>
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Warranty</label>
     <input name="warranty" defaultValue={editingProduct?.warranty || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 1 Year Warranty" />
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estimated Delivery</label>
     <input name="estimatedDeliveryTime" defaultValue={editingProduct?.estimatedDeliveryTime || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 3-5 Business Days" />
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fulfillment Mode</label>
     <select name="fulfillmentMode" defaultValue={editingProduct?.fulfillmentMode || 'Delivery Included'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
       <option value="Delivery Included">Delivery Included</option>
       <option value="Direct Pickup">Direct Pickup</option>
     </select>
     </div>
   </>
 ) : (
   <>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Images (Link)</label>
     <input name="image" defaultValue={editingProduct?.image} required className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
     </div>
     <div className="md:col-span-2 space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Details & Scope</label>
     <textarea name="description" defaultValue={editingProduct?.description} rows="3" className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none resize-none"></textarea>
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Warranty / Guarantee</label>
     <input name="warranty" defaultValue={editingProduct?.warranty || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 30 Days Quality Guarantee" />
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Team Size / Equipment</label>
     <input name="teamSize" defaultValue={editingProduct?.teamSize || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 2 Professionals, All tools provided" />
     </div>
     <div className="space-y-2">
     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Execution Mode</label>
     <select name="serviceMode" defaultValue={editingProduct?.serviceMode || 'at_home'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
       <option value="at_home">Home Service</option>
       <option value="at_center">Store / Center Visit</option>
     </select>
     </div>
   </>
 )}

 <div className="md:col-span-2 space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Serviceable Areas (Comma Separated Pincodes/Cities)</label>
 <input name="serviceableArea" defaultValue={editingProduct?.serviceableArea?.join(', ') || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 641601, Tiruppur, 641602" />
 </div>

 {/* Dynamic Rental/Ride Fields */}
 {(categories.find(c => c._id === selectedCategory)?.name === 'Rentals' || (editingProduct?.propertyType && editingProduct.propertyType !== 'None')) && (
 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Property Type</label>
 <select name="propertyType" defaultValue={editingProduct?.propertyType || 'Apartment'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="Apartment">Apartment</option>
 <option value="Individual House">Individual House</option>
 <option value="PG">PG</option>
 <option value="Hotel">Hotel</option>
 <option value="Room">Room</option>
 <option value="Villa">Villa</option>
 <option value="Office Space">Office Space</option>
 <option value="Vehicle Rental">Vehicle Rental</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Furnishing Status</label>
 <select name="furnishingStatus" defaultValue={editingProduct?.furnishingStatus || 'Unfurnished'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="Unfurnished">Unfurnished</option>
 <option value="Furnished">Furnished</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">BHK / Room Type</label>
 <input name="bhkType" defaultValue={editingProduct?.bhkType} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 2BHK, Deluxe Room" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Total Sqft</label>
 <input name="sqft" type="number" defaultValue={editingProduct?.sqft} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. 1200" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Sharing Type</label>
 <select name="sharingType" defaultValue={editingProduct?.sharingType || 'None'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="None">Not Applicable</option>
 <option value="Single">Single Sharing</option>
 <option value="Double">Double Sharing</option>
 <option value="Triple">Triple Sharing</option>
 <option value="Quad">Quad Sharing</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Booking Duration</label>
 <select name="bookingDuration" defaultValue={editingProduct?.bookingDuration || 'None'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="None">Standard Sale</option>
 <option value="Nightly">Per Night (Hotels)</option>
 <option value="Monthly">Per Month (PG/Rentals)</option>
 <option value="Daily">Per Day</option>
 <option value="Weekly">Per Week</option>
 <option value="Yearly">Per Year</option>
 </select>
 </div>
 <div className="md:col-span-2 space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Amenities (Comma Separated)</label>
 <input name="amenities" defaultValue={editingProduct?.amenities?.join(', ')} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. WiFi, AC, Food Included, Laundry" />
 </div>
 <div className="md:col-span-2 space-y-2">
 <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Property Location</label>
 <input name="location" defaultValue={editingProduct?.location} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="Enter full address of the property" />
 </div>
 </div>
 )}

 {(categories.find(c => c._id === selectedCategory)?.name === 'Rides' || (editingProduct?.vehicleType && editingProduct.vehicleType !== 'None')) && (
 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-secondary/5 rounded-[2.5rem] border border-secondary/10">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Vehicle Category</label>
 <select name="vehicleType" defaultValue={editingProduct?.vehicleType || 'Auto'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="Auto">Auto Rickshaw</option>
 <option value="Car">Sedan/SUV</option>
 <option value="Bike">Bike/Scooter</option>
 <option value="Truck">Cargo Truck</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Rate Per KM (INR)</label>
 <input name="perKmRate" type="number" defaultValue={editingProduct?.perKmRate || 12} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Operating Status</label>
 <select name="isOnline" defaultValue={editingProduct?.isOnline ? 'true' : 'false'} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
 <option value="true">Go Online (Live Tracking)</option>
 <option value="false">Stay Offline</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Service Base Location</label>
 <input name="location" defaultValue={editingProduct?.location} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none" placeholder="e.g. Tiruppur HQ" />
 </div>
 </div>
 )}
 <div className="md:col-span-2 flex gap-4 mt-4">
 <button type="submit" className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">Save Changes</button>
 <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-10 py-5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-[2rem] font-black uppercase tracking-widest transition-all">Cancel</button>
 </div>
 </form>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {products.map(product => (
 <div key={product._id} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 group hover:border-primary transition-all">
 <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
 <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
 <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/20">{product.categoryRef?.name || product.category || 'Atomy Product'}</span>
 </div>
 </div>
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">{product.name}</h3>
 <div className="flex items-center gap-2 mt-2">
 <p className="text-2xl font-black text-primary">₹{product.discountPrice || product.price}</p>
 {product.discountPrice && <p className="text-sm text-gray-400 line-through">₹{product.price}</p>}
 </div>
 <div className="flex gap-2 mt-8">
 <button onClick={() => { setEditingProduct(product); setSelectedCategory(product.categoryRef?._id || product.categoryRef || ''); setIsAdding(true); }} className="flex-1 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Customize</button>
 <button onClick={() => handleDelete(product._id)} className="px-4 py-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
 </div>
 </div>
 ))}
 {products.length === 0 && (
  <div className="col-span-full">
  <NoDataFound title="Inventory Empty" description="Register your first product or service mission to start your campaign." icon={Package} onAction={() => setIsAdding(true)} actionLabel="Launch New Asset" />
  </div>
  )}
  </div>
  )}
  </motion.div>
  )}



  {view === 'kyc' && (
   <motion.div key="kyc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
     <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
       <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Verification & <span className="text-primary">Documents</span></h3>
       <p className="text-sm text-gray-500 font-bold mb-8">Upload your KYC documents to get verified and unlock full vendor capabilities.</p>
       <div className={`flex items-center gap-4 mb-8 p-5 rounded-2xl border ${userInfo?.kycStatus === 'Verified' ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : userInfo?.kycStatus === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200' : 'bg-gray-50 dark:bg-dark-card border-gray-200'}`}>
         <ShieldCheck className={userInfo?.kycStatus === 'Verified' ? 'text-green-500' : 'text-amber-500'} size={32} />
         <div>
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">KYC Status</p>
           <p className={`text-xl font-black uppercase tracking-tighter ${userInfo?.kycStatus === 'Verified' ? 'text-green-600' : 'text-amber-600'}`}>{userInfo?.kycStatus || 'Not Started'}</p>
           {userInfo?.kycStatus === 'Pending' && <p className="text-xs text-amber-500 font-bold mt-1">Under review by our team. Usually takes 24-48 hours.</p>}
         </div>
       </div>
       {/* Existing docs */}
       {userInfo?.profileDocuments?.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           {userInfo.profileDocuments.map((doc, i) => (
             <a key={i} href={doc.url?.startsWith('http') ? doc.url : `${window.location.origin}/${doc.url}`} target="_blank" rel="noreferrer"
               className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl hover:border-green-400 transition-all">
               <CheckCircle size={18} className="text-green-500 shrink-0" />
               <div className="min-w-0"><p className="text-xs font-black text-green-700 dark:text-green-300 truncate">{doc.name}</p><p className="text-[9px] text-green-500 font-bold">Uploaded ✓</p></div>
             </a>
           ))}
         </div>
       )}
       {/* File upload form */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {[
           { key: 'PAN Card', label: 'PAN Card', required: true },
           { key: 'GST Certificate', label: 'GST Certificate', required: false },
           { key: 'Business License', label: 'Business License', required: false },
           { key: 'Address Proof', label: 'Address Proof', required: true },
         ].map(({ key, label, required }) => {
           const existing = userInfo?.profileDocuments?.find(d => d.name === key);
           return (
             <div key={key} className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 {label} {required && <span className="text-red-400">*</span>}
                 {existing && <span className="text-green-500 font-bold">✓ Uploaded</span>}
               </label>
               <label className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${uploadingDoc[key] ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5'}`}>
                 {uploadingDoc[key] ? <><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /><span className="text-xs font-bold text-primary">Uploading...</span></> :
                   <><Upload size={18} className="text-gray-400" /><span className="text-sm font-bold text-gray-500">Click to upload {label}</span></>}
                 <input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" className="hidden" onChange={async (e) => {
                   const file = e.target.files?.[0];
                   if (!file) return;
                   const url = await uploadDocFile(file, key);
                   if (url) {
                     const existingDocs = userInfo?.profileDocuments?.filter(d => d.name !== key) || [];
                     const newDocs = [...existingDocs, { name: key, url, type: 'credential' }];
                     try {
                       const { data } = await api.put('/users/profile', { profileDocuments: newDocs, kycStatus: 'Pending' });
                       setUserInfo(data); localStorage.setItem('userInfo', JSON.stringify(data));
                     } catch(err) { toast.error('Failed to save document'); }
                   }
                 }} />
               </label>
             </div>
           );
         })}
       </div>
       <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl">
         <p className="text-xs font-bold text-blue-600">📋 Accepted formats: JPG, PNG, PDF, DOC. Max file size: 5MB. All uploads are encrypted and stored securely.</p>
       </div>
     </div>
   </motion.div>
  )}


 {view === 'missions' && (
 <motion.div key="missions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
 {/* Earnings Summary */}
 <div className="p-10 bg-gradient-to-br from-slate-900 to-gray-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
 <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total Earnings</p>
 <h3 className="text-4xl font-black tracking-tighter">₹{salesReport.totalRevenue.toLocaleString()}</h3>
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Successful Missions</p>
 <h3 className="text-4xl font-black tracking-tighter">{orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length}</h3>
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Success Rate</p>
 <h3 className="text-4xl font-black tracking-tighter">{salesReport.successRate}%</h3>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-8">
 {orders.filter(o => o.orderItems.some(i => i.isService)).map(mission => (
 <div key={mission._id} className="p-10 bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
 <div className="flex flex-col lg:flex-row justify-between gap-10">
 <div className="flex-1">
 <div className="flex items-center gap-4 mb-4">
 <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">Ref: #{mission._id.slice(-6).toUpperCase()}</span>
 <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${mission.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-dark-bg'}`}>{mission.status}</span>
 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(mission.createdAt).toLocaleDateString()}</span>
 </div>
 <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">
 {mission.orderItems.filter(i => i.isService).map(i => i.name).join(', ')}
 </h4>
 
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Customer</p>
 <p className="text-xs font-bold truncate">{mission.user?.firstName} {mission.user?.lastName}</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Mission Type</p>
 <p className="text-xs font-bold uppercase">{mission.orderItems[0]?.category || 'General Service'}</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Execution Hub</p>
 <p className="text-xs font-bold truncate">{mission.shippingAddress?.city || 'HQ'}</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Revenue</p>
 <p className="text-xs font-black text-primary">₹{mission.totalPrice.toLocaleString()}</p>
 </div>
 </div>
 </div>
 <div className="flex flex-col justify-center gap-4">
 <button onClick={() => setViewingInvoice(mission)} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Details</button>
 {mission.status !== 'Completed' && (
 <button onClick={() => handleUpdateStatus(mission._id, 'Completed')} className="px-8 py-4 bg-secondary text-dark-bg rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-all">Mark Ready</button>
 )}
 </div>
 </div>
 </div>
 ))}
 {orders.filter(o => o.orderItems.some(i => i.isService)).length === 0 && (
 <NoDataFound title="No Active Missions" description="Awaiting service requests from customers." icon={ShieldCheck} />
 )}
 </div>
 </motion.div>
 )}

 {view === 'orders' && (
 <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Product Order Logistics</h3>
 <div className="mobile-table-scroll">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-gray-100 dark:border-gray-800">
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</th>
 <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Value (INR)</th>
 </tr>
 </thead>
 <tbody>
 {orders.filter(o => !o.orderItems.some(i => i.isService)).map(order => (
 <tr key={order._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
 <td className="py-6 font-mono text-xs font-bold text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
 <td className="py-6">
 <span className="px-3 py-1 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase">{order.status}</span>
 </td>
 <td className="py-6">
 {order.cancellationReason ? (
 <p className="text-[10px] font-bold text-red-500 max-w-[120px] line-clamp-1" title={order.cancellationReason}>{order.cancellationReason}</p>
 ) : (
 <p className="text-[10px] text-gray-400">N/A</p>
 )}
 </td>
 <td className="py-6 text-right font-black text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 {orders.length === 0 && <NoDataFound title="No Orders" description="You haven't received any orders yet." icon={ShoppingBag} />}
 </div>
 </motion.div>
 )}

 {view === 'customers' && (
 <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <h2 className="text-4xl font-black uppercase tracking-tighter">Customer <span className="text-primary">Tracking</span></h2>
 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">{customers.length} Unique Clients</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {customers.map(customer => (
 <div key={customer._id} className="p-8 bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-primary transition-all">
 <div className="flex items-center gap-4 mb-6">
 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase text-2xl">
 {customer.firstName?.[0]}{customer.lastName?.[0]}
 </div>
 <div>
 <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{customer.firstName} {customer.lastName}</h3>
 <p className="text-[10px] font-bold text-gray-400 truncate">{customer.email}</p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Total Spent</p>
 <p className="text-sm font-black text-primary">₹{customer.totalSpent?.toLocaleString()}</p>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Last Order</p>
 <p className="text-sm font-black text-gray-900 dark:text-white uppercase text-[10px]">{new Date(customer.lastOrder).toLocaleDateString()}</p>
 </div>
 </div>
 </div>
 ))}
 {customers.length === 0 && (
 <div className="col-span-full">
 <NoDataFound title="No Customers Yet" description="Your client list will grow as you fulfill orders and missions." icon={Users} />
 </div>
 )}
 </div>
 </motion.div>
 )}

 {view === 'reports' && (
 <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <h2 className="text-4xl font-black uppercase tracking-tighter">Business <span className="text-primary">Intelligence</span></h2>
 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 tracking-widest">Growth & Inventory Analytics</p>
 </div>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/20 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-4 text-primary opacity-20 group-hover:scale-125 transition-transform"><TrendingUp size={80} /></div>
 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Total Revenue</p>
 <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">₹{salesReport.totalRevenue?.toLocaleString()}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lifetime Commercial Volume</p>
 </div>
 <div className="p-10 bg-yellow-400/5 rounded-[3rem] border border-yellow-400/20 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-4 text-yellow-500 opacity-20 group-hover:scale-125 transition-transform"><ShoppingBag size={80} /></div>
 <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-4">Total Orders</p>
 <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{salesReport.totalOrders}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Success Rate: {salesReport.successRate}%</p>
 </div>
 <div className="p-10 bg-red-500/5 rounded-[3rem] border border-red-500/20 shadow-xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-4 text-red-500 opacity-20 group-hover:scale-125 transition-transform"><Box size={80} /></div>
 <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">Low Stock Alerts</p>
 <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{stockReport.length}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Critical Inventory Levels</p>
 </div>
 </div>

 <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Stock Health Check</h3>
 <div className="space-y-4">
 {stockReport.map(prod => (
 <div key={prod._id} className="flex items-center justify-between p-6 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/20">
 <div className="flex items-center gap-4">
 <p className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{prod.name}</p>
 <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[8px] font-black uppercase">Low Stock: {prod.countInStock}</span>
 </div>
 <button onClick={() => { setEditingProduct(prod); setSelectedCategory(prod.categoryRef?._id || prod.categoryRef || ''); setIsAdding(true); setView('inventory'); }} className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Restock Now</button>
 </div>
 ))}
 {stockReport.length === 0 && (
 <div className="py-20 text-center">
 <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Levels Stabilized</p>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )}

 {view === 'tickets' && (
 <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {tickets.map(ticket => (
 <div key={ticket._id} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all group">
 <div className="flex justify-between items-start mb-6">
 <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{ticket.status}</span>
 <div className="flex items-center gap-2">
 <button onClick={() => handleUpdateTicket(ticket)} className="p-2 text-gray-400 hover:text-primary transition-all"><Edit size={14} /></button>
 <button onClick={() => handleDeleteTicket(ticket._id)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
 </div>
 </div>
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">{ticket.subject}</h3>
 <p className="text-sm text-gray-500 mb-8">"{ticket.description}"</p>
 </div>
 ))}
 {tickets.length === 0 && (
 <div className="col-span-full">
 <NoDataFound title="Support Stable" description="No active support queries recorded." icon={LifeBuoy} />
 </div>
 )}
 </div>
 </motion.div>
 )}

 {view === 'notifications' && (
 <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
 {notifications.length === 0 && (
 <NoDataFound title="No Alerts" description="Your operational feed is clear." icon={Bell} />
 )}
 </motion.div>
 )}

 {view === 'profile' && (
 <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Vendor Account</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Profile & <span className="text-primary">Settings</span></h2>
 </div>
 <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
 <h3 className="text-xl font-black uppercase tracking-wider">Business Settings</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business/Store Name</label>
 <input value={settingsData.businessName} onChange={e => setSettingsData({...settingsData, businessName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</label>
 <input value={settingsData.mobile} onChange={e => setSettingsData({...settingsData, mobile: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name</label>
 <input value={settingsData.firstName} onChange={e => setSettingsData({...settingsData, firstName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name</label>
 <input value={settingsData.lastName} onChange={e => setSettingsData({...settingsData, lastName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
 </div>
 </div>
 <button className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all" onClick={handleSaveSettings}>Save Settings</button>
 </div>
 </motion.div>
 )}



 {/* ALERTS TAB */}
 {view === 'alerts' && (
 <motion.div key="alerts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Notifications</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Activity <span className="text-primary">Alerts</span></h2>
 </div>
 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-4">
 {orders.slice(0, 10).map(order => (
 <div key={order._id} className="flex items-start gap-4 p-5 bg-white dark:bg-dark-bg rounded-2xl border border-gray-50 dark:border-gray-800">
 <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
 <ShoppingBag size={16} />
 </div>
 <div className="flex-1">
 <p className="font-black text-sm text-gray-900 dark:text-white">New Order — #{order._id?.slice(-6)?.toUpperCase()}</p>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalPrice?.toLocaleString()}</p>
 </div>
 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : order.status === 'Cancelled' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>{order.status || 'Processing'}</span>
 </div>
 ))}
 {orders.length === 0 && <div className="py-20 text-center text-gray-400 font-bold text-sm uppercase tracking-widest">No new alerts</div>}
 </div>
 </motion.div>
 )}

 {/* FINANCIALS & PAYOUTS TAB */}
 {view === 'payouts' && (
 <motion.div key="payouts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Financial Treasury</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Wallet <span className="text-primary">& Settlements</span></h2>
 </div>
 <div className="glass-card px-10 py-6 rounded-3xl border border-primary/20 bg-primary/5 flex items-center gap-6">
 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
 <TrendingUp size={24} />
 </div>
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available for Payout</p>
 <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">₹{userInfo.walletBalance?.toLocaleString() || '0'}</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 {/* Bank Details Form */}
 <div className="lg:col-span-1 space-y-8">
 <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
 <CreditCard size={18} className="text-primary" /> Bank Onboarding
 </h3>
 <div className="space-y-5">
 <div className="space-y-1.5">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
 <input 
 value={bankData.holderName} 
 onChange={e => setBankData({...bankData, holderName: e.target.value})} 
 placeholder="As per bank records"
 className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
 <input 
 value={bankData.accountNumber} 
 onChange={e => setBankData({...bankData, accountNumber: e.target.value})} 
 placeholder="000000000000"
 className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
 <input 
 value={bankData.ifscCode} 
 onChange={e => setBankData({...bankData, ifscCode: e.target.value.toUpperCase()})} 
 placeholder="SBIN0000000"
 className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">PAN Number</label>
 <input 
 value={bankData.panNumber} 
 onChange={e => setBankData({...bankData, panNumber: e.target.value.toUpperCase()})} 
 placeholder="ABCDE1234F"
 className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
 />
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
 <input 
 value={bankData.bankName} 
 onChange={e => setBankData({...bankData, bankName: e.target.value})} 
 placeholder="State Bank of India"
 className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
 />
 </div>
 
 <div className={`p-4 rounded-2xl flex items-center gap-3 ${userInfo.kycStatus === 'Verified' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>
 <ShieldCheck size={16} />
 <p className="text-[9px] font-black uppercase tracking-widest">KYC STATUS: {userInfo.kycStatus || 'NOT VERIFIED'}</p>
 </div>

 <button 
 disabled={isSavingBank}
 onClick={async () => {
 setIsSavingBank(true);
 try {
 const { data } = await api.put('/users/bank-details', bankData);
 localStorage.setItem('userInfo', JSON.stringify(data.user));
 toast.success('Financial Identity Synchronized');
 window.location.reload();
 } catch (err) {
 toast.error('Onboarding failed. Verify IFSC/PAN.');
 } finally {
 setIsSavingBank(false);
 }
 }}
 className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
 >
 {isSavingBank ? 'Encrypting Data...' : 'Update Bank Records'}
 </button>
 </div>
 </div>
 </div>

 {/* Settlement History */}
 <div className="lg:col-span-2 space-y-8">
 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
 <div className="flex justify-between items-center mb-10">
 <h3 className="text-xl font-black uppercase tracking-tighter">Settlement <span className="text-primary">Archive</span></h3>
 <button className="px-4 py-2 bg-gray-50 dark:bg-dark-bg rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-primary transition-all">Download Report</button>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-gray-50 dark:border-gray-800">
 <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</th>
 <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
 <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commission</th>
 <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Settled</th>
 <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
 {settlements.map(s => (
 <tr key={s._id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
 <td className="py-6 pr-4">
 <p className="text-xs font-black text-gray-900 dark:text-white uppercase">#{s.order?._id?.slice(-6)}</p>
 <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(s.createdAt).toLocaleDateString()}</p>
 </td>
 <td className="py-6 text-xs font-bold text-gray-500">₹{s.totalRevenue?.toLocaleString()}</td>
 <td className="py-6 text-xs font-bold text-red-400">-₹{s.commission?.toLocaleString()}</td>
 <td className="py-6 text-sm font-black text-green-500">₹{s.amount?.toLocaleString()}</td>
 <td className="py-6">
 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.status === 'Settled' ? 'bg-green-100 text-green-600' : s.status === 'Failed' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>
 {s.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {settlements.length === 0 && (
 <div className="py-20 text-center">
 <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-40">
 <CreditCard size={24} className="text-gray-400" />
 </div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No financial movements detected.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {/* INSIGHTS & REPORTS TAB */}
 {view === 'insights' && (
 <motion.div key="insights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Analytics</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Reports & <span className="text-primary">Insights</span></h2>
 </div>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Total Revenue', value: `₹${salesReport.totalRevenue.toLocaleString()}`, sub: 'All time', icon: TrendingUp, color: 'primary' },
 { label: 'Total Orders', value: salesReport.totalOrders, sub: 'All time', icon: ShoppingBag, color: 'indigo' },
 { label: 'Delivery Rate', value: `${salesReport.successRate || 0}%`, sub: 'Success', icon: CheckCircle2, color: 'green' },
 { label: 'Active Listings', value: products.length, sub: 'Published', icon: Package, color: 'orange' },
 ].map(s => (
 <div key={s.label} className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <s.icon size={24} className={`text-${s.color}-500 mb-4`} />
 <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{s.value}</p>
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
 <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{s.sub}</p>
 </div>
 ))}
 </div>
 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <h3 className="text-xl font-black mb-8 uppercase tracking-wider">Low Stock Warnings</h3>
 <div className="space-y-3">
 {stockReport.length > 0 ? stockReport.map(p => (
 <div key={p._id} className="flex items-center justify-between p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/30">
 <span className="font-black text-sm text-gray-900 dark:text-white">{p.name}</span>
 <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-black uppercase">{p.countInStock} left</span>
 </div>
 )) : <p className="text-center py-10 text-gray-400 font-bold text-sm uppercase">All stock levels are healthy</p>}
 </div>
 </div>
 </motion.div>
 )}

 {/* AVAILABILITY SCHEDULE TAB */}
 {view === 'availability' && (
 <motion.div key="availability" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Operation Scheduler</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Availability <span className="text-primary">& Scheduling</span></h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
 <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
 <Wrench size={18} className="text-primary" /> Active Services
 </h3>
 <p className="text-xs text-gray-500 font-medium">Select a service to configure its operational availability slots.</p>
 <div className="space-y-3">
 {products.filter(p => p.isService).map(p => (
 <button 
 key={p._id}
 type="button"
 onClick={() => handleAvailabilityProductChange(p._id)}
 className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${selectedAvailabilityProduct === p._id ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/40 bg-white dark:bg-dark-card'}`}
 >
 <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-dark-bg p-1 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
 <img src={p.image} className="w-full h-full object-cover rounded-lg" alt="" />
 </div>
 <div className="flex-1 truncate">
 <p className="font-black text-xs uppercase truncate">{p.name}</p>
 <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{p.categoryRef?.name || p.category || 'General Service'}</p>
 </div>
 </button>
 ))}
 {products.filter(p => p.isService).length === 0 && (
 <p className="text-center py-10 text-xs font-black text-gray-400 uppercase">No active services listed</p>
 )}
 </div>
 </div>

 <div className="lg:col-span-2 space-y-8">
 {selectedAvailabilityProduct ? (
 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <div className="flex justify-between items-center mb-8">
 <div>
 <h3 className="text-xl font-black uppercase tracking-tighter">Availability Slots</h3>
 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">For {products.find(p => p._id === selectedAvailabilityProduct)?.name}</p>
 </div>
 <button 
 type="button"
 onClick={handleSaveAvailability}
 className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
 >
 Save Slots Configuration
 </button>
 </div>
 
 <SlotManager slots={managedSlots} setSlots={setManagedSlots} />
 </div>
 ) : (
 <div className="glass-card p-20 text-center rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <Calendar size={64} className="text-gray-300 mx-auto mb-6 animate-pulse" />
 <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Select an active service from the left panel to begin scheduling</p>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )}

 {/* ASSET PRICING & GST TAB */}
 {view === 'pricing' && (
 <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Commercial Matrix</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Asset Pricing <span className="text-primary">& Taxation</span></h2>
 </div>

 <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-gray-100 dark:border-gray-800">
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Base Price (INR)</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Discount Price (INR)</th>
 <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">GST %</th>
 <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
 {products.map(prod => (
 <PricingRow 
 key={prod._id}
 product={prod}
 onSave={handleUpdatePrice}
 />
 ))}
 {products.length === 0 && (
 <tr>
 <td colSpan="6" className="py-20 text-center text-gray-400 font-bold text-sm uppercase tracking-widest">No listings available to manage pricing</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </motion.div>
 )}

 {/* REVIEWS & RATINGS TAB */}
 {view === 'reviews' && (
 <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Quality & Ratings</p>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Customer <span className="text-primary">Reviews</span></h2>
 </div>

 <div className="glass-card px-10 py-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-6">
 <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
 <Star size={24} className="fill-yellow-500 text-yellow-500" />
 </div>
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Average Quality Index</p>
 <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">
 {vendorReviews.length > 0 
    ? (vendorReviews.reduce((acc, r) => acc + r.rating, 0) / vendorReviews.length).toFixed(1) 
    : '5.0'} <span className="text-xs font-bold text-gray-400">/ 5.0</span>
 </p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {vendorReviews.map(rev => (
 <div key={rev._id} className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-between group hover:border-yellow-500/30 transition-all">
 <div>
 <div className="flex justify-between items-start mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase text-sm">
 {rev.name?.[0]}
 </div>
 <div>
 <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-tight">{rev.name}</h4>
 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</p>
 </div>
 </div>
 <div className="flex gap-0.5">
 {Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      size={12} 
      className={i < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200 dark:text-gray-700'} 
    />
  ))}
 </div>
 </div>
 <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6 italic">"{rev.comment}"</p>
 </div>

 <div className="pt-5 border-t border-gray-50 dark:border-gray-800 flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-dark-bg p-1 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
 <img src={rev.product?.image || 'https://via.placeholder.com/50'} className="w-full h-full object-cover rounded" alt="" />
 </div>
 <div className="truncate">
 <p className="text-[9px] font-black uppercase text-gray-400">Reviewed Asset</p>
 <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase truncate w-40">{rev.product?.name || 'Deleted Product'}</p>
 </div>
 </div>
 </div>
 ))}
 {vendorReviews.length === 0 && (
 <div className="col-span-full">
 <NoDataFound title="No Customer Feedback" description="Once orders are executed, quality ratings will appear in this terminal." icon={Star} />
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

  {/* ── BUSINESS PROFILE ── */}
  {view === 'business-profile' && (
    <motion.div key="business-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="glass-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Business <span className="text-primary">Profile</span></h3>
        <p className="text-sm text-gray-500 font-bold mb-8">Manage your business details, bank account, and contact information.</p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const payload = {
            businessName: fd.get('businessName'), firstName: fd.get('firstName'), lastName: fd.get('lastName'),
            mobile: fd.get('mobile'), address: fd.get('address'), city: fd.get('city'),
            pincode: fd.get('pincode'), gstNumber: fd.get('gstNumber'), panNumber: fd.get('panNumber'),
          };
          try {
            const { data } = await api.put('/users/profile', payload);
            setUserInfo({ ...userInfo, ...data }); localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
            toast.success('Business profile updated!');
          } catch(err) { toast.error('Update failed'); }
        }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'businessName', label: 'Business Name', val: userInfo?.businessName },
            { name: 'firstName', label: 'Owner First Name', val: userInfo?.firstName },
            { name: 'lastName', label: 'Owner Last Name', val: userInfo?.lastName },
            { name: 'mobile', label: 'Mobile / WhatsApp', val: userInfo?.mobile },
            { name: 'address', label: 'Business Address', val: userInfo?.address },
            { name: 'city', label: 'City', val: userInfo?.city },
            { name: 'pincode', label: 'Pincode', val: userInfo?.pincode },
            { name: 'gstNumber', label: 'GST Number', val: userInfo?.gstNumber },
            { name: 'panNumber', label: 'PAN Number', val: userInfo?.panNumber },
          ].map(f => (
            <div key={f.name} className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{f.label}</label>
              <input name={f.name} defaultValue={f.val || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
            </div>
          ))}
          <div className="md:col-span-2">
            <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all">Save Business Profile</button>
          </div>
        </form>
      </div>
      {/* Bank Details */}
      <div className="glass-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
        <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">Bank Account <span className="text-primary">Details</span></h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          try {
            const { data } = await api.put('/users/bank-details', {
              accountNumber: fd.get('accountNumber'), ifscCode: fd.get('ifscCode'),
              bankName: fd.get('bankName'), holderName: fd.get('holderName'), panNumber: fd.get('panNumber'),
            });
            toast.success('Bank details saved! KYC status: ' + (data.user?.kycStatus || 'Pending'));
            const updated = { ...userInfo, bankDetails: data.user?.bankDetails, kycStatus: data.user?.kycStatus };
            setUserInfo(updated); localStorage.setItem('userInfo', JSON.stringify(updated));
          } catch(err) { toast.error('Bank update failed'); }
        }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'holderName', label: 'Account Holder Name', val: bankData.holderName },
            { name: 'accountNumber', label: 'Account Number', val: bankData.accountNumber },
            { name: 'ifscCode', label: 'IFSC Code', val: bankData.ifscCode },
            { name: 'bankName', label: 'Bank Name', val: bankData.bankName },
            { name: 'panNumber', label: 'PAN Number', val: bankData.panNumber },
          ].map(f => (
            <div key={f.name} className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{f.label}</label>
              <input name={f.name} defaultValue={f.val || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" />
            </div>
          ))}
          <div className="md:col-span-2">
            <button type="submit" className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:opacity-90 shadow-xl transition-all">Sync Bank Details & Verify</button>
          </div>
        </form>
      </div>
    </motion.div>
  )}

  {/* ── CUSTOMER LEADS ── */}
  {view === 'leads' && (
    <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Incoming</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Customer <span className="text-primary">Leads</span></h2>
        </div>
        <button onClick={fetchInquiries} className="flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', val: inquiries.length, color: 'blue' },
          { label: 'New Today', val: inquiries.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, color: 'green' },
          { label: 'Pending', val: inquiries.filter(i => !i.status || i.status === 'Pending').length, color: 'amber' },
          { label: 'Responded', val: inquiries.filter(i => i.status === 'Responded').length, color: 'purple' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg bg-${s.color}-50/50 dark:bg-${s.color}-900/10`}>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{s.val}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-black uppercase tracking-tighter text-lg">Lead <span className="text-primary">Directory</span></h3>
        </div>
        {inquiries.length === 0 ? (
          <div className="py-20 text-center"><p className="text-sm font-black text-gray-400 uppercase tracking-widest">No customer leads yet.</p></div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {inquiries.map(inq => (
              <div key={inq._id} className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{(inq.name || 'U')[0].toUpperCase()}</div>
                    <p className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{inq.name || 'Anonymous'}</p>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${!inq.status || inq.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{inq.status || 'Pending'}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-11">{inq.email} • {inq.phone}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 ml-11 line-clamp-2">{inq.message || inq.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {inq.phone && <a href={`tel:${inq.phone}`} className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Phone size={14} /></a>}
                  {inq.email && <a href={`mailto:${inq.email}`} className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Mail size={14} /></a>}
                  {inq.phone && <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noreferrer" className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><MessageCircle size={14} /></a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )}

  {/* ── DELIVERY MANAGEMENT ── */}
  {view === 'delivery' && (
    <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Logistics</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Delivery <span className="text-primary">Management</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4"><Truck size={20} className="text-primary" /><p className="font-black uppercase tracking-widest text-xs text-gray-400">Delivery Partners</p></div>
          <p className="text-4xl font-black">{deliveryPartners.length}</p>
          <p className="text-xs text-green-500 font-bold mt-1">{deliveryPartners.filter(p => p.isOnline).length} Online Now</p>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4"><Package size={20} className="text-orange-500" /><p className="font-black uppercase tracking-widest text-xs text-gray-400">Pending Pickups</p></div>
          <p className="text-4xl font-black">{orders.filter(o => o.status === 'Confirmed' || o.status === 'Packed').length}</p>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4"><CheckCircle size={20} className="text-green-500" /><p className="font-black uppercase tracking-widest text-xs text-gray-400">Delivered Today</p></div>
          <p className="text-4xl font-black">{orders.filter(o => o.status === 'Delivered' && new Date(o.updatedAt).toDateString() === new Date().toDateString()).length}</p>
        </div>
      </div>
      <div className="glass-card rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800"><h3 className="font-black uppercase tracking-tighter text-lg">Active <span className="text-primary">Partners</span></h3></div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {deliveryPartners.length === 0 ? (
            <div className="py-16 text-center"><p className="text-sm font-black text-gray-400 uppercase tracking-widest">No delivery partners assigned yet.</p></div>
          ) : deliveryPartners.map(p => (
            <div key={p._id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{(p.firstName || 'D')[0]}</div>
                <div>
                  <p className="font-black text-sm uppercase">{p.firstName} {p.lastName}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{p.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${p.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isOnline ? 'Online' : 'Offline'}</span>
                <a href={`tel:${p.mobile}`} className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Phone size={14} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800"><h3 className="font-black uppercase tracking-tighter text-lg">Orders Awaiting <span className="text-primary">Pickup</span></h3></div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {orders.filter(o => ['Confirmed','Packed','Processing'].includes(o.status)).length === 0 ? (
            <div className="py-12 text-center"><p className="text-sm font-black text-gray-400 uppercase tracking-widest">No pending pickups.</p></div>
          ) : orders.filter(o => ['Confirmed','Packed','Processing'].includes(o.status)).map(o => (
            <div key={o._id} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-black text-sm uppercase">Order #{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400 font-bold">{o.user?.firstName} {o.user?.lastName} • ₹{o.totalPrice?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">{o.shippingAddress?.address}, {o.shippingAddress?.city}</p>
              </div>
              <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[8px] font-black uppercase tracking-widest">{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )}

  {/* ── OFFERS & PROMOTIONS ── */}
  {view === 'offers' && (
    <motion.div key="offers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Marketing</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Offers & <span className="text-primary">Promotions</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Discount Builder */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-tighter flex items-center gap-2"><Gift size={20} className="text-primary" /> Set Discount</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Select Product</label>
              <select value={selectedOfferProduct || ''} onChange={e => setSelectedOfferProduct(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
                <option value="">Choose a product...</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Discounted Price (₹)</label>
              <input type="number" value={discountVal} onChange={e => setDiscountVal(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm" placeholder="Enter sale price..." />
            </div>
            {selectedOfferProduct && discountVal && (() => {
              const prod = products.find(p => p._id === selectedOfferProduct);
              const saving = prod ? prod.price - Number(discountVal) : 0;
              const pct = prod ? Math.round((saving / prod.price) * 100) : 0;
              return saving > 0 ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 rounded-2xl">
                  <p className="text-sm font-black text-green-700">🎯 Customer saves ₹{saving} ({pct}% off)</p>
                </div>
              ) : null;
            })()}
            <button onClick={async () => {
              if (!selectedOfferProduct || !discountVal) return toast.error('Select a product and enter discount price');
              const prod = products.find(p => p._id === selectedOfferProduct);
              if (Number(discountVal) >= prod?.price) return toast.error('Discount must be less than original price');
              try {
                await api.put(`/products/${selectedOfferProduct}`, { ...prod, discountPrice: Number(discountVal) });
                toast.success('Discount applied successfully!');
                fetchProducts(); setSelectedOfferProduct(null); setDiscountVal('');
              } catch { toast.error('Failed to apply discount'); }
            }} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Apply Discount</button>
          </div>
        </div>
        {/* Products with active offers */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-tighter flex items-center gap-2"><Percent size={20} className="text-orange-500" /> Active Offers</h3>
          <div className="space-y-4">
            {products.filter(p => p.discountPrice && p.discountPrice < p.price).length === 0 ? (
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-center py-8">No active discounts.</p>
            ) : products.filter(p => p.discountPrice && p.discountPrice < p.price).map(p => (
              <div key={p._id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden"><img src={p.image} className="w-full h-full object-cover" alt="" /></div>
                  <div>
                    <p className="text-xs font-black uppercase truncate w-28">{p.name}</p>
                    <p className="text-[10px] text-gray-400"><span className="line-through">₹{p.price}</span> → <span className="text-green-600 font-black">₹{p.discountPrice}</span></p>
                  </div>
                </div>
                <button onClick={async () => {
                  try { await api.put(`/products/${p._id}`, { ...p, discountPrice: undefined }); toast.success('Offer removed'); fetchProducts(); }
                  catch { toast.error('Failed'); }
                }} className="p-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )}

  {/* ── SUBSCRIPTION ── */}
  {view === 'subscription' && (
    <motion.div key="subscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Plans</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Membership & <span className="text-primary">Subscription</span></h2>
      </div>
      <div className="glass-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
        {/* Current plan status */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"><ShieldCheck size={24} className="text-white" /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white uppercase">{userInfo?.subscriptionLevel || 'Basic'}</p>
              {userInfo?.isMember && userInfo?.membershipVault?.cycleEndDate && (
                <p className="text-xs text-primary font-bold mt-1">Renews: {new Date(userInfo.membershipVault.cycleEndDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          {!userInfo?.isMember && (
            <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-black uppercase tracking-widest">Upgrade to unlock all features</span>
          )}
        </div>
        <MembershipUpgradeWidget userInfo={userInfo} />
      </div>
      {/* Membership vault summary */}
      {userInfo?.membershipVault && (
        <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Membership <span className="text-primary">Vault</span></h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Vault Balance', val: `₹${(userInfo.membershipVault.balance || 0).toLocaleString()}` },
              { label: 'Plan Value', val: `₹${(userInfo.membershipVault.planValue || 0).toLocaleString()}` },
              { label: 'Savings This Month', val: `₹${(userInfo.membershipVault.savingsThisMonth || 0).toLocaleString()}` },
              { label: 'Plan Tier', val: userInfo.membershipVault.planTier || 'N/A' },
            ].map(s => (
              <div key={s.label} className="p-5 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )}



 </div>

 {/* Category CMS Modal */}
 <AnimatePresence>
 {isAddingCategory && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md">
 <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-6xl max-h-[90vh] overflow-x-hidden overflow-y-auto bg-white dark:bg-dark-card rounded-[2rem] md:rounded-[3.5rem] shadow-3xl p-6 md:p-10 relative">
 <button onClick={() => { setIsAddingCategory(false); fetchCategories(); }} className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl md:rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10"><X size={20} className="md:w-6 md:h-6" /></button>
 <HomeServiceCMS isVendorMode={true} />
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 <InvoiceModal
    isOpen={!!viewingInvoice}
    onClose={() => setViewingInvoice(null)}
    order={viewingInvoice}
  />

 <Toaster position="bottom-right" reverseOrder={false} />
 </DashboardLayout>
 );
};

const SlotManager = ({ slots, setSlots }) => {
 const [newDate, setNewDate] = useState('');
 const [newTime, setNewTime] = useState('');
 const addDate = () => {
 if (!newDate) return;
 if (slots.find(s => s.date === newDate)) return toast.error('Date already exists');
 setSlots([...slots, { date: newDate, times: [], isAvailable: true }]);
 setNewDate('');
 };
 const addTime = (dateIndex) => {
 if (!newTime) return;
 const updatedSlots = [...slots];
 if (updatedSlots[dateIndex].times.includes(newTime)) return toast.error('Time slot exists');
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
 <div className="p-8 bg-gray-50 dark:bg-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 my-4">
 <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Calendar size={18} className="text-primary" /> Availability Slots</h4>
 <div className="flex gap-4 mb-8">
 <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none font-bold text-sm" />
 <button type="button" onClick={addDate} className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest">Add</button>
 </div>
 <div className="space-y-4">
 {slots.map((slot, dIdx) => (
 <div key={dIdx} className="p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group/date">
 <button type="button" onClick={() => removeDate(dIdx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-opacity"><XCircle size={14} /></button>
 <span className="font-black text-primary uppercase text-[10px] tracking-widest">{new Date(slot.date).toLocaleDateString()}</span>
 <div className="flex flex-wrap gap-2 my-4">
 {slot.times.map((time, tIdx) => (
 <div key={tIdx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg border border-primary/20">
 <span className="text-[9px] font-black">{time}</span>
 <button type="button" onClick={() => removeTime(dIdx, tIdx)} className="text-primary/40 hover:text-red-500"><XCircle size={12} /></button>
 </div>
 ))}
 </div>
 <div className="flex gap-2">
 <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-[10px] font-bold" />
 <button type="button" onClick={() => addTime(dIdx)} className="px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase rounded-lg">Add</button>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};

const PricingRow = ({ product, onSave }) => {
  const [price, setPrice] = useState(product.price || 0);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice || '');
  const [gstPercentage, setGstPercentage] = useState(product.gstPercentage || 18);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    await onSave(product, price, discountPrice, gstPercentage);
    setSaving(false);
  };

  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
      <td className="py-6 pr-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-card p-1 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden shrink-0">
            <img src={product.image} className="w-full h-full object-cover rounded-lg" alt="" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate w-40" title={product.name}>{product.name}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{product.categoryRef?.name || product.category || 'Atomy Product'}</p>
          </div>
        </div>
      </td>
      <td className="py-6">
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.isService ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
          {product.isService ? 'Service' : 'Product'}
        </span>
      </td>
      <td className="py-6 pr-4">
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(Number(e.target.value))}
          className="w-24 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs"
        />
      </td>
      <td className="py-6 pr-4">
        <input 
          type="number" 
          placeholder="None"
          value={discountPrice} 
          onChange={e => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-24 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs"
        />
      </td>
      <td className="py-6 pr-4">
        <select 
          value={gstPercentage} 
          onChange={e => setGstPercentage(Number(e.target.value))}
          className="w-20 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs"
        >
          <option value={0}>0%</option>
          <option value={5}>5%</option>
          <option value={12}>12%</option>
          <option value={18}>18%</option>
          <option value={28}>28%</option>
        </select>
      </td>
      <td className="py-6 text-right">
        <button 
          onClick={handleUpdate}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Sync'}
        </button>
      </td>
    </tr>
  );
};

export default VendorDashboard;

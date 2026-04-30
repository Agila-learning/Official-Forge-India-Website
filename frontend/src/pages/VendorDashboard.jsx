import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LayoutDashboard, ShoppingBag, Package, Users, Star, Plus, Edit, Trash2, LogOut, FileText, CheckCircle, XCircle, Menu, X, Trash, Image, LifeBuoy, Bell, ShieldCheck, Mail, Phone, MapPin, Search, Wrench, Calendar, Clock, ChevronRight, PanelLeftClose, PanelLeftOpen, Tag, Percent, Box, Info, TrendingUp, Settings, User, Sparkles, CheckCircle2 } from 'lucide-react';
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

const VendorDashboard = () => {
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

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

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

    const fetchOrders = async (currentProducts) => {
        try {
            const res = await api.get('/orders');
            const vendorOrders = res.data.filter(order => 
                order.orderItems.some(item => (currentProducts || products).some(p => p._id === item.product))
            );
            setOrders(vendorOrders);
            generateReports(vendorOrders);
        } catch (err) {
            console.error('Failed to load orders');
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            const vendorProducts = data.filter(p => (p.vendorId?._id || p.vendorId) === userInfo?._id);
            setProducts(vendorProducts);
            
            // Generate Stock Report
            const lowStock = vendorProducts.filter(p => !p.isService && p.countInStock < 10);
            setStockReport(lowStock);
            
            fetchOrders(vendorProducts);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch products');
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
        delete data.viewImages_front;
        delete data.viewImages_back;
        delete data.viewImages_top;
        delete data.viewImages_bottom;
        
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
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Business Statistics</p>
                                        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Growth <span className="text-primary italic">Stats</span></h2>
                                    </div>
                                    <div className="px-5 py-2 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl shadow-xl shadow-primary/20 flex flex-col justify-center">
                                        <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">Current Tier</p>
                                        <p className="text-sm font-black text-white uppercase tracking-tighter italic">{userInfo?.subscriptionLevel || 'Basic Node'}</p>
                                    </div>
                                    <div className="px-5 py-2 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl flex flex-col justify-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Shop Code</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">{userInfo?.shopCode || 'PENDING'}</p>
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
                                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                    <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Recent Orders</h3>
                                    <div className="space-y-4">
                                        {orders.slice(0, 5).map(order => (
                                            <div key={order._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                                <div>
                                                    <p className="font-bold text-sm">Ref: #{order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">₹{order.totalPrice} • {order.status}</p>
                                                </div>
                                                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500"><TrendingUp size={18} /></div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && <p className="text-gray-400 font-bold pt-10 text-center italic">No active orders</p>}
                                    </div>
                                </div>
                                <div className="glass-card p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                    <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Inventory Status</h3>
                                    <div className="space-y-4">
                                        {products.slice(0, 5).map(prod => (
                                            <div key={prod._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-card p-1 border border-gray-100 dark:border-gray-800">
                                                        <img src={prod.image} className="w-full h-full object-cover rounded-lg" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm uppercase truncate w-32">{prod.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Stock: {prod.countInStock || 0} • Value: ₹{(prod.price * (prod.countInStock || 0)).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${prod.isService ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
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
                                                <select name="categoryRef" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-sm">
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
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
                                                <button onClick={() => { setEditingProduct(product); setIsAdding(true); }} className="flex-1 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Customize</button>
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

                    {view === 'missions' && (
                        <motion.div key="missions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <div className="grid grid-cols-1 gap-8">
                                {orders.filter(o => o.orderItems.some(i => i.isService)).map(mission => (
                                    <div key={mission._id} className="p-10 bg-white dark:bg-dark-card rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
                                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">Ref: #{mission._id.slice(-6).toUpperCase()}</span>
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${mission.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-dark-bg'}`}>{mission.status}</span>
                                                </div>
                                                <h4 className="text-3xl font-black uppercase tracking-tighter italic mb-2">{mission.orderItems.filter(i => i.isService).map(i => i.name).join(', ')}</h4>
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
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Customer <span className="text-primary italic">Tracking</span></h2>
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
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Business <span className="text-primary italic">Intelligence</span></h2>
                                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 tracking-widest">Growth & Inventory Analytics</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/20 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 text-primary opacity-20 group-hover:scale-125 transition-transform"><TrendingUp size={80} /></div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Total Revenue</p>
                                    <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">₹{salesReport.totalRevenue?.toLocaleString()}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Lifetime Commercial Volume</p>
                                </div>
                                <div className="p-10 bg-yellow-400/5 rounded-[3rem] border border-yellow-400/20 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 text-yellow-500 opacity-20 group-hover:scale-125 transition-transform"><ShoppingBag size={80} /></div>
                                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-4">Total Orders</p>
                                    <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{salesReport.totalOrders}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Success Rate: {salesReport.successRate}%</p>
                                </div>
                                <div className="p-10 bg-red-500/5 rounded-[3rem] border border-red-500/20 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 text-red-500 opacity-20 group-hover:scale-125 transition-transform"><Box size={80} /></div>
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">Low Stock Alerts</p>
                                    <p className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{stockReport.length}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Critical Inventory Levels</p>
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
                                            <button onClick={() => { setEditingProduct(prod); setIsAdding(true); setView('inventory'); }} className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Restock Now</button>
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
                                        <p className="text-sm text-gray-500 italic mb-8">"{ticket.description}"</p>
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
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Profile & <span className="text-primary italic">Settings</span></h2>
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

                    {/* SUBSCRIPTION & BILLING TAB */}
                    {view === 'subscription' && (
                        <motion.div key="subscription" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Account Upgrade</p>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Subscription <span className="text-primary italic">& Billing</span></h2>
                            </div>

                            {/* Current Plan Banner */}
                            <div className="p-6 md:p-10 rounded-[2rem] bg-gradient-to-r from-primary to-indigo-600 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Current Active Plan</p>
                                    <h3 className="text-3xl font-black uppercase">{userInfo?.subscriptionLevel || 'Free'} Tier</h3>
                                    <p className="text-white/70 text-xs font-bold mt-1">{userInfo?.subscriptionLevel === 'Free' ? 'Upgrade to unlock premium features' : 'All features active'}</p>
                                </div>
                                <div className="px-6 py-3 bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">Active</div>
                            </div>

                            {/* Plan Comparison Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                {[
                                    {
                                        name: 'Free', price: '₹0', period: '/month', color: 'gray',
                                        features: ['3 Service Listings', 'Basic Analytics', 'Email Support', 'Standard Visibility'],
                                        current: (userInfo?.subscriptionLevel || 'Free') === 'Free'
                                    },
                                    {
                                        name: 'Basic', price: '₹999', period: '/month', color: 'blue',
                                        features: ['10 Service Listings', 'Order Management', 'Priority Listing', 'Chat Support', 'Monthly Reports'],
                                        current: userInfo?.subscriptionLevel === 'Basic'
                                    },
                                    {
                                        name: 'Premium', price: '₹2,499', period: '/month', color: 'purple',
                                        features: ['Unlimited Listings', 'Advanced Analytics', 'Dedicated Manager', 'Featured Badge', 'Customer Insights', 'API Access'],
                                        current: userInfo?.subscriptionLevel === 'Premium', popular: true
                                    },
                                    {
                                        name: 'Elite', price: '₹4,999', period: '/month', color: 'yellow',
                                        features: ['All Premium features', 'White-label Portal', 'Custom Domain', 'SLA Guarantee', 'Bulk Imports', '24/7 Phone Support'],
                                        current: userInfo?.subscriptionLevel === 'Elite'
                                    }
                                ].map(plan => (
                                    <div key={plan.name} className={`relative glass-card rounded-[2.5rem] border ${plan.current ? 'border-primary shadow-2xl shadow-primary/20 scale-[1.02]' : 'border-gray-100 dark:border-gray-800'} overflow-hidden`}>
                                        {plan.popular && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />}
                                        {plan.popular && <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Popular</div>}
                                        <div className="p-8">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{plan.name}</p>
                                            <div className="flex items-end gap-1 mb-6">
                                                <span className="text-4xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                                                <span className="text-sm font-bold text-gray-400 mb-1">{plan.period}</span>
                                            </div>
                                            <ul className="space-y-2 mb-8">
                                                {plan.features.map(f => (
                                                    <li key={f} className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                        <CheckCircle2 size={14} className="text-primary shrink-0" />{f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                disabled={plan.current}
                                                onClick={async () => {
                                                    try {
                                                        await api.put('/users/profile', { subscriptionLevel: plan.name });
                                                        const updated = { ...userInfo, subscriptionLevel: plan.name };
                                                        localStorage.setItem('userInfo', JSON.stringify(updated));
                                                        toast.success(`Upgraded to ${plan.name} Plan!`);
                                                        window.location.reload();
                                                    } catch { toast.error('Upgrade failed'); }
                                                }}
                                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${plan.current ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20'}`}
                                            >
                                                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ALERTS TAB */}
                    {view === 'alerts' && (
                        <motion.div key="alerts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Notifications</p>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Activity <span className="text-primary italic">Alerts</span></h2>
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

                    {/* INSIGHTS & REPORTS TAB */}
                    {view === 'insights' && (
                        <motion.div key="insights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Analytics</p>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-poppins">Reports & <span className="text-primary italic">Insights</span></h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Revenue', value: `₹${salesReport.totalRevenue.toLocaleString()}`, sub: 'All time', icon: TrendingUp, color: 'primary' },
                                    { label: 'Total Orders', value: salesReport.totalOrders, sub: 'All time', icon: ShoppingBag, color: 'indigo' },
                                    { label: 'Delivery Rate', value: `${salesReport.successRate}%`, sub: 'Success', icon: CheckCircle2, color: 'green' },
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
                    </AnimatePresence>

            </div>

            {/* Category CMS Modal */}
            <AnimatePresence>
                {isAddingCategory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card rounded-[3.5rem] shadow-3xl p-10 relative">
                            <button onClick={() => { setIsAddingCategory(false); fetchCategories(); }} className="absolute top-10 right-10 p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><X size={24} /></button>
                            <HomeServiceCMS isVendorMode={true} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default VendorDashboard;

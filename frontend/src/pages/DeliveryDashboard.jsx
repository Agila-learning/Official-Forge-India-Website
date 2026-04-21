import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Clock, LogOut, Package, Navigation, AlertTriangle, Edit, LayoutDashboard, Users, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RoleDashboardProfile from '../components/ui/RoleDashboardProfile';
import DashboardLayout from '../components/layout/DashboardLayout';

const DeliveryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [view, setView] = useState(location.state?.view || 'overview'); // 'overview' | 'tasks' | 'profile'
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [dashboardStats, setDashboardStats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
        fetchOrders();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            const data = Array.isArray(res.data) ? res.data : [];
            const myTasks = data.filter(t => (t.assignedTo?._id || t.assignedTo) === userInfo?._id);
            setTasks(myTasks);
        } catch (err) {
            console.warn('Tasks fetch failed');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            const data = Array.isArray(res.data) ? res.data : [];
            const myOrders = data.filter(o => (o.deliveryPartner?._id || o.deliveryPartner) === userInfo?._id);
            setOrders(myOrders);
        } catch (err) {
            console.warn('Orders fetch failed');
            setOrders([]);
        }
    };

    useEffect(() => {
        if (tasks.length > 0) {
            const completed = tasks.filter(t => t.status === 'Completed').length;
            const efficiency = tasks.length > 0 ? ((completed / tasks.length) * 100).toFixed(1) : '0';
            setDashboardStats({
                routes: completed,
                avgTime: '42 min',
                fleetStatus: 'Operational',
                rating: '4.8/5'
            });
        }
    }, [tasks]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData.entries());
        try {
            const { data } = await api.put('/users/profile', profileData);
            const updatedInfo = { ...userInfo, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
            setUserInfo(updatedInfo);
            toast.success('Profile updated successfully!');
            setView('tasks');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const stats = {
        total: tasks.length,
        delivered: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status === 'In Progress').length,
        assigned: tasks.filter(t => !t.status || t.status === 'Assigned').length,
        earnings: tasks.filter(t => t.status === 'Completed').length * 45 // Mock commission
    };

    return (
        <DashboardLayout activeTab={view} setActiveTab={setView} stats={dashboardStats} themeColor="orange-500">
            <div className="space-y-12">
                <AnimatePresence mode="wait">
                    {view === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <RoleDashboardProfile user={userInfo} stats={dashboardStats} />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Live Shipments</h3>
                                        <div className="space-y-4">
                                            {tasks.slice(0, 5).map(task => (
                                                <div key={task._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                                    <div>
                                                        <p className="font-bold text-sm uppercase">{task.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Location: {task.location}</p>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {task.status || 'Assigned'}
                                                    </span>
                                                </div>
                                            ))}
                                            {tasks.length === 0 && <p className="text-gray-400 font-bold pt-10 text-center italic">No active deployments</p>}
                                        </div>
                                    </div>
                                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center flex flex-col justify-center items-center">
                                        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/10 rounded-full flex items-center justify-center text-orange-500 mb-6">
                                            <Package size={48} />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Fleet Ready</h3>
                                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Precision Delivery Excellence</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === 'orders' && (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 gap-6">
                                    {orders.length > 0 ? orders.map(order => (
                                        <div key={order._id} className="glass-card p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                                            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 pb-8 border-b border-gray-50 dark:border-gray-800">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order ID: {order._id}</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{order.user?.firstName} {order.user?.lastName}</h3>
                                                    <p className="text-sm font-bold text-gray-400 uppercase">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-primary mb-1">₹{order.totalPrice}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 mb-8">
                                                {order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl">
                                                        <div className="flex items-center gap-4">
                                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                                                            <div>
                                                                <p className="font-bold text-sm uppercase">{item.name}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.qty} • ₹{item.price}</p>
                                                            </div>
                                                        </div>
                                                        {item.slot && (
                                                            <div className="text-right bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">Pickup/Svc Date</p>
                                                                <p className="text-sm font-bold text-primary">{item.slot.date} {item.slot.time && `at ${item.slot.time}`}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            await api.put(`/orders/${order._id}/status`, { status: 'Delivered' });
                                                            toast.success('Mission Accomplished!');
                                                            fetchOrders();
                                                            // Logic for review link
                                                            const reviewLink = `${window.location.origin}/review/${order._id}`;
                                                            if (navigator.share) {
                                                                navigator.share({
                                                                    title: 'FIC Service Review',
                                                                    text: 'Please rate our service excellence.',
                                                                    url: reviewLink
                                                                }).catch(() => toast('Review Link: ' + reviewLink));
                                                            } else {
                                                                toast('Review Link Generated: ' + reviewLink);
                                                            }
                                                        } catch (err) { toast.error('Status sync failed'); }
                                                    }}
                                                    className={`flex-1 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02]'}`}
                                                    disabled={order.status === 'Delivered'}
                                                >
                                                    {order.status === 'Delivered' ? <><CheckCircle2 size={18} /> Mission Completed</> : <><Package size={18} /> Finalize & Collect Review</>}
                                                </button>
                                                
                                                {order.status === 'Delivered' && (
                                                    <button 
                                                        onClick={() => {
                                                            const reviewLink = `${window.location.origin}/review/${order._id}`;
                                                            navigator.clipboard.writeText(reviewLink);
                                                            toast.success('Review link copied to clipboard');
                                                        }}
                                                        className="px-8 py-5 bg-white dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-all"
                                                    >
                                                        Resend Link
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-32 bg-gray-50 dark:bg-dark-bg rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                            <Package className="mx-auto text-gray-300 mb-6" size={64} />
                                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">No Orders Found</h3>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Customer bookings will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {view === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
                                <div className="glass-card p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-3xl text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-10 rotate-12">
                                            <ShieldCheck size={48} />
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">Delivery Agent <span className="text-orange-500">Profile</span></h3>
                                        <p className="text-lg text-gray-500 font-medium mb-12">Authorized Logistics Personnel Only</p>
                                        
                                        <form onSubmit={updateProfile} className="space-y-8 text-left max-w-2xl mx-auto mb-12">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                                    <input name="firstName" defaultValue={userInfo?.firstName} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                                    <input name="lastName" defaultValue={userInfo?.lastName} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Info</label>
                                                <input name="mobile" defaultValue={userInfo?.mobile} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fleet Vehicle info</label>
                                                    <input name="vehicleDetails" defaultValue={userInfo?.vehicleDetails} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">License Hash</label>
                                                    <input name="licenseNumber" defaultValue={userInfo?.licenseNumber} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg outline-none font-bold text-xs uppercase" />
                                                </div>
                                            </div>
                                            <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all">Authorize Identity Sync</button>
                                        </form>

                                        <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Delivery Status</p>
                                            <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                                                "As a Delivery Specialist, you are the final link in the Forge India Connect value chain. Your precision ensures our promise of excellence is delivered to every doorstep."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default DeliveryDashboard;

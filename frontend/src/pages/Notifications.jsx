import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
 Bell, ShoppingBag, CreditCard, Truck, Star, Info,
 CheckCheck, Trash2, RefreshCw, ChevronRight, Filter
} from 'lucide-react';
import api from '../services/api';
import SEOMeta from '../components/ui/SEOMeta';

const TYPE_META = {
 order: { icon: ShoppingBag, color: 'bg-blue-500', label: 'Order' },
 payment: { icon: CreditCard, color: 'bg-emerald-500', label: 'Payment' },
 delivery: { icon: Truck, color: 'bg-amber-500', label: 'Delivery'},
 membership: { icon: Star, color: 'bg-violet-500', label: 'Member' },
 default: { icon: Bell, color: 'bg-slate-500', label: 'General' },
};

const getTypeMeta = (type = '') => TYPE_META[type.toLowerCase()] || TYPE_META.default;

const timeAgo = (dateStr) => {
 const diff = (Date.now() - new Date(dateStr)) / 1000;
 if (diff < 60) return 'Just now';
 if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
 if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
 return `${Math.floor(diff / 86400)}d ago`;
};

const Notifications = () => {
 const [notifications, setNotifications] = useState([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState('all');
 const [marking, setMarking] = useState(false);

 const fetchNotifications = useCallback(async () => {
 setLoading(true);
 try {
 const { data } = await api.get('/notifications');
 setNotifications(data || []);
 } catch {
 setNotifications([]);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

 const markAllRead = async () => {
 setMarking(true);
 try {
 await api.put('/notifications/mark-all-read');
 setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
 } catch { /* silent */ } finally {
 setMarking(false);
 }
 };

 const markOne = async (id) => {
 try {
 await api.put(`/notifications/${id}/read`);
 setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
 } catch { /* silent */ }
 };

 const types = ['all', ...new Set(notifications.map(n => (n.type || 'default').toLowerCase()))];

 const filtered = filter === 'all'
 ? notifications
 : notifications.filter(n => (n.type || 'default').toLowerCase() === filter);

 const unreadCount = notifications.filter(n => !n.isRead).length;

 return (
 <>
 <SEOMeta
 title="Notifications | Forge India Connect"
 description="View your Forge India Connect notification history — orders, payments, deliveries, and membership updates."
 canonical="/notifications"
 />

 <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20 px-4">
 <div className="max-w-3xl mx-auto">

 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: -16 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex items-center justify-between mb-8"
 >
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
 Notifications
 </h1>
 {unreadCount > 0 && (
 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
 <span className="font-bold text-primary">{unreadCount}</span> unread
 </p>
 )}
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={fetchNotifications}
 className="p-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors shadow-sm"
 title="Refresh"
 >
 <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
 </button>
 {unreadCount > 0 && (
 <button
 onClick={markAllRead}
 disabled={marking}
 className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-colors"
 >
 <CheckCheck size={14} />
 Mark All Read
 </button>
 )}
 </div>
 </motion.div>

 {/* Filter Pills */}
 {types.length > 1 && (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.05 }}
 className="flex flex-wrap gap-2 mb-6"
 >
 {types.map(t => (
 <button
 key={t}
 onClick={() => setFilter(t)}
 className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
 filter === t
 ? 'bg-primary text-white shadow-lg shadow-primary/25'
 : 'bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/40'
 }`}
 >
 <Filter size={10} />
 {t}
 </button>
 ))}
 </motion.div>
 )}

 {/* Notification List */}
 {loading ? (
 <div className="space-y-4">
 {[...Array(5)].map((_, i) => (
 <div key={i} className="h-20 rounded-2xl bg-white dark:bg-dark-card animate-pulse" />
 ))}
 </div>
 ) : filtered.length === 0 ? (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center py-24 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-slate-800"
 >
 <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
 <Bell size={32} className="text-slate-300" />
 </div>
 <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">All Clear</h3>
 <p className="text-slate-400 text-sm font-medium">No notifications in this category yet.</p>
 </motion.div>
 ) : (
 <AnimatePresence>
 <div className="space-y-3">
 {filtered.map((notif, i) => {
 const meta = getTypeMeta(notif.type);
 const Icon = meta.icon;
 return (
 <motion.div
 key={notif._id}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ delay: i * 0.04 }}
 onClick={() => !notif.isRead && markOne(notif._id)}
 className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
 notif.isRead
 ? 'bg-white dark:bg-dark-card border-slate-100 dark:border-slate-800'
 : 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30'
 }`}
 >
 {/* Unread dot */}
 {!notif.isRead && (
 <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
 )}

 {/* Icon */}
 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white ${meta.color}`}>
 <Icon size={18} />
 </div>

 {/* Content */}
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-4">
 <p className={`text-sm font-bold leading-snug ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
 {notif.title}
 </p>
 <span className="text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
 {timeAgo(notif.createdAt)}
 </span>
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
 {notif.message}
 </p>
 {notif.link && (
 <Link
 to={notif.link}
 onClick={e => e.stopPropagation()}
 className="inline-flex items-center gap-1 mt-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all"
 >
 View Details <ChevronRight size={10} />
 </Link>
 )}
 </div>
 </motion.div>
 );
 })}
 </div>
 </AnimatePresence>
 )}

 {/* Back Link */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.3 }}
 className="mt-10 text-center"
 >
 <Link
 to="/profile"
 className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors font-bold"
 >
 ← Back to Profile
 </Link>
 </motion.div>
 </div>
 </div>
 </>
 );
};

export default Notifications;

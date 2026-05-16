import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { SOCKET_URL, SOCKET_PATH, SOCKET_TRANSPORTS } from '../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { X, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
 const [notifications, setNotifications] = useState([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const [loading, setLoading] = useState(true);
 const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo') || 'null'));

 // Synchronize userInfo state with localStorage changes (login/logout)
 useEffect(() => {
 const handleStorageChange = () => {
 setUserInfo(JSON.parse(localStorage.getItem('userInfo') || 'null'));
 };
 window.addEventListener('storage', handleStorageChange);
 // Also check periodically or on a custom event if needed, but storage event works for cross-tab.
 // For same-tab, we can manually trigger this after login.
 return () => window.removeEventListener('storage', handleStorageChange);
 }, []);

 const fetchNotifications = async () => {
 if (!userInfo) {
 setLoading(false);
 return;
 }
 try {
 const { data } = await api.get('/notifications');
 setNotifications(data);
 setUnreadCount(data.filter(n => !n.isRead).length);
 } catch (err) {
 console.error('Failed to fetch notifications:', err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchNotifications();

 // Socket.io integration for real-time notifications
 if (userInfo) {
 const isProd = window.location.hostname !== 'localhost';
 const socket = io(SOCKET_URL, {
 withCredentials: true,
 path: SOCKET_PATH,
 transports: SOCKET_TRANSPORTS,
 reconnection: true,
 reconnectionAttempts: 5,
 reconnectionDelay: 5000,
 timeout: 30000
 });

 socket.emit('user-online', userInfo._id);

 socket.on('new-notification', (notification) => {
 setNotifications(prev => [notification, ...prev]);
 setUnreadCount(prev => prev + 1);
 
 toast((t) => (
 <div className="flex items-start gap-4 min-w-[300px] py-1">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
 <Bell size={18} />
 </div>
 <div className="flex-1 flex flex-col gap-1">
 <span className="font-black text-[11px] uppercase tracking-tighter text-gray-900 dark:text-white leading-tight">
 {notification.title}
 </span>
 <span className="text-[10px] font-bold text-gray-500 uppercase leading-snug">
 {notification.message}
 </span>
 </div>
 <button 
 onClick={() => toast.dismiss(t.id)}
 className="p-1 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors group"
 >
 <X size={14} className="text-gray-400 group-hover:text-red-500" />
 </button>
 </div>
 ), { 
 duration: 5000,
 style: {
 borderRadius: '1.5rem',
 background: 'rgba(255, 255, 255, 0.95)',
 backdropFilter: 'blur(10px)',
 border: '1px solid rgba(0,0,0,0.05)',
 padding: '12px 16px'
 }
 });
 });

 socket.on('connect_error', (err) => {
 console.warn('FIC Socket Signal Error:', err.message);
 });

 return () => socket.disconnect();
 }
 }, [userInfo?._id]);

 const markAsRead = async (id) => {
 try {
 await api.put(`/notifications/${id}/read`);
 setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
 setUnreadCount(prev => Math.max(0, prev - 1));
 } catch (err) {
 toast.error('Failed to update notification');
 }
 };

 const markAllAsRead = async () => {
 if (!userInfo) return;
 try {
 await api.put('/notifications/read-all');
 setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
 setUnreadCount(0);
 toast.success('Clearance authorized. All signals acknowledged.');
 } catch (err) {
 console.error('Clear All Failed:', err);
 // Fallback: Try marking individually if bulk fails
 notifications.forEach(n => !n.isRead && markAsRead(n._id));
 }
 };

 const pushLocalNotification = (notification) => {
 const newNotif = {
 _id: `local_${Date.now()}`,
 title: notification.title,
 message: notification.message,
 createdAt: new Date().toISOString(),
 isRead: false,
 type: notification.type || 'info',
 ...notification
 };
 setNotifications(prev => [newNotif, ...prev]);
 setUnreadCount(prev => prev + 1);
 };

 return (
 <NotificationContext.Provider value={{ 
 notifications, 
 unreadCount, 
 loading, 
 markAsRead, 
 markAllAsRead, 
 fetchNotifications,
 pushLocalNotification 
 }}>
 {children}
 </NotificationContext.Provider>
 );
};

export const useNotifications = () => useContext(NotificationContext);

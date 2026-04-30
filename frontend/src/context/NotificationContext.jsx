import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { X, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    const fetchNotifications = async () => {
        if (!userInfo) return;
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Socket.io integration for real-time notifications
        if (userInfo) {
            const socketUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5001' 
                : window.location.origin; // Vercel proxy will handle /socket.io correctly over HTTPS
            
            const socket = io(socketUrl, {
                withCredentials: true,
                path: '/socket.io',
                transports: ['polling']
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
        try {
            // Backend endpoint for markAllAsRead (assuming it exists or will be added)
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('Clearance authorized. All signals acknowledged.');
        } catch (err) {
            // Fallback if endpoint doesn't exist yet
            notifications.forEach(n => !n.isRead && markAsRead(n._id));
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);

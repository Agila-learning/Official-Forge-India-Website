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
  const [socket, setSocket] = useState(null);

  // Synchronize userInfo state with localStorage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo') || 'null'));
    };
    window.addEventListener('storage', handleStorageChange);
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

  const showToast = (title, message) => {
    toast((t) => (
      <div className="flex items-start gap-4 min-w-[300px] py-1">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Bell size={18} />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-black text-[11px] uppercase tracking-tighter text-gray-900 dark:text-white leading-tight">
            {title}
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase leading-snug">
            {message}
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

  useEffect(() => {
    fetchNotifications();

    if (userInfo) {
      const socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        path: SOCKET_PATH,
        transports: SOCKET_TRANSPORTS,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        timeout: 30000
      });

      setSocket(socketInstance);

      // Register user room for targeted notifications
      socketInstance.emit('user-online', userInfo._id);

      // ─── DB-backed notification (works for all types) ─────────────────────
      socketInstance.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(notification.title, notification.message);
      });

      // ─── Ride request received by DRIVER ──────────────────────────────────
      socketInstance.on('new_ride_request', (reqData) => {
        const role = JSON.parse(localStorage.getItem('userInfo') || '{}').role;
        if (!['Driver', 'Delivery Partner', 'Ride Provider'].includes(role)) return;
        const localNotif = {
          _id: `local_req_${Date.now()}`,
          title: '🚖 New Ride Request!',
          message: `${reqData.vehicleType || reqData.serviceType} from ${(reqData.pickupAddress || reqData.pickupDetails?.location || 'Pickup').split(',')[0]}`,
          isRead: false,
          type: 'Ride',
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [localNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(localNotif.title, localNotif.message);
      });

      // ─── Ride accepted notification for CUSTOMER ──────────────────────────
      socketInstance.on('ride_accepted', (ride) => {
        const driverName = ride.rideMetadata?.driverName || 'Your driver';
        const otp = ride.rideMetadata?.otp;
        const localNotif = {
          _id: `local_accepted_${Date.now()}`,
          title: '✅ Driver Accepted!',
          message: `${driverName} is on the way. OTP: ${otp}`,
          isRead: false,
          type: 'Ride',
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [localNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success(`${driverName} accepted your ride! 🚗 OTP: ${otp}`, { duration: 8000 });
      });

      // ─── Generic ride status update ──────────────────────────────────────
      socketInstance.on('ride_status_update', (data) => {
        const localNotif = {
          _id: `local_status_${Date.now()}`,
          title: '📍 Ride Update',
          message: data.message || `Ride status: ${data.status}`,
          isRead: false,
          type: 'Ride',
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [localNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(localNotif.title, localNotif.message);
      });

      socketInstance.on('connect_error', (err) => {
        console.warn('FIC Socket Signal Error:', err.message);
      });

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    } else {
      setSocket(null);
    }
  }, [userInfo?._id]);

  const markAsRead = async (id) => {
    try {
      // Skip API call for local/temporary notification IDs
      if (String(id).startsWith('local_')) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }
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
      toast.success('All notifications cleared.');
    } catch (err) {
      console.error('Clear All Failed:', err);
      notifications.forEach(n => !n.isRead && markAsRead(n._id));
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      fetchNotifications,
      pushLocalNotification,
      socket
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

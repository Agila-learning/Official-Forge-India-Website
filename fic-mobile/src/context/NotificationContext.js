import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

const isWeb = Platform.OS === 'web';
const SOCKET_URL = isWeb ? 'http://localhost:5001' : 'http://10.142.82.7:5001';

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    const newSocket = io(SOCKET_URL, {
      path: '/api/fic-socket/',
      transports: ['websocket', 'polling'],
      query: { userId: user._id }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Trigger a native system alert for real-time visibility
      Alert.alert(
        'New Notification', 
        notification.message || 'You have a new update.',
        [{ text: 'View' }]
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ socket, notifications, unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

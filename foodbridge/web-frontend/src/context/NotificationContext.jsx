import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
            setSocket(newSocket);

            newSocket.emit('join', user._id);

            newSocket.on('notification', (notif) => {
                setNotifications(prev => [notif, ...prev]);
                showPushNotification(notif.title, notif.message);
            });

            return () => newSocket.close();
        }
    }, [user]);

    const requestPermission = async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }
        return true;
    };

    const showPushNotification = (title, body) => {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body,
                icon: '/logo.avif' // Adjust path if needed
            });
        }
    };

    return (
        <NotificationContext.Provider value={{ socket, notifications, requestPermission }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);

import React, { useState, useEffect } from 'react';
import '../styles/NotificationBell.css';

const NotificationBell = ({ courses, studentId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // TODO: Replace with actual API call
        const dummyNotifications = [
            {
                id: 1,
                message: "New assessment available",
                timestamp: new Date(),
                read: false
            }
        ];
        setNotifications(dummyNotifications);
    }, [courses, studentId]);

    return (
        <div className="notification-bell-container">
            <div 
                className="bell-icon"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                🔔
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </div>
            
            {showNotifications && notifications.length > 0 && (
                <div className="notifications-dropdown">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                            <p>{notification.message}</p>
                            <small>{notification.timestamp.toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
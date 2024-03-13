import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from './Context';
import NotificationItem from './NotificationItem';


const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewestNotifications, setShowNewestNotifications] = useState(false)
  const { notifications, setNotifications } = useGlobalState();
  const notificationCount = notifications.length;
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="notifications-container">
      <div className="left-content">
        <h1>{showNewestNotifications ? (notifications[notifications.length - 1].message) : null}</h1>
      </div>
      <FontAwesomeIcon icon={faBell} size="2x" onClick={toggleNotifications} />
      {notificationCount > 0 && (
        <span className="notification-count">{notificationCount}</span>
      )}
      {showNotifications ? (
        notifications.length === 0 ? (
        <div className="notification-list">
            <h1 className='no-notifications'>No new notifications</h1>
        </div>
        ) : (
        <div className="notification-list">
            {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
        )
        ) : null}
        </div>
    );
};

export default Notifications;
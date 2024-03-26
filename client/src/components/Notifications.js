import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from './Context';
import NotificationItem from './NotificationItem';


const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [newestNotification, setNewestNotification] = useState(null)
  const { notifications, setNotifications } = useGlobalState();
  const notificationCount = notifications.length;
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  useEffect(() => {
    if (notifications.length > 0) {
      setNewestNotification(notifications[notifications.length - 1]);

      const timeoutId = setTimeout(() => {
        setNewestNotification(null);
      }, 60000);

      return () => clearTimeout(timeoutId);
    }
  }, [notifications]);

  return (
    <div className="notifications-container">
      <div className="left-content">
          <h1>{newestNotification ? (<p className='notification-item'>{newestNotification.title}</p>) : null}</h1>
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
            {notifications.slice().reverse().map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
        )
        ) : null}
        </div>
    );
};

export default Notifications;
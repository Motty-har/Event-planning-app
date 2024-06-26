import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from './Context';
import NotificationItem from './NotificationItem';


const Notifications = () => {
  const { notifications, newestNotification, setNewestNotification,showNotifications, setShowNotifications } = useGlobalState();
  const notificationCount = notifications.length;
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNewestNotification(null);
    }, 60000);
    return () => clearTimeout(timeoutId);
  }, [newestNotification]);

  return (
    <div className="notifications-container">
      {newestNotification ?
      (<div className="new-notification">
          <NotificationItem key={newestNotification.id} notification={newestNotification} newNotification={true}/>
      </div>) : null}
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
                <NotificationItem key={notification.id} notification={notification} newNotification={false}/>
            ))}
        </div>
        )
        ) : null}
        </div>
    );
};

export default Notifications;
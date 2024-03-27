import React from 'react';

const NotificationItem = ({ notification, onClose, newNotification }) => {
  return (
    <div className= {newNotification ? "new-notification-item" : "notification-item"}>
      <button className="close-button" onClick={onClose}>X</button>
      <p>{notification.host.first_name} {notification.host.last_name} has invited you to "{notification.title}"</p>
    </div>
  );
};

export default NotificationItem;
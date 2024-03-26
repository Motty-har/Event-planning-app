import React from 'react';

const NotificationItem = ({ notification }) => {
  console.log()
  return (
    <div className="notification-item">
      <p>{notification.host.first_name} {notification.host.last_name} has invited you to {notification.title}!</p>
    </div>
  );
};

export default NotificationItem;
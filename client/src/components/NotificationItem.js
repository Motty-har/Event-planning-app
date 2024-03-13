import React from 'react';

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <p>{notification}</p>
    </div>
  );
};

export default NotificationItem;
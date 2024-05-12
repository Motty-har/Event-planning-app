import React from 'react';
import { useGlobalState } from './Context';
import { useHistory } from 'react-router-dom';

function NotificationItem ({ notification, newNotification }) {
  const { notifications, setNotifications, setNewestNotification, setShowNotifications } = useGlobalState();
  const history = useHistory();

  function onNotificationClick(){
    setNotifications(notifications.filter((event) => event.id !== notification.id));
    setShowNotifications(false);
    fetch(`/delete_notification/${notification.id}`, {
      method: 'DELETE',
    })
    history.push(`/upcoming-event/${notification.id}`);
  }
  function onClose(notification){
    if (newNotification) {
      setNewestNotification(null);
    } else {
      fetch(`/delete_notification/${notification.id}`, {
        method: 'DELETE',
      })
      setNotifications(
        notifications.filter((event) => {
          if (event.id !== notification.id) {
            return true; 
          } else {
            return false;
          }
        })
      );
    }
  }
  return (
    <div className={newNotification ? "new-notification-item" : "notification-item"}>
      <p>{notification.host.first_name} {notification.host.last_name} has invited you to "{notification.title}"</p>
      <button className="view-event-button" onClick={() => onNotificationClick()}>View Event</button>
      <button className="close-button" onClick={() => onClose(notification)}>X</button>
    </div>
  );
};

export default NotificationItem;

import React from 'react';
import { useGlobalState } from './Context';
import { useHistory } from 'react-router-dom';

function NotificationItem ({ notification, newNotification }) {
  const { notifications, setNotifications, setNewestNotification, setShowNotifications } = useGlobalState();
  const history = useHistory();

  function onNotificationClick(){
    setNotifications(notifications.filter((event) => event.id !== notification.event.id));
    setShowNotifications(false);
    history.push(`/upcoming-event/${notification.event.id}`);
  }

  function onClose(notification){
    console.log(notification)
    if (newNotification) {
      setNewestNotification(null);
    } else {
      setNotifications(
        notifications.filter((event) => {
          if (event.event.id !== notification.event.id) {
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
      <p>{notification.event.host.first_name} {notification.event.host.last_name} has invited you to "{notification.event.title}"</p>
      <button className="view-event-button" onClick={() => onNotificationClick()}>View Event</button>
      <button className="close-button" onClick={() => onClose(notification)}>X</button>
    </div>
  );
};

export default NotificationItem;

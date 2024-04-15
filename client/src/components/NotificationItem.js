import React from 'react';
import { useGlobalState } from './Context';
import { useHistory } from 'react-router-dom';

function NotificationItem ({ notification, newNotification }) {
  const { notifications, setNotifications, newestNotification, setNewestNotification, showNotifications, setShowNotifications } = useGlobalState();
  const history = useHistory()
  function onNotificationClick(){
    setNotifications(notifications.filter((event) => {
      return event.id !== notification.id}))
      setShowNotifications(false)
    history.push(`/upcoming-event/${notification.event.id}`);
  }
  function onClose(){
    newNotification ? (
      setNewestNotification(null)
    ) : (
      setNotifications(notifications.filter((event) => {
        return event.id !== notification.id}))
    )
  }
  return (
    <div className= {newNotification ? "new-notification-item" : "notification-item"}>
      <button className="close-button" onClick={() => onClose()}>X</button>
      <p>{notification.event.host.first_name} {notification.event.host.last_name} has invited you to "{notification.event.title}"</p>
      <button onClick={() => onNotificationClick()}>View Event</button>
    </div>
  );
};

export default NotificationItem;
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: 1,
    type: 'info',
    content: 'You have a new message from the Hiking Group!',
    timestamp: '2025-08-26T10:00:00Z',
    read: false,
  },
  {
    id: 2,
    type: 'event',
    content: 'New event added: Mountain Trek this weekend.',
    timestamp: '2025-08-25T15:30:00Z',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    content: 'Your profile update was successful.',
    timestamp: '2025-08-24T09:20:00Z',
    read: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);


  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

 
  const addNotification = (type, content) => {
    const newNotification = {
      id: notifications.length + 1,
      type,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
  };


  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
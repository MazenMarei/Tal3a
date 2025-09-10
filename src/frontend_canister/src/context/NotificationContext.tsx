import { createContext, useContext, ReactNode } from "react";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  addNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
  addNotification: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const notifications: Notification[] = [];

  const markAsRead = (id: string) => {
    // Stub implementation
  };

  const addNotification = (message: string) => {
    // Stub implementation
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

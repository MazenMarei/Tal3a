import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationCard = () => {
  const { notifications, markAsRead } = useNotifications();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const notificationItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12
      }
    }
  };

  // Updated styles for light green and white theme
  const typeStyles = {
    info: { bg: 'bg-green-50', text: 'text-green-700', hoverBg: 'hover:bg-green-100' },
    event: { bg: 'bg-green-50', text: 'text-green-700', hoverBg: 'hover:bg-green-100' },
    alert: { bg: 'bg-green-50', text: 'text-green-700', hoverBg: 'hover:bg-green-100' },
  };

  return (
    <div className="min-h-screen bg-white-50 flex items-center justify-center p-8">
      <motion.div
        className="max-w-3xl w-full bg-white rounded-xl shadow-2xl border border-green-100 p-8"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
          <Bell className="h-8 w-8 text-green-700 mr-3" />
          Notifications
        </h1>
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              className="text-center text-green-400 text-lg py-12"
              variants={notificationItemVariants}
            >
              No notifications available
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`flex items-center justify-between p-6 mb-6 rounded-lg border border-green-100 ${
                  notification.read ? 'opacity-75' : ''
                } ${typeStyles[notification.type]?.bg || 'bg-green-50'} ${
                  typeStyles[notification.type]?.hoverBg || 'hover:bg-green-100'
                } transition-colors cursor-pointer`}
                variants={notificationItemVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-center space-x-4">
                  <Bell className={`h-7 w-7 ${typeStyles[notification.type]?.text || 'text-green-700'}`} />
                  <div>
                    <p className={`text-lg font-medium ${typeStyles[notification.type]?.text || 'text-green-700'}`}>
                      {notification.content}
                    </p>
                    <p className="text-sm text-green-600">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {!notification.read && (
                    <motion.button
                      className="text-green-700 hover:text-green-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <CheckCircle className="h-7 w-7" />
                    </motion.button>
                  )}
                  <Link
                    to="/notifications"
                    className={`text-base font-medium ${typeStyles[notification.type]?.text || 'text-green-700'} hover:underline`}
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NotificationCard;
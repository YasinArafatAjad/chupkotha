import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { markNotificationsAsRead } from '../../lib/services/notificationService';
import NotificationBadge from '../common/NotificationBadge';
import NotificationItem from '../common/NotificationItem';
import Logo from './Logo';
import toast from 'react-hot-toast';

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser } = useAuth();
  const { notifications, markAsRead } = useNotifications();

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications && notifications.length > 0 && currentUser) {
      try {
        await markNotificationsAsRead(currentUser.uid);
        markAsRead(); // Update local state
      } catch (error) {
        console.error('Error marking notifications as read:', error);
        toast.error('Failed to update notifications');
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 border-b dark:border-gray-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <NotificationBadge count={notifications.length} />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={() => setShowNotifications(false)}
                      />
                    ))
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
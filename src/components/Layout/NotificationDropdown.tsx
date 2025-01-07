import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Notification } from '../../lib/services/notificationService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export default function NotificationDropdown({ notifications, onClose }: NotificationDropdownProps) {
  if (notifications.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {notifications.map((notification) => (
        <Link
          key={notification.id}
          to={`/post/${notification.postId}`}
          className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0"
          onClick={onClose}
        >
          <LazyLoadImage effect="blur"
            src={notification.senderPhoto}
            alt={notification.senderName}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm">
              <span className="font-semibold">{notification.senderName}</span>
              {' '}
              {notification.type === 'like' ? 'liked your post' : 'commented on your post'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
            </p>
          </div>
          {notification.type === 'like' ? (
            <Heart className="w-5 h-5 -mt-2 text-red-500" fill="currentColor" />
          ) : (
            <MessageCircle className="w-5 h-5 -mt-2 text-primary" />
          )}
        </Link>
      ))}
    </motion.div>
  );
}
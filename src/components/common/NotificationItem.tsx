import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Notification } from '../../lib/services/notificationService';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" fill="currentColor" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-primary" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-green-500" />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'share':
        return 'shared your post';
    }
  };

  return (
    <Link
      to={`/post/${notification.postId}`}
      onClick={onClose}
      className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0"
    >
      <img
        src={notification.senderPhoto}
        alt={notification.senderName}
        className="w-10 h-10 rounded-full"
      />
      <div className="ml-3 flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.senderName}</span>
          {' '}
          {getMessage()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
        </p>
      </div>
      {getIcon()}
    </Link>
  );
}
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Notification } from '../../lib/services/notificationService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
      case 'follow':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      default:
        return null;
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
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  const getLink = () => {
    if (notification.type === 'follow') {
      return `/profile/${notification.senderId}`;
    }
    return `/post/${notification.postId}`;
  };

  return (
    <Link
      to={getLink()}
      onClick={onClose}
      className="flex items-center justify-between pr-4 "
    >
      <div className="flex items-center  p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0">
        <LazyLoadImage effect="blur"
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
      </div>
      <span className="ml-6" >{getIcon()}</span>
    </Link>
  );
}
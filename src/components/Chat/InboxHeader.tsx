import { useState } from 'react';
import { Settings, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithFallback from '../common/ImageWithFallback';

interface InboxHeaderProps {
  user: {
    id: string;
    name: string;
    photoURL: string;
    lastSeen?: Date;
    isOnline?: boolean;
  };
  unreadCount?: number;
  onSettingsClick?: () => void;
}

export default function InboxHeader({ user, unreadCount = 0, onSettingsClick }: InboxHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusText = () => {
    if (user.isOnline) return 'Online';
    if (user.lastSeen) {
      const lastSeen = new Date(user.lastSeen);
      return `Last seen ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'Offline';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <ImageWithFallback
            src={user.photoURL}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {user.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          )}
        </div>
        
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-900 dark:text-white">{user.name}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Chat settings"
          >
            <MoreVertical className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 py-1"
                >
                  <button
                    onClick={() => {
                      onSettingsClick?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Chat Settings</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
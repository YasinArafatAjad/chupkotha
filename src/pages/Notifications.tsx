import { Helmet } from 'react-helmet-async';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import NotificationItem from '../components/common/NotificationItem';
import LoadingAnimation from '../components/common/LoadingAnimation';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const { currentUser } = useAuth();
  const { notifications, markAsRead } = useNotifications();

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Notifications | ChupKotha</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h1>
          </div>

          <div className="divide-y dark:divide-gray-700">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">
                  When someone interacts with your posts or follows you, you'll see it here
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={markAsRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
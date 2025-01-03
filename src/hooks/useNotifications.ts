import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notification, subscribeToNotifications } from '../lib/services/notificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToNotifications(currentUser.uid, (newNotifications) => {
      setNotifications(newNotifications);
      
      // Play notification sound if there are new notifications
      if (newNotifications.length > 0) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore autoplay restrictions
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return notifications;
}
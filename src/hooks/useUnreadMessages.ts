import { useState, useEffect } from 'react';
import { subscribeToUnreadMessages } from '../lib/firebase/chat/unreadMessages';

export function useUnreadMessages(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUnreadMessages(userId, (count) => {
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [userId]);

  return unreadCount;
}
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function subscribeToUnreadMessages(userId: string, callback: (count: number) => void) {
  // Query all chats where the user is the recipient and messages are unread
  const q = query(
    collection(db, `users/${userId}/messages`),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error subscribing to unread messages:', error);
    callback(0);
  });
}
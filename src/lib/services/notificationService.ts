import { collection, query, where, orderBy, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface Notification {
  id: string;
  type: 'like' | 'comment';
  postId: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  read: boolean;
  createdAt: Timestamp;
}

export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  const q = query(
    collection(db, `users/${userId}/notifications`),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    callback(notifications);
  });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  const notificationRef = doc(db, `users/${userId}/notifications/${notificationId}`);
  await updateDoc(notificationRef, { read: true });
}
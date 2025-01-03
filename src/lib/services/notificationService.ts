import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share';
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

export async function createNotification(
  recipientId: string,
  type: 'like' | 'comment' | 'share',
  postId: string,
  sender: { id: string; name: string; photo: string }
) {
  const notificationData = {
    type,
    postId,
    senderId: sender.id,
    senderName: sender.name,
    senderPhoto: sender.photo,
    read: false,
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, `users/${recipientId}/notifications`), notificationData);
}
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share';
  postId: string;
  senderName: string;
  senderPhoto: string;
  read: boolean;
  createdAt: any;
}

interface SenderInfo {
  id: string;
  name: string;
  photo: string;
}

export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  const q = query(
    collection(db, `users/${userId}/notifications`),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(20)
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
  sender: SenderInfo
) {
  try {
    const notificationsRef = collection(db, `users/${recipientId}/notifications`);
    
    await addDoc(notificationsRef, {
      type,
      postId,
      senderName: sender.name,
      senderPhoto: sender.photo,
      senderId: sender.id,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function markNotificationsAsRead(userId: string) {
  const notificationsRef = collection(db, `users/${userId}/notifications`);
  const unreadQuery = query(notificationsRef, where('read', '==', false));
  
  try {
    const snapshot = await getDocs(unreadQuery);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
}
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  getDocs,
  writeBatch,
  serverTimestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';
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
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    
    // Only count unread notifications
    const unreadNotifications = notifications.filter(n => !n.read);
    callback(unreadNotifications);
  });
}

export async function createNotification(
  recipientId: string,
  type: 'like' | 'comment' | 'share',
  postId: string,
  sender: SenderInfo
) {
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
}

export async function markNotificationsAsRead(userId: string) {
  const notificationsRef = collection(db, `users/${userId}/notifications`);
  const unreadQuery = query(notificationsRef, where('read', '==', false));
  
  const snapshot = await getDocs(unreadQuery);
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(docRef => {
    // Update read status but keep the notification
    batch.update(doc(db, `users/${userId}/notifications/${docRef.id}`), { 
      read: true 
    });
  });
  
  await batch.commit();
}
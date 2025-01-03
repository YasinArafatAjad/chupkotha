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
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'follow';
  postId?: string;
  senderName: string;
  senderPhoto: string;
  senderId: string;
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
    const allNotifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    
    callback(allNotifications);
  });
}

export async function createNotification(
  recipientId: string,
  type: 'like' | 'comment' | 'share' | 'follow',
  postId: string,
  sender: SenderInfo
) {
  const notificationsRef = collection(db, `users/${recipientId}/notifications`);
  
  // Don't create notification if sender is recipient
  if (sender.id === recipientId) return;

  // Create notification
  await addDoc(notificationsRef, {
    type,
    postId,
    senderName: sender.name,
    senderPhoto: sender.photo,
    senderId: sender.id,
    read: false,
    createdAt: serverTimestamp()
  });

  // Play notification sound
  const audio = new Audio('/sounds/notification.mp3');
  audio.play().catch(() => {}); // Ignore autoplay restrictions
}

export async function markNotificationsAsRead(userId: string) {
  const notificationsRef = collection(db, `users/${userId}/notifications`);
  const unreadQuery = query(notificationsRef, where('read', '==', false));
  
  const snapshot = await getDocs(unreadQuery);
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(docRef => {
    batch.update(doc(db, `users/${userId}/notifications/${docRef.id}`), { 
      read: true 
    });
  });
  
  await batch.commit();
}
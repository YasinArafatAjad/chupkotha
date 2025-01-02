import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getUnreadMessagesCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'messages'),
      where('recipientId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread messages count:', error);
    return 0;
  }
}

export function subscribeToUnreadMessages(userId: string, callback: (count: number) => void) {
  const q = query(
    collection(db, 'messages'),
    where('recipientId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

export async function markMessageAsRead(messageId: string) {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}
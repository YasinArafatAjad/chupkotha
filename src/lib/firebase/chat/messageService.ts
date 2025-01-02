import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id: string;
  text: string;
  userId: string;
  recipientId: string;
  read: boolean;
  createdAt: any;
}

export function subscribeToUnreadMessages(userId: string, callback: (count: number) => void) {
  // Query messages where user is recipient and unread
  const q = query(
    collection(db, 'messages'),
    where('recipientId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error subscribing to unread messages:', error);
    callback(0);
  });
}

export async function sendMessage(chatId: string, message: Omit<Message, 'id' | 'createdAt' | 'read'>) {
  return addDoc(collection(db, `chats/${chatId}/messages`), {
    ...message,
    read: false,
    createdAt: serverTimestamp()
  });
}

export async function markMessageAsRead(messageId: string) {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    read: true,
    readAt: serverTimestamp()
  });
}
import { collection, query, orderBy, limit, getDocs, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: Timestamp;
}

export async function getMessageHistory(chatId: string, limitCount: number = 50): Promise<Message[]> {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message)).reverse();
  } catch (error) {
    console.error('Error fetching message history:', error);
    throw error;
  }
}

export function createChatId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}
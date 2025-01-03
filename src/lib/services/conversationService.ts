import { collection, query, orderBy, doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { handleFirebaseError } from '../firebase/utils/errors';

export interface Conversation {
  userId: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  lastMessageTime: any;
  isPinned: boolean;
}

async function getUserData(userId: string): Promise<DocumentData | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  } catch (error) {
    handleFirebaseError(error);
    return null;
  }
}

export function getConversationsQuery(userId: string) {
  return query(
    collection(db, `users/${userId}/conversations`),
    orderBy('lastMessageTime', 'desc')
  );
}

export async function mapConversationData(data: DocumentData): Promise<Conversation | null> {
  try {
    const userData = await getUserData(data.userId);
    if (!userData) return null;

    return {
      userId: data.userId,
      displayName: userData.displayName || 'Unknown User',
      photoURL: userData.photoURL || '',
      lastMessage: data.lastMessage || '',
      lastMessageTime: data.lastMessageTime,
      isPinned: data.isPinned || false
    };
  } catch (error) {
    console.error('Error mapping conversation data:', error);
    return null;
  }
}

export async function togglePinConversation(
  currentUserId: string,
  otherUserId: string,
  isPinned: boolean
): Promise<void> {
  try {
    const conversationRef = doc(db, `users/${currentUserId}/conversations/${otherUserId}`);
    await updateDoc(conversationRef, { isPinned });
  } catch (error) {
    handleFirebaseError(error);
  }
}
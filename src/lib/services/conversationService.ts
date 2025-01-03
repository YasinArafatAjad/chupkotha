import { collection, query, orderBy, doc, getDoc, updateDoc, DocumentData, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { handleFirebaseError } from '../firebase/utils/errors';

export interface Conversation {
  userId: string;
  displayName: string;
  photoURL: string;
  lastMessage?: string;
  lastMessageTime?: any;
  isPinned?: boolean;
}

export function getConversationsQuery(userId: string) {
  return query(
    collection(db, `users/${userId}/conversations`),
    orderBy('lastMessageTime', 'desc')
  );
}

export async function mapConversationData(data: DocumentData): Promise<Conversation | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', data.userId));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      userId: data.userId,
      displayName: userData.displayName || 'Unknown User',
      photoURL: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || 'Unknown User')}`,
      lastMessage: data.lastMessage,
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

export async function deleteConversation(
  currentUserId: string,
  otherUserId: string
): Promise<void> {
  try {
    // Delete conversation document
    const conversationRef = doc(db, `users/${currentUserId}/conversations/${otherUserId}`);
    await deleteDoc(conversationRef);

    // Delete all messages (optional, depending on your requirements)
    const chatRoomId = `chat_${[currentUserId, otherUserId].sort().join('_')}`;
    const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
    
    // Note: In a production app, you might want to batch delete messages
    // or keep them for compliance/audit purposes
  } catch (error) {
    handleFirebaseError(error);
  }
}
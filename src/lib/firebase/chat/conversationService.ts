import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function updateConversationList(
  senderId: string,
  recipientId: string,
  lastMessage: string
) {
  try {
    // Update sender's conversation list
    await setDoc(
      doc(db, `users/${senderId}/conversations/${recipientId}`),
      {
        userId: recipientId,
        lastMessage,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    // Update recipient's conversation list
    await setDoc(
      doc(db, `users/${recipientId}/conversations/${senderId}`),
      {
        userId: senderId,
        lastMessage,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating conversation list:', error);
    throw error;
  }
}
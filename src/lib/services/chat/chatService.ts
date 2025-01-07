import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';

interface MessageData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}

export async function sendMessage(chatRoomId: string, messageData: MessageData) {
  try {
    // Get user IDs from chatRoomId
    const [user1Id, user2Id] = chatRoomId.split('_');
    const recipientId = messageData.userId === user1Id ? user2Id : user1Id;

    // Get recipient user data
    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    const recipientData = recipientDoc.data();

    // Add message to chat room
    const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
    await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp()
    });

    // Update sender's conversation
    await setDoc(doc(db, `users/${messageData.userId}/conversations/${recipientId}`), {
      userId: recipientId,
      displayName: recipientData?.displayName || 'Unknown User',
      photoURL: recipientData?.photoURL || `https://ui-avatars.com/api/?name=Unknown+User`,
      lastMessage: messageData.text,
      lastMessageTime: serverTimestamp()
    }, { merge: true });

    // Update recipient's conversation
    await setDoc(doc(db, `users/${recipientId}/conversations/${messageData.userId}`), {
      userId: messageData.userId,
      displayName: messageData.userName,
      photoURL: messageData.userPhoto,
      lastMessage: messageData.text,
      lastMessageTime: serverTimestamp()
    }, { merge: true });

  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
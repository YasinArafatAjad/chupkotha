import { collection, query, orderBy, limit, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateConversationList } from './conversationService';

interface MessageData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}

export const createChatRoom = async (user1Id: string, user2Id: string) => {
  // Sort IDs to ensure consistent chat room ID
  const participants = [user1Id, user2Id].sort();
  return `chat_${participants.join('_')}`;
};

export const sendMessage = async (
  chatRoomId: string,
  messageData: MessageData
) => {
  const message = await addDoc(collection(db, `chatRooms/${chatRoomId}/messages`), {
    ...messageData,
    createdAt: serverTimestamp()
  });

  // Extract user IDs from chatRoomId
  const [_, ...userIds] = chatRoomId.split('_');
  const recipientId = userIds.find(id => id !== messageData.userId);

  if (recipientId) {
    await updateConversationList(
      messageData.userId,
      recipientId,
      messageData.text
    );
  }

  return message;
};

export const getChatMessages = (chatRoomId: string) => {
  return query(
    collection(db, `chatRooms/${chatRoomId}/messages`),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
};
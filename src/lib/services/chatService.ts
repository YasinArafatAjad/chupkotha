import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  createdAt: any;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount: number;
}

// Create or get existing chat room
export async function getOrCreateChatRoom(user1Id: string, user2Id: string): Promise<string> {
  const participants = [user1Id, user2Id].sort();
  const chatRoomId = `chat_${participants.join('_')}`;
  
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  const chatRoomSnap = await getDocs(query(collection(db, 'chatRooms'), 
    where('participants', '==', participants)));

  if (chatRoomSnap.empty) {
    await addDoc(collection(db, 'chatRooms'), {
      participants,
      createdAt: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      unreadCount: 0
    });
  }

  return chatRoomId;
}

// Send message
export async function sendMessage(chatRoomId: string, message: Omit<ChatMessage, 'id' | 'createdAt' | 'read'>): Promise<void> {
  const messageData = {
    ...message,
    createdAt: serverTimestamp(),
    read: false
  };

  await addDoc(collection(db, `chatRooms/${chatRoomId}/messages`), messageData);
  
  // Update chat room
  await updateDoc(doc(db, 'chatRooms', chatRoomId), {
    lastMessage: message.text,
    lastMessageTime: serverTimestamp(),
    [`unreadCount.${message.senderId}`]: 0
  });
}

// Subscribe to messages
export function subscribeToMessages(chatRoomId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(
    collection(db, `chatRooms/${chatRoomId}/messages`),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    
    callback(messages.reverse());
  });
}

// Mark messages as read
export async function markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
  const unreadMessages = query(messagesRef, 
    where('senderId', '!=', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(unreadMessages);
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });

  await batch.commit();

  // Reset unread count
  await updateDoc(doc(db, 'chatRooms', chatRoomId), {
    [`unreadCount.${userId}`]: 0
  });
}

// Get chat room details
export async function getChatRoomDetails(chatRoomId: string): Promise<ChatRoom | null> {
  const docRef = doc(db, 'chatRooms', chatRoomId);
  const docSnap = await getDocs(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  } as ChatRoom;
}
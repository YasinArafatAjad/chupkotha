import { collection, query, where, orderBy, getDocs, limit, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

interface ChatUser {
  id: string;
  displayName: string;
  photoURL: string;
  lastMessage?: string;
  lastMessageTime?: any;
}

// Helper function to get user data
async function getUserData(userId: string): Promise<DocumentData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function getRecentChats(userId: string): Promise<ChatUser[]> {
  try {
    // First, get all chat rooms where the user is a participant
    const chatRoomsRef = collection(db, `users/${userId}/chats`);
    const q = query(
      chatRoomsRef,
      orderBy('lastMessageTime', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    
    // Map chat rooms to user data
    const chatUsers = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const chatData = doc.data();
        const otherUserId = chatData.userId;
        const userData = await getUserData(otherUserId);

        return {
          id: otherUserId,
          displayName: userData?.displayName || 'Unknown User',
          photoURL: userData?.photoURL || '',
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime
        };
      })
    );

    return chatUsers.filter(user => user.displayName !== 'Unknown User');
  } catch (error) {
    console.error('Error getting recent chats:', error);
    return [];
  }
}

export async function searchUsers(searchTerm: string, currentUserId: string): Promise<ChatUser[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', searchTerm.toLowerCase()),
      where('displayName', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      }))
      .filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function initializeChat(userId: string, otherUserId: string) {
  try {
    // Create chat references for both users
    const chatId = [userId, otherUserId].sort().join('_');
    const userChatRef = doc(db, `users/${userId}/chats/${otherUserId}`);
    const otherUserChatRef = doc(db, `users/${otherUserId}/chats/${userId}`);

    // Initialize chat data
    const chatData = {
      userId: otherUserId,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0
    };

    await Promise.all([
      setDoc(userChatRef, chatData, { merge: true }),
      setDoc(otherUserChatRef, { ...chatData, userId }, { merge: true })
    ]);

    return chatId;
  } catch (error) {
    console.error('Error initializing chat:', error);
    throw error;
  }
}
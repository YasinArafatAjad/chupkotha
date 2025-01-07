import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MessageData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl?: string;
}

export function useChat(otherUserId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !otherUserId) return;

    const chatRoomId = [currentUser.uid, otherUserId].sort().join('_');

    const setupChatRoom = async () => {
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      await setDoc(chatRoomRef, {
        participants: [currentUser.uid, otherUserId],
        updatedAt: serverTimestamp()
      }, { merge: true });
    };

    setupChatRoom().catch(console.error);

    const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
        setLoading(false);
      },
      (err) => {
        console.error('Chat subscription error:', err);
        setError(err as Error);
        setLoading(false);
        toast.error('Failed to load messages');
      }
    );

    return () => unsubscribe();
  }, [currentUser, otherUserId]);

  const sendChatMessage = async (messageData: MessageData) => {
    if (!currentUser || !otherUserId) {
      throw new Error('Cannot send message - missing user information');
    }

    const chatRoomId = [currentUser.uid, otherUserId].sort().join('_');

    try {
      // Get recipient user data
      const recipientDoc = await getDoc(doc(db, 'users', otherUserId));
      const recipientData = recipientDoc.data();

      // Add message to chat room
      const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
      await addDoc(messagesRef, {
        ...messageData,
        createdAt: serverTimestamp()
      });

      // Update current user's conversations
      await setDoc(doc(db, `users/${currentUser.uid}/conversations/${otherUserId}`), {
        userId: otherUserId,
        displayName: recipientData?.displayName || 'User',
        photoURL: recipientData?.photoURL,
        lastMessage: messageData.text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update recipient's conversations
      await setDoc(doc(db, `users/${otherUserId}/conversations/${currentUser.uid}`), {
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL,
        lastMessage: messageData.text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      throw err;
    }
  };

  return { messages, loading, error, sendChatMessage };
}
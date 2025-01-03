import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { createChatRoom, sendMessage, getChatMessages } from '../lib/firebase/chat/chatRepository';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MessageData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}

export function useChat(otherUserId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !otherUserId) return;

    const initializeChat = async () => {
      try {
        const chatRoomId = await createChatRoom(currentUser.uid, otherUserId);
        const messagesQuery = getChatMessages(chatRoomId);

        return onSnapshot(messagesQuery, (snapshot) => {
          const newMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(newMessages.reverse());
          setLoading(false);
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to load chat');
        setLoading(false);
      }
    };

    const unsubscribe = initializeChat();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser, otherUserId]);

  const sendChatMessage = async (messageData: MessageData) => {
    if (!currentUser || !otherUserId || !messageData.text.trim()) return;

    try {
      const chatRoomId = await createChatRoom(currentUser.uid, otherUserId);
      await sendMessage(chatRoomId, messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return { messages, loading, sendChatMessage };
}
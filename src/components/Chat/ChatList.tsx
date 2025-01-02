import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface ChatUser {
  id: string;
  displayName: string;
  photoURL: string;
  lastMessage?: string;
  lastMessageTime?: any;
}

export default function ChatList({ onSelectChat }: { onSelectChat: (userId: string) => void }) {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, `users/${currentUser.uid}/chats`),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatUser[];
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="divide-y dark:divide-gray-800">
      {chats.map((chat) => (
        <motion.button
          key={chat.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onSelectChat(chat.id)}
          className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <img
            src={chat.photoURL || 'https://unsplash.com/photos/a-white-cloud-with-eyes-and-a-black-nose-0LpSeSbtRBw'}
            alt={chat.displayName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 text-left">
            <div className="font-medium">{chat.displayName}</div>
            {chat.lastMessage && (
              <div className="text-sm text-gray-500 truncate">
                {chat.lastMessage}
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ChatUser {
  id: string;
  displayName: string;
  photoURL: string;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
}

export default function ChatList({ onSelectChat }: { onSelectChat: (userId: string) => void }) {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const conversationsRef = collection(db, `users/${currentUser.uid}/conversations`);
    const q = query(conversationsRef, orderBy('lastMessageTime', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName || 'Unknown User',
          photoURL: data.photoURL || `https://ui-avatars.com/api/?name=Unknown+User`,
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime
        };
      });

      setChats(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations yet
      </div>
    );
  }

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
            src={chat.photoURL}
            alt={chat.displayName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 min-w-0 text-left">
            <div className="font-medium truncate">{chat.displayName}</div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="truncate flex-1">{chat.lastMessage || 'No messages '}</span>
              {chat.lastMessageTime && (
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                  {formatDistanceToNow(chat.lastMessageTime.toDate(), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
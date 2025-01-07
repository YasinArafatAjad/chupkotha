import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

interface ChatMessagesProps {
  chatId: string;
  otherUser: {
    displayName: string;
    photoURL: string;
  };
}

export default function ChatMessages({ chatId, otherUser }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messageList.reverse());
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.userId === currentUser?.uid;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end space-x-2 ${
              isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <LazyLoadImage effect="blur"
              src={isOwnMessage ? currentUser?.photoURL : otherUser.photoURL}
              alt=""
              className="w-6 h-6 rounded-full"
            />
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwnMessage
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <p>{message.text}</p>
              {message.createdAt && (
                <div className="text-xs opacity-75 mt-1">
                  {format(message.createdAt.toDate(), 'HH:mm')}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
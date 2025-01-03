import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ChatInputProps {
  chatId: string;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    setSending(true);
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: message,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || sending}
          className="p-2 rounded-full bg-primary text-white disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </form>
  );
}
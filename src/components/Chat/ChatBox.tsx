import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Message, createChatId } from '../../lib/services/messageService';
import { markMessageAsRead } from '../../lib/firebase/chat/messageService';
import MessageList from './MessageList';
import LoadingAnimation from '../common/LoadingAnimation';
import toast from 'react-hot-toast';

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

export default function ChatBox({ recipientId, recipientName, recipientPhoto }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !recipientId) return;

    const chatId = createChatId(currentUser.uid, recipientId);
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      // Mark messages as read
      newMessages.forEach(msg => {
        if (msg.recipientId === currentUser.uid && !msg.read) {
          markMessageAsRead(msg.id);
        }
      });

      setMessages(newMessages);
      setLoading(false);
      scrollToBottom();
    }, (error) => {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, recipientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newMessage.trim()) return;

    const chatId = createChatId(currentUser.uid, recipientId);
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage.trim(),
        userId: currentUser.uid,
        recipientId,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        createdAt: serverTimestamp(),
        read: false
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center space-x-4 p-4 border-b dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img
          src={recipientPhoto}
          alt={recipientName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold">{recipientName}</h2>
          <p className="text-sm text-gray-500">
            {messages.length} messages
          </p>
        </div>
      </div>

      <MessageList 
        messages={messages}
        currentUserId={currentUser?.uid || ''}
      />

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      <div ref={messagesEndRef} />
    </div>
  );
}
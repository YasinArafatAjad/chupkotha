import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage, getOrCreateChatRoom, sendMessage, subscribeToMessages, markMessagesAsRead } from '../../lib/services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from '../common/LoadingAnimation';
import toast from 'react-hot-toast';

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

export default function ChatBox({ recipientId, recipientName, recipientPhoto }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUser || !recipientId) return;
      
      try {
        const roomId = await getOrCreateChatRoom(currentUser.uid, recipientId);
        setChatRoomId(roomId);
        
        // Mark messages as read when chat opens
        await markMessagesAsRead(roomId, currentUser.uid);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to load chat');
      }
    };

    initializeChat();
  }, [currentUser, recipientId]);

  useEffect(() => {
    if (!chatRoomId) return;

    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !chatRoomId || !newMessage.trim()) return;

    setLoading(true);
    try {
      await sendMessage(chatRoomId, {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]" ref={chatBoxRef}>
      <div className="p-4 border-b dark:border-gray-800 flex items-center space-x-4">
        <button 
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img
          src={recipientPhoto}
          alt={recipientName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold">{recipientName}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start space-x-2 ${
                message.senderId === currentUser?.uid ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <img
                src={message.senderPhoto}
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === currentUser?.uid
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <div className="text-xs opacity-75 mt-1">
                  {message.createdAt?.toDate().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

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
            disabled={loading || !newMessage.trim()}
            className="p-2 rounded-full bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
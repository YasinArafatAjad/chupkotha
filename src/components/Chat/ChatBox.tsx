import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { uploadChatImage } from '../../lib/services/chat/imageUploadService';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import LoadingAnimation from '../common/LoadingAnimation';

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

export default function ChatBox({ recipientId, recipientName, recipientPhoto }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUser || !recipientId) return;
      
      try {
        const roomId = await getOrCreateChatRoom(currentUser.uid, recipientId);
        setChatRoomId(roomId);
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

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !chatRoomId) return;

    await sendMessage(chatRoomId, {
      text,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    });
  };

  const handleSendImage = async (file: File) => {
    if (!currentUser || !chatRoomId) return;

    const imageUrl = await uploadChatImage(file);
    await sendMessage(chatRoomId, {
      text: '📷 Image',
      imageUrl,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
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

      {/* Messages */}
      <MessageList 
        messages={messages}
        currentUserId={currentUser?.uid || ''}
        ref={messagesEndRef}
      />

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        disabled={loading}
      />
    </div>
  );
}
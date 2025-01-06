import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import LoadingAnimation from '../common/LoadingAnimation';
import ImagePreviewModal from './ImagePreviewModal';
import InboxHeader from './InboxHeader';
import toast from 'react-hot-toast';

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

export default function ChatBox({ recipientId, recipientName, recipientPhoto }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
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

    const imageUrl = await uploadToCloudinary(file, 'chat');
    await sendMessage(chatRoomId, {
      text: '📷 Image',
      imageUrl,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* <InboxHeader 
        user={{
          id: recipientId,
          name: recipientName,
          photoURL: recipientPhoto,
          isOnline: true // You can add real-time online status logic here
        }}
        onSettingsClick={() => navigate(`/profile/${recipientId}`)}
      /> */}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <MessageList 
            messages={messages}
            currentUserId={currentUser?.uid || ''}
            ref={messagesEndRef}
          />
        </div>
      </div>

      <div className="border-t dark:border-gray-800">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            disabled={loading}
          />
        </div>
      </div>

      <ImagePreviewModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={recipientPhoto}
        userName={recipientName}
      />
    </div>
  );
}
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
  const [showImageModal, setShowImageModal] = useState(false);
  const { currentUser } = useAuth();
  const { messages: chatMessages, sendChatMessage, error } = useChat(recipientId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load chat messages');
    }
  }, [error]);

  useEffect(() => {
    setMessages(chatMessages);
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser) {
      toast.error('Please sign in to send messages');
      return;
    }

    setLoading(true);
    try {
      await sendChatMessage({
        text,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleSendImage = async (file: File) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file, 'chat');
      await sendChatMessage({
        text: '📷 Image',
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`,
        imageUrl
      });
    } catch (error) {
      toast.error('Failed to send image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <LoadingAnimation />
            </div>
          ) : (
            <MessageList 
              messages={messages}
              currentUserId={currentUser?.uid || ''}
              ref={messagesEndRef}
            />
          )}
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
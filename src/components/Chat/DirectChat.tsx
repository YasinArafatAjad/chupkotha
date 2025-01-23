import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { db } from '../../lib/firebase';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import LoadingAnimation from '../common/LoadingAnimation';
import ImagePreviewModal from './ImagePreviewModal';
import ChatHeader from './ChatHeader';
import toast from 'react-hot-toast';

export default function DirectChat() {
  const { userId } = useParams();
  const [recipient, setRecipient] = useState<{
    id: string;
    name: string;
    photo: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipient = async () => {
      if (!userId) {
        navigate('/chat');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setRecipient({
            id: userDoc.id,
            name: userDoc.data().displayName,
            photo: userDoc.data().photoURL
          });
        } else {
          toast.error('User not found');
          navigate('/chat');
        }
      } catch (error) {
        console.error('Error loading recipient:', error);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    loadRecipient();
  }, [userId, navigate]);

  if (loading || !recipient) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatHeader
        recipientId={recipient.id}
        recipientName={recipient.name}
        recipientPhoto={recipient.photo}
      />
      <ChatBox
        recipientId={recipient.id}
        recipientName={recipient.name}
        recipientPhoto={recipient.photo}
      />
    </div>
  );
}

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

function ChatBox({ recipientId, recipientName, recipientPhoto }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { currentUser } = useAuth();
  const { messages: chatMessages, sendChatMessage } = useChat(recipientId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatMessages);
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;

    await sendChatMessage({
      text,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    });
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
    <>
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
        <div className="max-w-2xl mx-auto mb-4">
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
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Send, Image, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import LoadingAnimation from '../common/LoadingAnimation';
import ChatMessage from './ChatMessage';
import ImagePreviewModal from './ImagePreviewModal';
import toast from 'react-hot-toast';

export default function DirectChat() {
  const { userId } = useParams();
  const { messages, loading, sendChatMessage } = useChat(userId || '');
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipient = async () => {
      if (!userId) return;
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setRecipient(userDoc.data());
      }
    };
    loadRecipient();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || sending) return;

    setSending(true);
    try {
      const messageData = {
        text: newMessage,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      };

      await sendChatMessage(messageData);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSending(true);
    try {
      const imageUrl = await uploadToCloudinary(file, 'chat');
      const messageData = {
        text: '📷 Image',
        imageUrl,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      };

      await sendChatMessage(messageData);
    } catch (error) {
      console.error('Error sending image:', error);
      toast.error('Failed to send image');
    } finally {
      setSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center space-x-4">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {recipient && (
            <div className="flex items-center space-x-3">
              <img
                src={recipient.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.displayName)}`}
                alt={recipient.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h2 className="font-semibold">{recipient.displayName}</h2>
                <p className="text-xs text-gray-500">
                  {recipient.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-14 pb-4">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.userId === currentUser?.uid}
              onImageClick={(imageUrl) => setPreviewImage(imageUrl)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="p-4 flex items-center space-x-2">
            <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors">
              <Image className="w-6 h-6 text-gray-500" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                disabled={sending}
              />
            </label>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={sending}
            />
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="p-2 rounded-full bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {sending ? <LoadingAnimation /> : <Send className="w-6 h-6" />}
            </motion.button>
          </form>
        </div>
      </div>

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage || ''}
      />
    </div>
  );
}
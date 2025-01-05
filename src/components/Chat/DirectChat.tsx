import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import LoadingAnimation from '../common/LoadingAnimation';
import toast from 'react-hot-toast';

export default function DirectChat() {
  const { userId } = useParams();
  const { messages, loading, sendChatMessage } = useChat(userId || '');
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSending(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, 'chat');

      // Send message with image
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-2 ${
              message.userId === currentUser?.uid ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <img
              src={message.userPhoto}
              alt={message.userName}
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === currentUser?.uid
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {message.imageUrl ? (
                <img 
                  src={message.imageUrl} 
                  alt="Shared image"
                  className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.imageUrl, '_blank')}
                />
              ) : (
                <p>{message.text}</p>
              )}
              <div className="text-xs opacity-75 mt-1">
                {message.createdAt?.toDate().toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors">
            <Image className="w-5 h-5 text-gray-500" />
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
            {sending ? <LoadingAnimation /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
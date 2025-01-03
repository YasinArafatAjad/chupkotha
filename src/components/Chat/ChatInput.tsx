import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUploadButton from './ImageUploadButton';
import LoadingAnimation from '../common/LoadingAnimation';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  onSendImage: (file: File) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, onSendImage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input after component updates
  useEffect(() => {
    inputRef.current?.focus();
  }, [sending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
      // Focus input after sending
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = async (file: File) => {
    setSending(true);
    try {
      await onSendImage(file);
      // Focus input after sending image
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800">
      <div className="flex items-center space-x-2">
        <ImageUploadButton 
          onImageSelect={handleImageSelect}
          disabled={disabled || sending}
        />
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={disabled || sending}
          autoFocus
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={disabled || sending || !message.trim()}
          className="p-2 rounded-full bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {sending ? <LoadingAnimation /> : <Send className="w-5 h-5" />}
        </motion.button>
      </div>
    </form>
  );
}
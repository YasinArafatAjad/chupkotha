import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userPhoto: string;
    imageUrl?: string;
    createdAt: any;
  };
  isOwnMessage: boolean;
  onImageClick?: (imageUrl: string) => void;
}

export default function ChatMessage({ message, isOwnMessage, onImageClick }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-2 ${
        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <LazyLoadImage effect="blur"
        src={message.userPhoto}
        alt={message.userName}
        className="w-8 h-8 rounded-full"
      />
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        {message.imageUrl ? (
          <LazyLoadImage effect="blur" 
            src={message.imageUrl} 
            alt="Shared image"
            className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick?.(message.imageUrl!)}
          />
        ) : (
          <p>{message.text}</p>
        )}
        <div className="text-xs opacity-75 mt-1">
          {message.createdAt?.toDate().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}
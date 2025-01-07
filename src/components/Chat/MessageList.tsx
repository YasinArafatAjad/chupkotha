import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithFallback from '../common/ImageWithFallback';
import { formatMessageDate } from '../../lib/utils/date/formatters';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl?: string;
  createdAt: any;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUserId }, ref) => {
    if (!messages.length) {
      return (
        <div className="flex items-center justify-center h-full p-4 text-gray-500">
          No messages yet. Start the conversation!
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start space-x-2 ${
                message.userId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <ImageWithFallback
                src={message.userPhoto}
                alt={message.userName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.userId === currentUserId
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
                  <p className="break-words">{message.text}</p>
                )}
                <div className="text-xs opacity-75 mt-1">
                  {formatMessageDate(message.createdAt)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={ref} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';
export default MessageList;
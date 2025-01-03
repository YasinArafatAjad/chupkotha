import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  imageUrl?: string;
  createdAt: any;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUserId }, ref) => {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start space-x-2 ${
                message.senderId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <img
                src={message.senderPhoto}
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === currentUserId
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
        </AnimatePresence>
        <div ref={ref} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';
export default MessageList;
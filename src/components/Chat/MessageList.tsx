import { memo } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../lib/services/messageService';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = memo(({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.userId === currentUserId;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start space-x-2 ${
              isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <img
              src={message.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.userName)}`}
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
              <p>{message.text}</p>
              <div className="text-xs opacity-75 mt-1">
                {format(message.createdAt.toDate(), 'HH:mm')}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;
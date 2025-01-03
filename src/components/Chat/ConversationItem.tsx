import { formatDistanceToNow } from 'date-fns';
import { Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../common/ImageWithFallback';
import { Conversation } from '../../lib/services/conversationService';

interface ConversationItemProps {
  conversation: Conversation;
  onTogglePin: (userId: string, isPinned: boolean) => void;
}

export default function ConversationItem({ conversation, onTogglePin }: ConversationItemProps) {
  const isUnread = !conversation.lastMessageRead;

  return (
    <div className="flex items-center p-4">
      <Link
        to={`/chat/${conversation.userId}`}
        className="flex-1 flex items-center space-x-4 min-w-0"
      >
        <ImageWithFallback
          src={conversation.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.displayName)}`}
          alt={conversation.displayName}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`truncate ${isUnread ? 'font-bold' : 'font-normal'}`}>
              {conversation.displayName}
            </h3>
            <div className="flex items-center space-x-2 ml-2 text-xs text-gray-500">
              {conversation.lastMessageTime && formatDistanceToNow(conversation.lastMessageTime.toDate(), { addSuffix: true })}
            </div>
          </div>
          <p className={`text-sm text-gray-500 truncate ${isUnread ? 'font-semibold' : 'font-normal'}`}>
            {conversation.lastMessage || 'No messages yet'}
          </p>
        </div>
      </Link>
      <button
        onClick={() => onTogglePin(conversation.userId, conversation.isPinned)}
        className={`p-2 ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
          conversation.isPinned ? 'text-primary' : 'text-gray-400'
        }`}
        title={conversation.isPinned ? 'Unpin conversation' : 'Pin conversation'}
      >
        <Pin className="w-4 h-4" />
      </button>
    </div>
  );
}
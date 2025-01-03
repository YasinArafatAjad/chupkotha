import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Pin, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConversationMenuProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete?: () => void;
}

export default function ConversationMenu({ isPinned, onTogglePin, onDelete }: ConversationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePin = () => {
    onTogglePin();
    setIsOpen(false);
    toast.success(isPinned ? 'Conversation unpinned' : 'Conversation pinned');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsOpen(false);
      toast.success('Conversation deleted');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 py-1"
            >
              <button
                onClick={handleTogglePin}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Pin className="w-4 h-4" />
                <span>{isPinned ? 'Unpin conversation' : 'Pin conversation'}</span>
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete conversation</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
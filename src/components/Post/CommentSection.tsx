import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Trash2, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingAnimation from '../common/LoadingAnimation';

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (text: string) => Promise<boolean>;
  onDeleteComment?: (commentId: string) => Promise<boolean>;
}

export default function CommentSection({ 
  postId, 
  comments, 
  onAddComment,
  onDeleteComment 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) return;

    setSending(true);
    try {
      const success = await onAddComment(newComment.trim());
      if (success) {
        setNewComment('');
      }
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    const success = await onDeleteComment(commentId);
    if (success) {
      toast.success('Comment deleted');
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="px-4 py-2 space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newComment.trim()}
          className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-50 transition-colors"
        >
          {sending ? <LoadingAnimation /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        <AnimatePresence>
          {displayedComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2 group"
            >
              <img
                src={comment.userPhoto}
                alt={comment.userName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    {currentUser?.uid === comment.userId && onDeleteComment && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(comment.createdAt?.toDate?.() || new Date(), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show More/Less Button */}
        {comments.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showAll ? 'Show less' : `View all ${comments.length} comments`}
          </button>
        )}
      </div>
    </div>
  );
}
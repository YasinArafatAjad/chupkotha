import { useState } from 'react';
import { Send, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';

interface PostCommentsProps {
  postId: string;
  comments: any[];
  isVisible: boolean;
}

export default function PostComments({ postId, comments, isVisible }: PostCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const { currentUser } = useAuth();
  const { addComment, loading } = useComments(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    const success = await addComment(newComment);
    if (success) {
      setNewComment('');
    }
  };

  if (!isVisible) return null;

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);
  const hasMoreComments = comments.length > 2;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <AnimatePresence>
          {displayedComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {comment.userPhoto ? (
                  <img
                    src={comment.userPhoto}
                    alt={comment.userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=random`;
                    }}
                  />
                ) : (
                  <UserCircle className="w-full h-full text-gray-400" />
                )}
              </div>
              <div>
                <span className="font-semibold mr-2">{comment.userName}</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {comment.text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMoreComments && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
          >
            <span>
              {showAllComments ? 'Show less' : `View all ${comments.length} comments`}
            </span>
            {showAllComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="text-primary disabled:opacity-50"
          disabled={loading || !newComment.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
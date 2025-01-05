import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import LoadingAnimation from '../common/LoadingAnimation';
import { deletePost } from '../../lib/services/posts/deletePostService';
import { useNavigate } from 'react-router-dom';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  imageUrl?: string;
}

export default function DeletePostModal({ isOpen, onClose, postId, imageUrl }: DeletePostModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deletePost(postId, imageUrl);
    if (success) {
      onClose();
      navigate('/');
    }
    setIsDeleting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Delete Post
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start space-x-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="mb-2">Are you sure you want to delete this post? This will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>Remove the post permanently</li>
                  <li>Delete all comments and likes</li>
                  <li>Remove the post from all saved collections</li>
                  <li>Delete the associated image</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? <LoadingAnimation /> : 'Delete Post'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
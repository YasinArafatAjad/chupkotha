import { useState } from 'react';
import { MoreHorizontal, ExternalLink, Flag, Link as LinkIcon, Trash2, PencilLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DeletePostModal from './DeletePostModal';
import EditCaptionModal from './EditCaptionModal';
import toast from 'react-hot-toast';

interface PostMenuProps {
  postId: string;
  userId: string;
  caption: string;
  onReport?: () => void;
}

export default function PostMenu({ postId, userId, caption, onReport }: PostMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
    setIsOpen(false);
  };

  const handleReport = () => {
    onReport?.();
    toast.success('Post reported. Thank you for helping keep our community safe.');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
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
                onClick={() => {
                  navigate(`/post/${postId}`);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View post</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Copy link</span>
              </button>

              {currentUser?.uid === userId && (
                <>
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilLine className="w-4 h-4" />
                    <span>Edit caption</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete post</span>
                  </button>
                </>
              )}

              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <Flag className="w-4 h-4" />
                <span>Report post</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        postId={postId}
      />

      <EditCaptionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        postId={postId}
        currentCaption={caption}
      />
    </div>
  );
}
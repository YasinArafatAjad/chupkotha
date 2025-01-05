import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updatePostPrivacy } from '../../lib/services/posts/privacyService';
import LoadingAnimation from '../common/LoadingAnimation';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentPrivacy: boolean;
  onPrivacyChange?: (isPublic: boolean) => void;
}

export default function PrivacyModal({ 
  isOpen, 
  onClose, 
  postId, 
  currentPrivacy,
  onPrivacyChange 
}: PrivacyModalProps) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(currentPrivacy);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPublic(currentPrivacy);
    }
  }, [isOpen, currentPrivacy]);

  const handleUpdatePrivacy = async () => {
    setLoading(true);
    try {
      const success = await updatePostPrivacy(postId, isPublic);
      if (success) {
        onPrivacyChange?.(isPublic);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold">Post Privacy</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                isPublic 
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Globe className={`w-5 h-5 ${isPublic ? 'text-primary' : ''}`} />
              <div className="text-left">
                <div className="font-medium">Public</div>
                <div className="text-sm text-gray-500">Anyone can see this post</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                !isPublic 
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Lock className={`w-5 h-5 ${!isPublic ? 'text-primary' : ''}`} />
              <div className="text-left">
                <div className="font-medium">Private</div>
                <div className="text-sm text-gray-500">Only you can see this post</div>
              </div>
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdatePrivacy}
              
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? <LoadingAnimation /> : 'Update Privacy'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
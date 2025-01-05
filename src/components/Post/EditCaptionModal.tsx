import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { editPostCaption } from '../../lib/services/posts/editPostService';
import LoadingAnimation from '../common/LoadingAnimation';

interface EditCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentCaption: string;
}

export default function EditCaptionModal({ 
  isOpen, 
  onClose, 
  postId, 
  currentCaption = '' // Provide default value
}: EditCaptionModalProps) {
  // Initialize with currentCaption or empty string
  const [caption, setCaption] = useState<string>(currentCaption || '');

  // Update caption when currentCaption changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCaption(currentCaption || '');
    }
  }, [currentCaption, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setLoading(true);
    try {
      const success = await editPostCaption(postId, caption.trim());
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  console.log(currentCaption)

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
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Edit Caption</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea              
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              placeholder="Write a caption..."
              autoFocus
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !caption.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? <LoadingAnimation /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
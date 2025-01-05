import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImagePreviewModal({ isOpen, onClose, imageUrl }: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="relative max-w-4xl w-full"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
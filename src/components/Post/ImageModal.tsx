import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageModalProps {
  imageUrl: string;
  caption: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, caption, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <LazyLoadImage effect="blur"
            src={imageUrl}
            alt={caption}
            className="max-w-full max-h-[90vh] object-contain"
          />
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
              <p>{caption}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
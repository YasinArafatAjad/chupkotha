import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Camera className="w-16 h-16 text-primary mx-auto mb-6" />
        <LoadingAnimation />
        <motion.div
          className="text-sm text-gray-500 dark:text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading amazing content...
        </motion.div>
      </motion.div>
    </div>
  );
}
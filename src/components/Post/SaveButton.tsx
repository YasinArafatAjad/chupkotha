import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSavePost } from '../../hooks/useSavePost';

interface SaveButtonProps {
  postId: string;
}

export default function SaveButton({ postId }: SaveButtonProps) {
  const { isSaved, loading, toggleSave } = useSavePost(postId);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleSave}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isSaved 
          ? 'text-primary hover:bg-primary/10' 
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={isSaved ? 'Remove from saved' : 'Save post'}
    >
      <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
    </motion.button>
  );
}
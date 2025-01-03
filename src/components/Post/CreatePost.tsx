import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCreatePost } from '../../hooks/useCreatePost';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { currentUser } = useAuth();
  const { handleCreatePost, loading } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to create a post');
      return;
    }

    try {
      await handleCreatePost(
        currentUser.uid,
        null,
        caption,
        currentUser.displayName || 'Anonymous',
        currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`,
        isPublic
      );
    } catch (error) {
      console.error('Error in CreatePost:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isPublic 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !isPublic 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Private</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !caption.trim()}
          className="w-full py-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {loading ? 'Creating...' : 'Share'}
        </button>
      </form>
    </motion.div>
  );
}
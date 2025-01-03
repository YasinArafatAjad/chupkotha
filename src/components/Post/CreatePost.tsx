import { useEffect, useState } from 'react';
// import { import { Camera, X } from 'lucide-react'; } from 'lucide-react';
import { motion } from 'framer-motion';
import { Globe, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCreatePost } from '../../hooks/useCreatePost';
import ImageUploadPreview from './ImageUploadPreview';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { handleCreatePost, loading } = useCreatePost();

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image must be less than 5MB');
        }
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load image');
      }
    }
  };

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to create a post');
      return;
    }

    try {
      await handleCreatePost(
        currentUser.uid,
        image,
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

        <ImageUploadPreview
          preview={preview}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
      
        <button
          type="submit"
          disabled={loading || (!caption.trim() && !image)}
          className="w-full py-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {loading ? 'Creating...' : 'Share'}
        </button>
      </form>
    </motion.div>
  );
}
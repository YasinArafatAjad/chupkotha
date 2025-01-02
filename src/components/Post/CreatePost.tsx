import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCreatePost } from '../../hooks/useCreatePost';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const { currentUser } = useAuth();
  const { handleCreatePost, loading } = useCreatePost();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load image');
      }
    }
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
        currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      );
      
      cleanup();
    } catch (error) {
      // Error is already handled in useCreatePost
      console.error('Error in CreatePost:', error);
    }
  };

  const cleanup = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview('');
    setCaption('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  cleanup();
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            ''
            // <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            //   <Camera className="w-12 h-12 text-gray-400" />
            //   <span className="mt-2 text-sm text-gray-500">Choose a photo</span>
            //   <input
            //     type="file"
            //     accept="image/*"
            //     onChange={handleImageChange}
            //     className="hidden"
            //   />
            // </label>
          )}
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading || (!image && !caption.trim())}
          className="w-full py-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {loading ? 'Creating...' : 'Share'}
        </button>
      </form>
    </motion.div>
  );
}
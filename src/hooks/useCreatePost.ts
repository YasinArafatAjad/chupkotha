import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../lib/firebase/posts/createPost';
import { validateImageFile } from '../lib/firebase/posts/validators';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useData();

  const handleCreatePost = async (
    userId: string,
    image: File | null,
    caption: string,
    userName: string,
    userPhoto: string
  ) => {
    setLoading(true);
    try {
      if (image) {
        validateImageFile(image);
      }

      await createPost(userId, image, caption, userName, userPhoto);
      await refreshData();
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePost, loading };
}
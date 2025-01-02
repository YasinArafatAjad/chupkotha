import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../lib/services/postDeletionService';

export function usePostDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (postId: string, imageUrl?: string): Promise<boolean> => {
    if (isDeleting) return false;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    
    if (!confirmDelete) return false;

    setIsDeleting(true);
    try {
      const success = await deletePost(postId, imageUrl);
      if (success) {
        navigate('/');
      }
      return success;
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
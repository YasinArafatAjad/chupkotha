import { useState } from 'react';
import { CommentService } from '../lib/firebase/comments/commentService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function useComments(postId: string) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const addComment = async (text: string) => {
    if (!currentUser) {
      toast.error('Please sign in to comment');
      return false;
    }

    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }

    setLoading(true);
    try {
      const commentData = {
        text: text.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}&background=random`
      };

      await CommentService.addComment(postId, commentData);
      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addComment,
    loading
  };
}
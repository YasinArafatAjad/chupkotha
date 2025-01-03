import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { savePost, unsavePost, isPostSaved } from '../lib/firebase/posts/savedPostsService';

export function useSavePost(postId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (currentUser && postId) {
        const saved = await isPostSaved(currentUser.uid, postId);
        setIsSaved(saved);
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [currentUser, postId]);

  const toggleSave = async () => {
    if (!currentUser) return false;
    
    const success = isSaved 
      ? await unsavePost(currentUser.uid, postId)
      : await savePost(currentUser.uid, postId);
      
    if (success) {
      setIsSaved(!isSaved);
    }
    return success;
  };

  return { isSaved, loading, toggleSave };
}
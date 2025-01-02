import { useState, useEffect } from 'react';
import { getDocs } from 'firebase/firestore';
import { Post } from '../lib/types';
import { createUserPostsQuery } from '../lib/firebase/posts/userPostsQuery';
import { handleFirestoreError } from '../lib/firebase/errors/handleFirestoreError';

export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const q = createUserPostsQuery(userId);
        const snapshot = await getDocs(q);
        const userPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        setPosts(userPosts);
      } catch (error) {
        handleFirestoreError(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return { posts, loading };
}
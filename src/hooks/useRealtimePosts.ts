import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config/firebase';
import { Post } from '../lib/types';
import toast from 'react-hot-toast';

export function useRealtimePosts(limitCount: number = 20) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(newPosts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { posts, loading };
}
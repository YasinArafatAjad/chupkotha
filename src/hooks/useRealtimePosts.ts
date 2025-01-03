import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import toast from 'react-hot-toast';

export function useRealtimePosts(limitCount: number = 20) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create query that only gets public posts
    const q = query(
      collection(db, 'posts'),
      where('isPublic', '!=', false),
      orderBy('isPublic'),
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
        toast.error('Failed to load live posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { posts, loading };
}
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createSamplePosts } from '../lib/firebase/samplePosts';
import { useFirebaseOperation } from './useFirebaseOperation';
import toast from 'react-hot-toast';

export function useInitialLoad() {
  const [posts, setPosts] = useState<any[]>([]);
  const { execute, loading, error } = useFirebaseOperation();

  useEffect(() => {
    const loadInitialData = async () => {
      // Try to load from cache first
      const cachedPosts = localStorage.getItem('cachedPosts');
      const lastFetch = localStorage.getItem('lastFetch');
      const ONE_HOUR = 60 * 60 * 1000;

      if (cachedPosts && lastFetch && Date.now() - parseInt(lastFetch) < ONE_HOUR) {
        setPosts(JSON.parse(cachedPosts));
        return;
      }

      const result = await execute(async () => {
        const q = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetchedPosts.length === 0) {
          await createSamplePosts();
          const newSnapshot = await getDocs(q);
          return newSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        return fetchedPosts;
      });

      if (result) {
        setPosts(result);
        localStorage.setItem('cachedPosts', JSON.stringify(result));
        localStorage.setItem('lastFetch', Date.now().toString());
      } else if (!cachedPosts) {
        toast.error('Unable to load posts. Please check your connection.');
      }
    };

    loadInitialData();
  }, [execute]);

  return { loading, posts, error };
}
import { useState, useEffect } from 'react';
import { OfflineStore } from '../db/indexedDB';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const offlineStore = new OfflineStore();

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Save posts to IndexedDB
      for (const post of posts) {
        await offlineStore.savePost(post);
      }
    } catch (error) {
      console.error('Error syncing posts:', error);
    }
  };

  return {
    isOnline,
    syncPosts,
    offlineStore
  };
}
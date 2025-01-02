import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useNetworkStatus } from './useNetworkStatus';

export function useOfflineCache() {
  const { isOnline } = useNetworkStatus();
  const [cache, setCache] = useState<any>({});

  const cachePost = async (post: any) => {
    try {
      const request = indexedDB.open('postCache', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('posts')) {
          db.createObjectStore('posts', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['posts'], 'readwrite');
        const store = transaction.objectStore('posts');
        store.put(post);
      };
    } catch (error) {
      console.error('Error caching post:', error);
    }
  };

  const getCachedPosts = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('postCache', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['posts'], 'readonly');
        const store = transaction.objectStore('posts');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
        
        getAllRequest.onerror = () => {
          reject(getAllRequest.error);
        };
      };
    });
  };

  return {
    cachePost,
    getCachedPosts,
    isOnline
  };
}
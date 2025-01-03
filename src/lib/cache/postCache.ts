import { Post } from '../types';

const CACHE_KEY = 'postCache';
const CACHE_TIMESTAMP_KEY = 'postCacheTimestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const postCache = {
  set(posts: Post[]) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error caching posts:', error);
    }
  },

  get(): Post[] | null {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp || Date.now() - parseInt(timestamp) > CACHE_DURATION) {
        return null;
      }
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }
};
import { useState, useEffect } from 'react';
import { Post } from '../types/post';
import { getPosts } from '../data/posts';
import { useOfflineCache } from './useOfflineCache';
import toast from 'react-hot-toast';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOnline, cachePost } = useOfflineCache();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        
        // Cache posts for offline access
        fetchedPosts.forEach(post => cachePost(post));
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return {
    posts,
    loading,
    isOnline
  };
}
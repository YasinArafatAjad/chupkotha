import { useState, useEffect } from 'react';
import { Post } from '../lib/types';
import { getAllPosts } from '../lib/services/posts';
import toast from 'react-hot-toast';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error('Failed to load some posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const loadMore = async () => {
    // Implement pagination later if needed
    console.log('Load more not implemented yet');
  };

  return { posts, loading, hasMore, loadMore };
}
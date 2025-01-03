import { useState, useEffect } from 'react';
import postsData from '../components/preReady_post/posts.json';
import { Post } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';

export function usePreloadedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate network delay for a more realistic experience
    const timer = setTimeout(() => {
      setPosts(postsData.posts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId && currentUser) {
          const isLiked = post.likes.includes(currentUser.uid);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== currentUser.uid)
              : [...post.likes, currentUser.uid]
          };
        }
        return post;
      })
    );
    return true;
  };

  const handleComment = (postId: string, comment: any) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment]
          };
        }
        return post;
      })
    );
  };

  return { posts, loading, handleLike, handleComment };
}
import { useState, useEffect } from 'react';
import { localDB, Post, User } from '../lib/storage/localStorageDB';

export function useLocalStorage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await localDB.initializeSampleData();
        const fetchedPosts = await localDB.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost = await localDB.createPost(postData);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const likePost = async (postId: string, userId: string) => {
    await localDB.likePost(postId, userId);
    const updatedPosts = await localDB.getPosts();
    setPosts(updatedPosts);
  };

  const addComment = async (postId: string, comment: any) => {
    const newComment = await localDB.addComment(postId, comment);
    const updatedPosts = await localDB.getPosts();
    setPosts(updatedPosts);
    return newComment;
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    addComment
  };
}
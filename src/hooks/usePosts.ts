import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import postsData from '../components/preReady_post/posts.json';
import toast from 'react-hot-toast';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(postsData.posts);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(postsQuery, 
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        // Combine Firestore posts with preReady posts
        const combinedPosts = [...fetchedPosts, ...postsData.posts];
        
        // Remove duplicates based on id
        const uniquePosts = Array.from(new Map(
          combinedPosts.map(post => [post.id, post])
        ).values());

        setPosts(uniquePosts);
        if (snapshot.docs.length > 0) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        // If Firestore fails, ensure preReady posts are shown
        setPosts(postsData.posts);
        setLoading(false);
        toast.error('Unable to load live posts. Showing cached content.');
      }
    );

    return () => unsubscribe();
  }, []);

  const loadMore = async () => {
    if (!lastDoc || !hasMore) return;

    try {
      const nextQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(10)
      );

      const snapshot = await getDocs(nextQuery);
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      if (newPosts.length < 10) {
        setHasMore(false);
      }

      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast.error('Failed to load more posts');
    }
  };

  return { posts, loading, hasMore, loadMore };
}
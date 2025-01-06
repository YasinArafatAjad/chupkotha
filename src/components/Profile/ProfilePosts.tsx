import { useState, useEffect } from 'react';
import { Grid, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import PostCard from '../Post/PostCard';
import { Post } from '../../lib/types';
import LoadingAnimation from '../common/LoadingAnimation';

interface ProfilePostsProps {
  userId: string;
  posts: Post[];
  loading?: boolean;
}

export default function ProfilePosts({ userId, posts, loading }: ProfilePostsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (activeTab !== 'saved') return;
      
      setLoadingSaved(true);
      try {
        // Get user's saved post IDs
        const userDoc = await getDoc(doc(db, 'users', userId));
        const savedPostIds = userDoc.data()?.savedPosts || [];

        // Fetch each saved post
        const savedPostsPromises = savedPostIds.map(async (postId: string) => {
          const postDoc = await getDoc(doc(db, 'posts', postId));
          if (postDoc.exists()) {
            return { id: postDoc.id, ...postDoc.data() } as Post;
          }
          return null;
        });

        const fetchedPosts = (await Promise.all(savedPostsPromises)).filter((post): post is Post => post !== null);
        setSavedPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedPosts();
  }, [userId, activeTab]);

  if (loading || loadingSaved) {
    return <LoadingAnimation />;
  }

  const displayedPosts = activeTab === 'posts' ? posts : savedPosts;

  return (
    <div>
      <div className="flex border-t dark:border-gray-800">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
            activeTab === 'posts' ? 'border-t-2 border-primary' : ''
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
            activeTab === 'saved' ? 'border-t-2 border-primary' : ''
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Saved</span>
        </button>
      </div>

      {displayedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          {activeTab === 'posts' ? (
            <>
              <Grid className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm">Share your first post with the world!</p>
            </>
          ) : (
            <>
              <Bookmark className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No saved posts</p>
              <p className="text-sm">Posts you save will appear here</p>
            </>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 py-4"
        >
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimePosts } from '../../hooks/useRealtimePosts';
import { getLocalPosts } from '../../lib/services/posts/localPosts';
import PostCard from '../Post/PostCard';
import LoadingAnimation from '../common/LoadingAnimation';

export default function RealtimeFeed() {
  const { posts: livePosts, loading: liveLoading } = useRealtimePosts();
  const [localPosts, setLocalPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load preReady posts
    const preReadyPosts = getLocalPosts();
    setLocalPosts(preReadyPosts);
    setLoading(false);
  }, []);

  if (liveLoading || loading) {
    return <LoadingAnimation />;
  }

  // Combine and sort all posts by date
  const allPosts = [...livePosts, ...localPosts].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <AnimatePresence mode="popLayout">
      {allPosts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          layout
        >
          <PostCard post={post} />
        </motion.div>
      ))}
      {allPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No posts to show</p>
        </div>
      )}
    </AnimatePresence>
  );
}
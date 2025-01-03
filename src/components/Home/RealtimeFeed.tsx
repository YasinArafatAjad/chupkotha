import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimePosts } from '../../hooks/useRealtimePosts';
import PostCard from '../Post/PostCard';
import LoadingAnimation from '../common/LoadingAnimation';

export default function RealtimeFeed() {
  const { posts, loading } = useRealtimePosts();

  if (loading) {
    return <LoadingAnimation />;
  }

  // Filter out private posts
  const publicPosts = posts.filter(post => post.isPublic !== false);

  return (
    <AnimatePresence mode="popLayout">
      {publicPosts.map((post) => (
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
      {publicPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No posts to show</p>
        </div>
      )}
    </AnimatePresence>
  );
}
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimePosts } from '../../hooks/useRealtimePosts';
import PostCard from '../Post/PostCard';
import LoadingAnimation from '../common/LoadingAnimation';

export default function RealtimeFeed() {
  const { posts, loading } = useRealtimePosts();

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <AnimatePresence mode="popLayout">
      {posts.map((post) => (
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
    </AnimatePresence>
  );
}
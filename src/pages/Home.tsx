import { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePosts } from '../hooks/usePosts';
import { useOfflineSync } from '../lib/hooks/useOfflineSync';
import LoadingState from '../components/Home/LoadingState';
import OfflineWarning from '../components/Home/OfflineWarning';
import PostList from '../components/Home/PostList';
import LoadMoreButton from '../components/Home/LoadMoreButton';

export default function Home() {
  const { posts, loading, hasMore, loadMore } = usePosts();
  const { isOnline } = useOfflineSync();
  const loadingRef = useRef(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  if (loading && posts.length === 0) {
    return <LoadingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <OfflineWarning isOnline={isOnline} />
      <PostList posts={posts} />
      <LoadMoreButton hasMore={hasMore} loadMore={loadMore} ref={loadingRef} />
    </motion.div>
  );
}
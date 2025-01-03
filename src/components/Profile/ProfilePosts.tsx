import { useState } from 'react';
import { Grid, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
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

  if (loading) {
    return <LoadingAnimation />;
  }

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

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Grid className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Share your first post with the world!</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 py-4"
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
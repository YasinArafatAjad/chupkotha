import { useState } from 'react';
import { Grid, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOfflineCache } from '../../hooks/useOfflineCache';
import LazyImage from '../common/LazyImage';

interface ProfilePostsProps {
  userId: string;
  posts: Array<{
    id: string;
    imageUrl: string;
    likes: string[];
  }>;
}

export default function ProfilePosts({ userId, posts }: ProfilePostsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const { isOnline } = useOfflineCache();

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

      {!isOnline && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
          You're offline. Some content may not be available.
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square relative group"
          >
            <LazyImage
              src={post.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <div className="flex items-center space-x-2">
                <span>❤️</span>
                <span>{post.likes.length}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
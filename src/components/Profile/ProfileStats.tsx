import { motion } from 'framer-motion';

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function ProfileStats({ postsCount, followersCount, followingCount }: ProfileStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-around py-4 border-y dark:border-gray-800"
    >
      <div className="text-center">
        <div className="font-semibold">{postsCount}</div>
        <div className="text-sm text-gray-500">Posts</div>
      </div>
      <div className="text-center">
        <div className="font-semibold">{followersCount}</div>
        <div className="text-sm text-gray-500">Followers</div>
      </div>
      <div className="text-center">
        <div className="font-semibold">{followingCount}</div>
        <div className="text-sm text-gray-500">Following</div>
      </div>
    </motion.div>
  );
}
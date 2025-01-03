import { motion } from 'framer-motion';
import { Copy, AtSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileInfoProps {
  displayName: string;
  username: string;
  userId: string;
  bio: string;
  website?: string;
}

export default function ProfileInfo({ 
  displayName, 
  username, 
  userId,
  bio,
  website
}: ProfileInfoProps) {
  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    toast.success('User ID copied to clipboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">{displayName}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <AtSign className="w-4 h-4 mr-1" />
            <span>{username}</span>
          </div>
        </div>
        <button 
          onClick={handleCopyUserId}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
        >
          <span className="font-mono">{userId.slice(0, 8)}...</span>
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {bio && (
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {bio}
        </p>
      )}

      {website && (
        <a 
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary hover:underline"
        >
          <Globe className="w-4 h-4" />
          <span>{website}</span>
        </a>
      )}
    </motion.div>
  );
}
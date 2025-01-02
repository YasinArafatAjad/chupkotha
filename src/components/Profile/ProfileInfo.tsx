import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileInfoProps {
  displayName: string;
  username: string;
  userId: string;  // Add userId prop
  bio: string;
  website: string;
}

export default function ProfileInfo({ 
  displayName, 
  username, 
  userId,  // Add userId to destructuring
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
      className="p-4 space-y-2"
    >
      <h1 className="text-xl font-bold">{displayName}</h1>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>@{username}</span>
        <button 
          onClick={handleCopyUserId}
          className="inline-flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="font-mono">{userId.slice(0, 8)}...</span>
          <Copy className="w-4 h-4" />
        </button>
      </div>
      {bio && <p className="text-gray-800 dark:text-gray-200">{bio}</p>}
      {website && (
        <a 
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {website}
        </a>
      )}
    </motion.div>
  );
}
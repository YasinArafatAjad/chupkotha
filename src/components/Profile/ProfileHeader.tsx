import { Settings, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  profile: {
    displayName: string;
    photoURL: string;
    bio: string;
    email: string;
    website?: string;
    followers: string[];
    following: string[];
    postsCount: number;
  };
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

export default function ProfileHeader({ profile, isOwnProfile, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-6">
        <img
          src={profile.photoURL || 'https://via.placeholder.com/80'}
          alt={profile.displayName}
          className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-700"
        />
        
        <div className="flex-1 space-y-4">
          {/* profile name */}
            <h1 className="capitalize text-2xl font-bold">{profile.displayName}</h1>  
          {/* bio */}
          {profile.bio && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
            >
              {profile.bio}
            </motion.p>
          )}
          

          
        </div>
      </div>

      <div className="flex justify-around py-4 border-t border-b dark:border-gray-800">
        <div className="text-center">
          <div className="font-semibold">{profile.postsCount || 0}</div>
          <div className="text-sm text-gray-500">Posts</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{profile.followers?.length || 0}</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{profile.following?.length || 0}</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
      </div>
      <div className="flex flex-col justify-around py-1 dark:border-gray-800">
        {/* info */}
        <h3 className="capitalize text-md font-bold py-2">Info</h3>
        
          <div className="space-y-2 text-sm">
            {profile.email && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
    </div>
    </div>
  );
}
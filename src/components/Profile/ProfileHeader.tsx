import { User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  profile: {
    displayName: string;
    photoURL: string;
    bio: string;
    followers: string[];
    following: string[];
    postsCount: number;
  };
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

export default function ProfileHeader({ profile, isOwnProfile, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={profile.photoURL || 'https://via.placeholder.com/80'}
          alt={profile.displayName}
          className="w-20 h-20 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{profile.displayName}</h1>
          <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
        </div>
      </div>

      <div className="flex justify-around text-center">
        <div>
          <div className="font-semibold">{profile.postsCount}</div>
          <div className="text-sm text-gray-500">Posts</div>
        </div>
        <div>
          <div className="font-semibold">{profile.followers?.length || 0}</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        <div>
          <div className="font-semibold">{profile.following?.length || 0}</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
      </div>

      {isOwnProfile && (
        <button
          onClick={onEditProfile}
          className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      )}
    </div>
  );
}
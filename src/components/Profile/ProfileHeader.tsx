import {  Settings } from 'lucide-react';

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
          src={profile.photoURL || 'https://plus.unsplash.com/premium_photo-1732333561328-fb8ff00d3665?q=80&w=1347&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
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
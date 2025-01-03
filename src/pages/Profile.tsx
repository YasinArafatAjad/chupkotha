import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeProfile } from '../hooks/useRealtimeProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { toggleFollow } from '../lib/services/followService';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileActions from '../components/Profile/ProfileActions';
import ProfilePosts from '../components/Profile/ProfilePosts';
import EditProfileModal from '../components/Profile/EditProfileModal';
import LoadingAnimation from '../components/common/LoadingAnimation';

export default function Profile() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { profile, loading } = useRealtimeProfile(userId || '');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { posts, loading: postsLoading } = useUserPosts(userId || '');

  const isFollowing = profile?.followers?.includes(currentUser?.uid || '') || false;

  const handleFollow = async () => {
    if (!currentUser || !profile) return;
    await toggleFollow(currentUser.uid, profile.id, isFollowing);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Profile not found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The user you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === userId;

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => setShowEditProfile(true)}
      />
      <ProfileActions
        userId={userId!}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onEditProfile={() => setShowEditProfile(true)}
      />
      <ProfilePosts 
        userId={userId!} 
        posts={posts} 
        loading={postsLoading} 
      />
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
}
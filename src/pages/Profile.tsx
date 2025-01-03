import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserPosts } from '../hooks/useUserPosts';
import { User } from '../lib/types';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileActions from '../components/Profile/ProfileActions';
import ProfilePosts from '../components/Profile/ProfilePosts';
import EditProfileModal from '../components/Profile/EditProfileModal';
import LoadingAnimation from '../components/common/LoadingAnimation';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { posts, loading: postsLoading } = useUserPosts(userId || '');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setProfile(userData);
          setIsFollowing(userData.followers?.includes(currentUser?.uid || '') || false);
        } else {
          toast.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || !profile) return;

    const userRef = doc(db, 'users', profile.id);
    const currentUserRef = doc(db, 'users', currentUser.uid);

    try {
      if (isFollowing) {
        await updateDoc(userRef, {
          followers: arrayRemove(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(profile.id)
        });
      } else {
        await updateDoc(userRef, {
          followers: arrayUnion(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(profile.id)
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      throw error;
    }
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
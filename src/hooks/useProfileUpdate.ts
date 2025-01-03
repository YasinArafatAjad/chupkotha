import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../lib/firebase/profile/profileService';
import toast from 'react-hot-toast';

export function useProfileUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const updateProfile = async (
    displayName: string,
    bio: string,
    newImage: File | null
  ) => {
    if (!currentUser) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile(currentUser, { displayName, bio }, newImage);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
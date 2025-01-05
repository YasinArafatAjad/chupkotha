import { useState } from 'react';
import { updateUserBirthDate } from '../lib/services/user/userProfileService';
import toast from 'react-hot-toast';

export function useUserProfile() {
  const [loading, setLoading] = useState(false);

  const updateBirthDate = async (userId: string, birthDate: string) => {
    setLoading(true);
    try {
      await updateUserBirthDate(userId, birthDate);
      toast.success('Birth date updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update birth date');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateBirthDate
  };
}
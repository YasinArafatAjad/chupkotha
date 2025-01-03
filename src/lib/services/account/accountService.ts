import { deleteUserAuth } from './deleteUserAuth';
import { deleteUserContent } from './deleteUserContent';
import { deleteUserProfile } from './deleteUserProfile';
import toast from 'react-hot-toast';

export async function deleteUserAccount(userId: string) {
  try {
    // Delete in specific order to maintain data integrity
    await deleteUserContent(userId);
    await deleteUserProfile(userId);
    await deleteUserAuth();
    
    return true;
  } catch (error: any) {
    console.error('Error deleting account:', error);
    
    // Provide more specific error messages
    const errorMessage = (() => {
      if (error.code === 'auth/requires-recent-login') {
        return 'Please log out and log in again to delete your account';
      }
      return error.message || 'Failed to delete account';
    })();
    
    toast.error(errorMessage);
    throw error;
  }
}
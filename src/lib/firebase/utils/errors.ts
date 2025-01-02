import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

export function handleFirebaseError(error: unknown): never {
  console.error('Firebase operation failed:', error);

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'unavailable':
        toast.error('Service temporarily unavailable. Please try again later.');
        break;
      case 'permission-denied':
        toast.error('You don\'t have permission to perform this action.');
        break;
      case 'not-found':
        toast.error('The requested resource was not found.');
        break;
      default:
        toast.error('An unexpected error occurred. Please try again.');
    }
  } else {
    toast.error('An unexpected error occurred. Please try again.');
  }

  throw error;
}
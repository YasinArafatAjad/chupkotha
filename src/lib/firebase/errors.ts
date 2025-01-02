import toast from 'react-hot-toast';

export const handleFirebaseError = (error: any) => {
  console.error('Firebase Error:', error);
  
  const errorMessage = (() => {
    switch (error.code) {
      case 'auth/invalid-api-key':
        return 'Invalid Firebase configuration. Please check your environment variables.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred';
    }
  })();

  toast.error(errorMessage);
  return errorMessage;
};
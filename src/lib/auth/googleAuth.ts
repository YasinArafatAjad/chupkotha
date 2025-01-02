import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile } from './userProfile';
import toast from 'react-hot-toast';

export async function signInWithGoogle() {
  try {
    // Configure Google provider
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Attempt sign in
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    console.error('Google auth error:', error);
    
    switch (error.code) {
      case 'auth/popup-blocked':
        toast.error(
          'Popup was blocked. Please allow popups for this site to sign in with Google.',
          { duration: 5000 }
        );
        break;
      case 'auth/popup-closed-by-user':
        toast.error('Sign in cancelled');
        break;
      case 'auth/unauthorized-domain':
        toast.error('This domain is not authorized for Google sign in');
        break;
      default:
        toast.error('Failed to sign in with Google');
    }
    throw error;
  }
}
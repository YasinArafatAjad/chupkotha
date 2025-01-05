import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function updateUserEmail(newEmail: string, currentPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error('No authenticated user found');
  }

  try {
    // First reauthenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Send verification email to new address
    await sendEmailVerification(user, {
      handleCodeInApp: true,
      url: window.location.origin
    });

    // Then update email
    await updateEmail(user, newEmail);
    
    toast.success('Verification email sent. Please check your inbox and verify your new email address.');
    return true;
  } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
      toast.error('Please log out and log back in to change your email');
    } else if (error.code === 'auth/email-already-in-use') {
      toast.error('This email is already in use');
    } else if (error.code === 'auth/invalid-email') {
      toast.error('Invalid email address');
    } else if (error.code === 'auth/wrong-password') {
      toast.error('Incorrect password');
    } else {
      toast.error(error.message || 'Failed to update email');
    }
    throw error;
  }
}
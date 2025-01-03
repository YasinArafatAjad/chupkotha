import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { uploadProfileImage } from '../lib/firebase/storage';
import { signInWithGoogle } from '../lib/auth/googleAuth';
import { createUserDocument } from '../lib/services/userService';
import toast from 'react-hot-toast';
import SignUpForm from '../components/auth/SignUpForm';
import WelcomeSection from '../components/auth/WelcomeSection';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignUp = async (
    email: string,
    password: string,
    displayName: string,
    birthDate: string,
    profileImage: File | null
  ) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
      
      if (profileImage) {
        photoURL = await uploadProfileImage(profileImage, user.uid);
      }
      
      await updateProfile(user, {
        displayName,
        photoURL
      });

      // Create user document with additional data
      await createUserDocument(user, { birthDate });

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (error) {
      // Error is already handled in signInWithGoogle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <WelcomeSection />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <SignUpForm
          onSubmit={handleEmailSignUp}
          onGoogleSignUp={handleGoogleSignUp}
          loading={loading}
        />
      </div>
    </div>
  );
}
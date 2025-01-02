import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle } from '../lib/firebase/auth';
import { uploadProfileImage } from '../lib/firebase/storage';
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
    profileImage: File | null
  ) => {
    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password, displayName);
      if (profileImage && user) {
        const photoURL = await uploadProfileImage(profileImage, user.uid);
        await user.updateProfile({ photoURL });
      }
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
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
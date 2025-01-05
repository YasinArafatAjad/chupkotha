import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config/firebase';
import { uploadToCloudinary } from '../../cloudinary';
import { createUserProfile } from '../profile/createProfile';
import toast from 'react-hot-toast';

interface SignupData {
  email: string;
  password: string;
  displayName: string;
  birthDate: string;
  profileImage: File | null;
}

export async function signUp(data: SignupData) {
  try {
    // Create auth user
    const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Upload profile image if provided
    let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName)}`;
    if (data.profileImage) {
      photoURL = await uploadToCloudinary(data.profileImage, 'profiles');
    }

    // Update auth profile
    await updateProfile(user, {
      displayName: data.displayName,
      photoURL
    });

    // Create user profile document
    await createUserProfile(user, {
      birthDate: data.birthDate,
      displayName: data.displayName,
      photoURL
    });

    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}
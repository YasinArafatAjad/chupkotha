import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { uploadToCloudinary } from '../../cloudinary';
import { deleteProfileImage } from './imageService';
import { validateProfileData } from './validators';
import toast from 'react-hot-toast';

interface ProfileUpdate {
  displayName: string;
  bio: string;
  website: string;
}

export async function createUserProfile(user: User, data?: { birthDate?: string }) {
  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    displayNameLower: user.displayName?.toLowerCase(),
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}&background=random`,
    createdAt: new Date().toISOString(),
    followers: [],
    following: [],
    ...(data?.birthDate && { birthDate: data.birthDate })
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
}

export async function updateUserProfile(
  user: User,
  data: ProfileUpdate,
  newImage: File | null
): Promise<boolean> {
  try {
    validateProfileData(data);

    let photoURL = user.photoURL;

    if (newImage) {
      // Delete old profile image if it exists
      await deleteProfileImage(user.photoURL);
      
      // Upload new image
      photoURL = await uploadToCloudinary(newImage, 'profiles');
    }

    // Update auth profile
    await user.updateProfile({
      displayName: data.displayName,
      photoURL
    });

    // Update Firestore user document
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      displayName: data.displayName,
      displayNameLower: data.displayName.toLowerCase(),
      photoURL,
      bio: data.bio,
      website: data.website,
      updatedAt: new Date().toISOString()
    });

    toast.success('Profile updated successfully');
    return true;
  } catch (error: any) {
    console.error('Profile update error:', error);
    toast.error(error.message || 'Failed to update profile');
    throw error;
  }
}
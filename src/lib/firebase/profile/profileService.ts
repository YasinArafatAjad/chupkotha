import { User, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../../cloudinary';
import { validateProfileData } from './validators';
import toast from 'react-hot-toast';

interface ProfileUpdate {
  displayName: string;
  bio: string;
  website: string;
  photoURL?: string;
}

export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Failed to load profile');
    throw error;
  }
}

export async function updateUserProfile(
  user: User,
  data: ProfileUpdate,
  newImage: File | null
): Promise<boolean> {
  try {
    // Validate profile data
    validateProfileData(data);

    let photoURL = user.photoURL;

    if (newImage) {
      photoURL = await uploadToCloudinary(newImage, 'profiles');
    }

    // Update auth profile
    await updateProfile(user, {
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
    const errorMessage = error.message || 'Failed to update profile';
    toast.error(errorMessage);
    throw error;
  }
}
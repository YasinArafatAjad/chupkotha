import { User, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadProfileImage } from '../storage';
import toast from 'react-hot-toast';

interface ProfileUpdate {
  displayName: string;
  bio: string;
  photoURL?: string;
}

export async function updateUserProfile(
  user: User,
  data: ProfileUpdate,
  newImage: File | null
): Promise<boolean> {
  try {
    console.log('Starting profile update for user:', user.uid);
    let photoURL = user.photoURL;

    if (newImage) {
      console.log('Uploading new profile image');
      photoURL = await uploadProfileImage(newImage, user.uid);
      console.log('New photo URL:', photoURL);
    }

    // Update auth profile
    console.log('Updating auth profile');
    await updateProfile(user, {
      displayName: data.displayName,
      photoURL
    });

    // Update Firestore user document
    console.log('Updating Firestore document');
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      displayName: data.displayName,
      photoURL,
      bio: data.bio,
      updatedAt: new Date().toISOString()
    });

    console.log('Profile update completed successfully');
    toast.success('Profile updated successfully');
    return true;
  } catch (error: any) {
    console.error('Profile update error:', error);
    const errorMessage = error.message || 'Failed to update profile';
    toast.error(errorMessage);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    console.log('Fetching profile for user:', userId);
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('Profile found');
      return userDoc.data();
    }
    console.log('Profile not found');
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
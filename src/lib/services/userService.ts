import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { User } from 'firebase/auth';
import { createUserProfile as createProfile } from './profile/profileService';

interface UserData {
  displayName: string;
  email: string;
  photoURL: string;
  birthDate: string;
  displayNameLower: string;
  createdAt: any;
  followers: string[];
  following: string[];
}

export async function createUserDocument(
  user: User,
  additionalData: { birthDate: string }
): Promise<void> {
  await createProfile(user, additionalData);
}
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';
import { createUserProfile } from '../../services/profile/profileService';

export async function createOrUpdateUser(user: User) {
  return createUserProfile(user);
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}
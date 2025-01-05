import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';

interface ProfileData {
  birthDate?: string;
  displayName?: string;
  photoURL?: string;
}

export async function createUserProfile(user: User, data?: ProfileData) {
  const userRef = doc(db, 'users', user.uid);
  
  const displayName = data?.displayName || user.displayName || user.email?.split('@')[0] || 'Anonymous';
  const photoURL = data?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName,
    displayNameLower: displayName.toLowerCase(),
    photoURL,
    createdAt: new Date().toISOString(),
    followers: [],
    following: [],
    ...(data?.birthDate && { birthDate: data.birthDate })
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
}
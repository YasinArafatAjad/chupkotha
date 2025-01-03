import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { User } from 'firebase/auth';

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
  const userRef = doc(db, 'users', user.uid);
  
  // Ensure displayName is never undefined
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  
  const userData: UserData = {
    displayName,
    displayNameLower: displayName.toLowerCase(),
    email: user.email || '',
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`,
    birthDate: additionalData.birthDate,
    createdAt: serverTimestamp(),
    followers: [],
    following: []
  };

  await setDoc(userRef, userData);
}
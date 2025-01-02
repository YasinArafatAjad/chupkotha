import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from 'firebase/auth';

export async function createOrUpdateUser(user: User) {
  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    displayNameLower: user.displayName?.toLowerCase(),
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}&background=random`,
    lastActive: serverTimestamp(),
    isOnline: true,
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}
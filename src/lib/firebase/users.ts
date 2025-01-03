import { doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './';

export const createUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    displayNameLower: user.displayName?.toLowerCase() || '',
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}&background=random`,
    createdAt: new Date().toISOString(),
    followers: [],
    following: []
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
};
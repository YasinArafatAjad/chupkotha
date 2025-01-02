import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}`,
    createdAt: new Date().toISOString(),
    followers: [],
    following: []
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
}
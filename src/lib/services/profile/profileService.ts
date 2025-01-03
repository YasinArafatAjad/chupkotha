import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { getProfilePhotoUrl } from '../../utils/profile/photoUtils';

interface ProfileData {
  uid: string;
  email: string | null;
  displayName: string;
  displayNameLower: string;
  photoURL: string;
  lastActive: any;
  isOnline: boolean;
  updatedAt: any;
}

export async function createUserProfile(user: User): Promise<ProfileData> {
  const userRef = doc(db, 'users', user.uid);
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  
  const profileData: ProfileData = {
    uid: user.uid,
    email: user.email,
    displayName,
    displayNameLower: displayName.toLowerCase(),
    photoURL: getProfilePhotoUrl(user.photoURL, displayName),
    lastActive: serverTimestamp(),
    isOnline: true,
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef, profileData, { merge: true });
  return profileData;
}
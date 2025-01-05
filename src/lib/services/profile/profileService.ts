import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { createProfileData, UserProfileData } from '../../utils/user/profileUtils';

export async function createUserProfile(
  user: User, 
  additionalData?: { birthDate?: string }
): Promise<UserProfileData> {
  const userRef = doc(db, 'users', user.uid);
  
  const baseProfile = createProfileData(user, additionalData);
  
  const profileData: UserProfileData = {
    ...baseProfile,
    lastActive: serverTimestamp(),
    isOnline: true,
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef, profileData);
  return profileData;
}
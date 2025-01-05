import { User } from 'firebase/auth';

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string;
  displayNameLower: string;
  photoURL: string;
  birthDate?: string | null;
  lastActive: any;
  isOnline: boolean;
  updatedAt: any;
}

export function createProfileData(user: User, additionalData?: { birthDate?: string }): Omit<UserProfileData, 'lastActive' | 'updatedAt' | 'isOnline'> {
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  
  return {
    uid: user.uid,
    email: user.email,
    displayName,
    displayNameLower: displayName.toLowerCase(),
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`,
    ...(additionalData?.birthDate ? { birthDate: additionalData.birthDate } : {})
  };
}
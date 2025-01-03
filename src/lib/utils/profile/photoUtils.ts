import { DEFAULT_PROFILE_IMAGE, getDefaultProfileImage } from './defaultImage';

export function getProfilePhotoUrl(photoURL: string | null, displayName: string): string {
  if (photoURL) return photoURL;
  return displayName ? getDefaultProfileImage(displayName) : DEFAULT_PROFILE_IMAGE;
}
import { ProfileUpdate } from '../../../lib/firebase/profile/types';

export function validateProfileData(data: ProfileUpdate): void {
  if (!data.displayName.trim()) {
    throw new Error('Display name is required');
  }

  if (data.website) {
    try {
      new URL(data.website);
    } catch {
      throw new Error('Please enter a valid website URL');
    }
  }

  if (data.bio && data.bio.length > 150) {
    throw new Error('Bio must be less than 150 characters');
  }
}
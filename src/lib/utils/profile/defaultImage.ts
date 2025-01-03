// Constants for default profile images
export const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40';

export function getDefaultProfileImage(displayName: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
}
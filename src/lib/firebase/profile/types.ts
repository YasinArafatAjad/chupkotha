export interface ProfileUpdate {
  displayName: string;
  bio: string;
  website: string;
  photoURL?: string;
}

export interface UserProfile extends ProfileUpdate {
  id: string;
  email: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}
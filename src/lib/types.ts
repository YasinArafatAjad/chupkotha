export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  createdAt: any;
  isPublic?: boolean;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
}
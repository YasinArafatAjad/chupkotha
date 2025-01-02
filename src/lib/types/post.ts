export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  likesCount: string;
  sharesCount: string;
  comments: Comment[];
  createdAt: string;
  isPublic: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}
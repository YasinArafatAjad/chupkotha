import { serverTimestamp } from 'firebase/firestore';

interface PostDataParams {
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl: string;
  caption: string;
  isPublic: boolean;
}

export function createPostData({
  userId,
  userName,
  userPhoto,
  imageUrl,
  caption,
  isPublic
}: PostDataParams) {
  return {
    userId,
    userName,
    userPhoto,
    imageUrl,
    caption,
    captionLower: caption.toLowerCase(),
    likes: [],
    comments: [],
    isPublic,
    createdAt: serverTimestamp()
  };
}
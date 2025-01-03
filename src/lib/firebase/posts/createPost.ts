import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadPostImage } from '../storage/imageUpload';
import { validatePostInput } from './validators';
import toast from 'react-hot-toast';

export async function createPost(
  userId: string,
  image: File | null,
  caption: string,
  userName: string,
  userPhoto: string
) {
  try {
    validatePostInput(image, caption);

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadPostImage(image, userId);
    }

    const postData = {
      userId,
      userName,
      userPhoto,
      imageUrl,
      caption,
      captionLower: caption.toLowerCase(),
      likes: [],
      comments: [],
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return { id: docRef.id, ...postData };
  } catch (error: any) {
    console.error('Error creating post:', error);
    throw new Error(error.message || 'Failed to create post');
  }
}
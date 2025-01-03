import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../';
import { uploadToCloudinary } from '../../cloudinary';
import { validatePostInput } from './validators';
import { createPostData } from './utils';
import toast from 'react-hot-toast';

export async function createPost(
  userId: string,
  image: File | null,
  caption: string,
  userName: string,
  userPhoto: string,
  isPublic: boolean = true
) {
  try {
    validatePostInput(image, caption);

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadToCloudinary(image);
    }

    const postData = createPostData({
      userId,
      userName,
      userPhoto,
      imageUrl,
      caption,
      isPublic
    });

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return { id: docRef.id, ...postData };
  } catch (error: any) {
    console.error('Error creating post:', error);
    throw new Error(error.message || 'Failed to create post');
  }
}
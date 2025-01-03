import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './';
import { uploadImage } from './storage';
import { FirebaseError } from './errors';

export async function createPost(
  userId: string, 
  image: File, 
  caption: string, 
  userName: string, 
  userPhoto: string
) {
  try {
    // Upload image first
    const imageUrl = await uploadImage(image, `posts/${userId}`);

    // Create post document
    const postData = {
      userId,
      userName,
      userPhoto,
      imageUrl,
      caption,
      likes: [],
      comments: [],
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return docRef.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    throw new FirebaseError('Failed to create post', undefined, error);
  }
}
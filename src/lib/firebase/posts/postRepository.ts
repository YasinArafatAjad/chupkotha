import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post } from '../../types';

export const createPostDocument = async (
  postData: Omit<Post, 'id' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const createUserPostReference = async (
  userId: string,
  postId: string
): Promise<void> => {
  await addDoc(collection(db, `users/${userId}/posts`), {
    postId,
    createdAt: serverTimestamp()
  });
};
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export async function savePost(userId: string, postId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedPosts: arrayUnion(postId)
    });
    toast.success('Post saved');
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    toast.error('Failed to save post');
    return false;
  }
}

export async function unsavePost(userId: string, postId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedPosts: arrayRemove(postId)
    });
    toast.success('Post removed from saved');
    return true;
  } catch (error) {
    console.error('Error unsaving post:', error);
    toast.error('Failed to remove post from saved');
    return false;
  }
}

export async function isPostSaved(userId: string, postId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const savedPosts = userDoc.data()?.savedPosts || [];
    return savedPosts.includes(postId);
  } catch (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
}
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function updatePostPrivacy(postId: string, isPublic: boolean): Promise<boolean> {
  try {
    const postRef = doc(db, 'posts', postId);
    
    // Verify post exists before updating
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }

    await updateDoc(postRef, {
      isPublic,
      updatedAt: new Date().toISOString()
    });
    
    toast.success(`Post is now ${isPublic ? 'public' : 'private'}`);
    return true;
  } catch (error) {
    console.error('Error updating post privacy:', error);
    toast.error('Failed to update post privacy');
    return false;
  }
}
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function deletePost(postId: string, imageUrl?: string): Promise<boolean> {
  try {
    // Delete image from storage if exists
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    // Delete post document
    await deleteDoc(doc(db, 'posts', postId));
    
    toast.success('Post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    return false;
  }
}
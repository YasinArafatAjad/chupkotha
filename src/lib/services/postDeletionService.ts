import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function deletePost(postId: string, imageUrl?: string): Promise<boolean> {
  try {
    // Delete post document from Firestore
    await deleteDoc(doc(db, 'posts', postId));
    
    // Note: We don't need to delete the image from Cloudinary
    // as it will be handled by their asset management
    
    toast.success('Post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    return false;
  }
}
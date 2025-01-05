import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { deleteFromCloudinary } from '../../cloudinary';
import toast from 'react-hot-toast';

export async function deletePost(postId: string, imageUrl?: string): Promise<boolean> {
  try {
    // First try to delete the image from Cloudinary
    if (imageUrl) {
      const imageDeleted = await deleteFromCloudinary(imageUrl);
      if (!imageDeleted) {
        throw new Error('Failed to delete image');
      }
    }

    // Then delete the post document from Firestore
    await deleteDoc(doc(db, 'posts', postId));
    
    toast.success('Post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    return false;
  }
}
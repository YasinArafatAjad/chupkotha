import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function deletePost(postId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    toast.success('Post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    return false;
  }
}
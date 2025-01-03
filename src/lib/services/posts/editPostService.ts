import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function editPostCaption(postId: string, newCaption: string): Promise<boolean> {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      caption: newCaption,
      captionLower: newCaption.toLowerCase(),
      updatedAt: new Date().toISOString()
    });
    
    toast.success('Caption updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating caption:', error);
    toast.error('Failed to update caption');
    return false;
  }
}
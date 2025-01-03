import { collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { createNotification } from './notificationService';
import toast from 'react-hot-toast';

export class PostService {
  static async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        toast.error('Post not found');
        return false;
      }

      const postData = postDoc.data();
      const likes: string[] = postData?.likes || [];
      const isLiked = likes.includes(userId);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });

      // Create notification for like
      if (!isLiked && userId !== postData.userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        await createNotification(
          postData.userId,
          'like',
          postId,
          {
            id: userId,
            name: userData?.displayName || 'Anonymous',
            photo: userData?.photoURL || `https://ui-avatars.com/api/?name=Anonymous`
          }
        );
      }

      return !isLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
      return false;
    }
  }
}
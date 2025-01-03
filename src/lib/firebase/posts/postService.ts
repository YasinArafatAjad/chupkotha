import { collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove, DocumentReference } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export class PostService {
  private static getPostRef(postId: string): DocumentReference {
    return doc(db, 'posts', postId);
  }

  static async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      const postRef = this.getPostRef(postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        toast.error('Post not found');
        return false;
      }

      const likes: string[] = postDoc.data()?.likes || [];
      const isLiked = likes.includes(userId);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });

      return !isLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
      return false;
    }
  }
}
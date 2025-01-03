import { collection, addDoc, serverTimestamp, DocumentReference } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

interface CommentData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}

export class CommentService {
  static async addComment(postId: string, commentData: CommentData) {
    try {
      const commentsRef = collection(db, `posts/${postId}/comments`);
      
      const comment = {
        ...commentData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(commentsRef, comment);
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }
}
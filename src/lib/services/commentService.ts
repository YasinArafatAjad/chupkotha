import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { createNotification } from './notificationService';
import toast from 'react-hot-toast';

interface CommentData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}

export class CommentService {
  static async addComment(postId: string, commentData: CommentData, postUserId: string) {
    try {
      const commentsRef = collection(db, `posts/${postId}/comments`);
      
      const comment = {
        ...commentData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(commentsRef, comment);

      // Create notification for comment
      if (commentData.userId !== postUserId) {
        await createNotification(
          postUserId,
          'comment',
          postId,
          {
            id: commentData.userId,
            name: commentData.userName,
            photo: commentData.userPhoto
          }
        );
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }
}
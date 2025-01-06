import { collection, addDoc, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { createNotification } from '../notificationService';
import { Comment, CommentInput } from './types';
import toast from 'react-hot-toast';

export class CommentService {
  static async addComment(postId: string, input: CommentInput, postUserId: string): Promise<string> {
    if (!postId || !input.text.trim()) {
      throw new Error('Invalid comment data');
    }

    try {
      // Create the comment with timestamp
      const timestamp = new Date().toISOString();
      const comment: Omit<Comment, 'id'> = {
        text: input.text.trim(),
        userId: input.userId,
        userName: input.userName,
        userPhoto: input.userPhoto,
        createdAt: timestamp
      };

      // Add comment to comments collection
      const commentsRef = collection(db, `posts/${postId}/comments`);
      const commentDoc = await addDoc(commentsRef, comment);

      // Create comment reference for post's comments array
      const commentRef = {
        ...comment,
        id: commentDoc.id
      };

      // Update post document with new comment
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef)
      });

      // Create notification for post owner if not self-commenting
      if (input.userId !== postUserId) {
        await createNotification(
          postUserId,
          'comment',
          postId,
          {
            id: input.userId,
            name: input.userName,
            photo: input.userPhoto
          }
        );
      }

      return commentDoc.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  }

  static async deleteComment(postId: string, commentId: string): Promise<boolean> {
    if (!postId || !commentId) {
      throw new Error('Invalid comment deletion data');
    }

    try {
      // Delete the comment document
      const commentRef = doc(db, `posts/${postId}/comments`, commentId);
      await deleteDoc(commentRef);

      // Update the post's comments array
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({ id: commentId })
      });

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  }
}
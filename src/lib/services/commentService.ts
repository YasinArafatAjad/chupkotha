import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
      // Create comment document
      const commentsRef = collection(db, `posts/${postId}/comments`);
      const comment = {
        ...commentData,
        createdAt: serverTimestamp()
      };

      // Add comment to comments collection
      const commentDoc = await addDoc(commentsRef, comment);

      // Update post document to include comment reference
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: commentDoc.id,
          ...comment
        })
      });

      // Create notification for comment if not own post
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

      toast.success('Comment added');
      return commentDoc.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw new Error('Failed to add comment');
    }
  }

  static async deleteComment(postId: string, commentId: string) {
    try {
      // Delete comment document
      await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));

      // Update post document to remove comment
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayRemove(commentId)
      });

      toast.success('Comment deleted');
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  }
}
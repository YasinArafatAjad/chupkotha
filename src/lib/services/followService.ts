import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { createNotification } from './notificationService';
import toast from 'react-hot-toast';

export async function toggleFollow(
  currentUserId: string,
  targetUserId: string,
  isFollowing: boolean
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', targetUserId);
    const currentUserRef = doc(db, 'users', currentUserId);

    if (isFollowing) {
      // Unfollow
      await updateDoc(userRef, {
        followers: arrayRemove(currentUserId)
      });
      await updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId)
      });
    } else {
      // Follow
      await updateDoc(userRef, {
        followers: arrayUnion(currentUserId)
      });
      await updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId)
      });

      // Create notification for new follow
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();

      await createNotification(
        targetUserId,
        'follow',
        '',  // No postId for follow notifications
        {
          id: currentUserId,
          name: currentUserData?.displayName || 'Anonymous',
          photo: currentUserData?.photoURL || `https://ui-avatars.com/api/?name=Anonymous`
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error toggling follow:', error);
    toast.error('Failed to update follow status');
    return false;
  }
}
import { deleteDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase/config/firebase';

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user's posts
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const postsSnapshot = await getDocs(postsQuery);
    
    for (const postDoc of postsSnapshot.docs) {
      const post = postDoc.data();
      // Only attempt to delete Firebase Storage images
      if (post.imageUrl && post.imageUrl.includes(storage.app.options.storageBucket)) {
        try {
          const imageRef = ref(storage, post.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Error deleting image:', error);
          // Continue with deletion even if image deletion fails
        }
      }
      await deleteDoc(postDoc.ref);
    }

    // Delete profile image if it's in Firebase Storage
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    if (userData?.photoURL && userData.photoURL.includes(storage.app.options.storageBucket)) {
      try {
        const profileImageRef = ref(storage, userData.photoURL);
        await deleteObject(profileImageRef);
      } catch (error) {
        console.warn('Error deleting profile image:', error);
        // Continue with deletion even if profile image deletion fails
      }
    }

    // Delete user document
    await deleteDoc(doc(db, 'users', userId));

    // Delete Firebase Auth user
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }

    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}
import { deleteDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { db, storage, auth } from '../firebase/config/firebase';

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user's posts
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const postsSnapshot = await getDocs(postsQuery);
    
    for (const postDoc of postsSnapshot.docs) {
      const post = postDoc.data();
      // Delete post image if exists
      if (post.imageUrl) {
        const imageRef = ref(storage, post.imageUrl);
        await deleteObject(imageRef);
      }
      await deleteDoc(postDoc.ref);
    }

    // Delete profile image
    const profileImagesRef = ref(storage, `profile_images/${userId}`);
    const profileImages = await listAll(profileImagesRef);
    await Promise.all(profileImages.items.map(item => deleteObject(item)));

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
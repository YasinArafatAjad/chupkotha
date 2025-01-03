import { deleteDoc, doc, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { deleteUserImages } from './deleteUserImages';

export async function deleteUserData(userId: string) {
  // Delete user's posts
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const postsSnapshot = await getDocs(postsQuery);
  
  // Delete posts and their images
  for (const postDoc of postsSnapshot.docs) {
    const post = postDoc.data();
    await deleteUserImages(post.imageUrl);
    await deleteDoc(postDoc.ref);
  }

  // Get and delete user profile data
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  if (userData?.photoURL) {
    await deleteUserImages(userData.photoURL);
  }

  // Delete user document
  await deleteDoc(doc(db, 'users', userId));
}
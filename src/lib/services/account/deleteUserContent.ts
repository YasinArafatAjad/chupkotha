import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';

export async function deleteUserContent(userId: string) {
  // Delete posts
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const postsSnapshot = await getDocs(postsQuery);
  
  for (const doc of postsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }

  // Delete comments
  const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
  const commentsSnapshot = await getDocs(commentsQuery);
  
  for (const doc of commentsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
}
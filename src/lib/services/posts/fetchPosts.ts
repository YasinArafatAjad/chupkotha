import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { Post } from '../../types';
import { handleFirestoreError } from '../../firebase/errors/handleFirestoreError';

export async function fetchLivePosts(): Promise<Post[]> {
  try {
    // Create query with index-supported structure
    const q = query(
      collection(db, 'posts'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    handleFirestoreError(error);
    return [];
  }
}
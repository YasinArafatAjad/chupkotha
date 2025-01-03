import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import { Post } from '../../types';

export async function fetchLivePosts(): Promise<Post[]> {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching live posts:', error);
    return [];
  }
}
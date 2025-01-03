```typescript
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { Post } from '../types';
import postsData from '../../components/preReady_post/posts.json';

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

export function getLocalPosts(): Post[] {
  return postsData.posts;
}

export async function getAllPosts(): Promise<Post[]> {
  const [livePosts, localPosts] = await Promise.all([
    fetchLivePosts(),
    Promise.resolve(getLocalPosts())
  ]);

  const combinedPosts = [...livePosts, ...localPosts];
  
  // Sort by createdAt in descending order
  return combinedPosts.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}
```
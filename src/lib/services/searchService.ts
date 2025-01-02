import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config/firebase';
import { User, Post } from '../types';

export interface SearchResult {
  type: 'user' | 'post' | 'comment';
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  link: string;
}

export async function globalSearch(searchQuery: string): Promise<SearchResult[]> {
  if (!searchQuery || searchQuery.length < 2) return [];

  try {
    const results: SearchResult[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    
    // Search users
    const usersRef = collection(db, 'users');
    const usersQuery = query(
      usersRef,
      where('displayNameLower', '>=', lowerQuery),
      where('displayNameLower', '<=', lowerQuery + '\uf8ff'),
      limit(5)
    );
    
    // Search posts
    const postsRef = collection(db, 'posts');
    const postsQuery = query(
      postsRef,
      where('captionLower', '>=', lowerQuery),
      where('captionLower', '<=', lowerQuery + '\uf8ff'),
      limit(5)
    );

    const [usersSnapshot, postsSnapshot] = await Promise.all([
      getDocs(usersQuery),
      getDocs(postsQuery)
    ]);

    // Process user results
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data() as User;
      results.push({
        type: 'user',
        id: doc.id,
        title: userData.displayName,
        subtitle: `${userData.followers?.length || 0} followers`,
        imageUrl: userData.photoURL,
        link: `/profile/${doc.id}`
      });
    });

    // Process post results
    postsSnapshot.docs.forEach(doc => {
      const postData = doc.data() as Post;
      results.push({
        type: 'post',
        id: doc.id,
        title: postData.userName,
        subtitle: postData.caption,
        imageUrl: postData.imageUrl,
        link: `/post/${doc.id}`
      });
    });

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
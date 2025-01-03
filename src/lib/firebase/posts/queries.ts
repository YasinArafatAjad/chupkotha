import { collection, query, orderBy, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../';

const POSTS_PER_PAGE = 10;

export function getPostsQuery() {
  try {
    return query(
      collection(db, 'posts'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    );
  } catch (error) {
    console.error('Error creating posts query:', error);
    // Fallback to a simpler query if the compound query fails
    return query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    );
  }
}

export function getMorePostsQuery(lastDoc: any) {
  try {
    return query(
      collection(db, 'posts'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(POSTS_PER_PAGE)
    );
  } catch (error) {
    console.error('Error creating more posts query:', error);
    // Fallback to a simpler query if the compound query fails
    return query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(POSTS_PER_PAGE)
    );
  }
}
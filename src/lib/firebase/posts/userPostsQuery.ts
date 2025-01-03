import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export function createUserPostsQuery(userId: string) {
  return query(
    collection(db, 'posts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
}
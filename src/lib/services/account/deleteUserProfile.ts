import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';

export async function deleteUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
}
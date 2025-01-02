import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const updateUserStatus = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
      isOnline: true
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};
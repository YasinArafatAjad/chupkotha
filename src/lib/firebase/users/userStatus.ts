import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const updateUserStatus = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    const statusUpdate = {
      lastActive: serverTimestamp(),
      isOnline: true
    };

    if (!userSnap.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        ...statusUpdate,
        createdAt: serverTimestamp()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, statusUpdate);
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config/firebase';
import toast from 'react-hot-toast';

export async function updateUserBirthDate(userId: string, birthDate: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      birthDate,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating birth date:', error);
    toast.error('Failed to update birth date');
    return false;
  }
}
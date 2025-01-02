import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './init';

export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `profile_images/${userId}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
}
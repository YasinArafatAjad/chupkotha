import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config/firebase';

export async function deleteUserImages(imageUrl: string | undefined) {
  if (!imageUrl || !imageUrl.includes(storage.app.options.storageBucket)) {
    return;
  }

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('Error deleting image:', error);
    // Continue execution even if image deletion fails
  }
}
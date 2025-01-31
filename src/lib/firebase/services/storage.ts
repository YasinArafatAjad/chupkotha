import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../index';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    {/* if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }

     if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
     } */}

    const ext = file.name.split('.').pop();
    const fileName = `${nanoid()}.${ext}`;
    const fullPath = `${path}/${fileName}`;
    
    const storageRef = ref(storage, fullPath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(snapshot.ref);
  } catch (error: any) {
    toast.error(error.message || 'Failed to upload image');
    throw error;
  }
}
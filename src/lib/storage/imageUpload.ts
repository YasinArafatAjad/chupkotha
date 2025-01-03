import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import { nanoid } from 'nanoid';
import { validateImageFile } from './validators';
import toast from 'react-hot-toast';
import { uploadImage } from '../lib/storage';

// Example usage
const handleUpload = async (file: File) => {
  try {
    const imageUrl = await uploadImage(file, 'posts');
    // Use the imageUrl...
  } catch (error) {
    // Error is already handled with toast
  }
};


export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImageFile(file);
    
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
    console.error('Upload error:', error);
    toast.error(error.message || 'Failed to upload image');
    throw error;
  }
}
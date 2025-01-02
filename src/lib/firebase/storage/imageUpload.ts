import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Create unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${nanoid()}.${ext}`;
    const fullPath = `profile_images/${userId}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, fullPath);
    
    // Upload file with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        userId
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

export async function uploadPostImage(file: File, userId: string): Promise<string> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Create unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${nanoid()}.${ext}`;
    const fullPath = `post_images/${userId}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, fullPath);
    
    // Upload file with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        userId
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
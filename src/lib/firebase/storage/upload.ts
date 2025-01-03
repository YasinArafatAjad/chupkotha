import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, storageConfig } from './config';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

export async function uploadFile(file: File, path: string): Promise<string> {
  // Validate file
  if (!storageConfig.allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only images are allowed.');
  }

  if (file.size > storageConfig.maxSizeMB * 1024 * 1024) {
    throw new Error(`File size must be less than ${storageConfig.maxSizeMB}MB`);
  }

  try {
    // Create unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${nanoid()}.${ext}`;
    const fullPath = `${path}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, fullPath);

    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(snapshot.ref);
  } catch (error: any) {
    console.error('Upload error:', error);
    toast.error('Failed to upload file. Please try again.');
    throw error;
  }
}
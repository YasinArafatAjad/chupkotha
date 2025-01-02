import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { nanoid } from 'nanoid';
import { validateImageFile } from './validators';

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  validateImageFile(file);

  const ext = file.name.split('.').pop();
  const fileName = `${nanoid()}.${ext}`;
  const fullPath = `${path}/${fileName}`;
  
  const storageRef = ref(storage, fullPath);
  const metadata = {
    contentType: file.type,
    customMetadata: { originalName: file.name }
  };
  
  const snapshot = await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(snapshot.ref);
};
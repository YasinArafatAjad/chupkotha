import { getStorage } from 'firebase/storage';
import { app } from '../app';
import { uploadProfileImage, uploadPostImage } from './imageUpload';

// Initialize storage instance
export const storage = getStorage(app);

// Export storage functions
export { uploadProfileImage, uploadPostImage };
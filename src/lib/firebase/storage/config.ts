import { getStorage } from 'firebase/storage';
import { app } from '../app';

export const storage = getStorage(app);

export const storageConfig = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
};

export const getImageUrl = (path: string) => {
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${app.options.storageBucket}/o`;
  const encodedPath = encodeURIComponent(path);
  return `${baseUrl}/${encodedPath}?alt=media`;
};
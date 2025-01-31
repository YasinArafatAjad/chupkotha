import { getStorage } from 'firebase/storage';
import { app } from '../firebase/app';

export const storage = getStorage(app);

export const storageConfig = {
  maxSizeMB: 10240000
  allowedTypes: ['image/*', 'video/*'],
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
};

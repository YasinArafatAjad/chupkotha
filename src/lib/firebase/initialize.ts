import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  initialized: boolean;
}

export async function initializeFirebase(): Promise<FirebaseServices> {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    return {
      app,
      auth,
      db,
      storage,
      initialized: true
    };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}
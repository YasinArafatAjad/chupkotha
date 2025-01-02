import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { enableIndexedDbPersistence } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function useFirebaseConnection() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirestore = async () => {
      try {
        // Validate environment variables
        const requiredEnvVars = [
          'VITE_FIREBASE_API_KEY',
          'VITE_FIREBASE_AUTH_DOMAIN',
          'VITE_FIREBASE_PROJECT_ID'
        ];

        const missingEnvVars = requiredEnvVars.filter(
          varName => !import.meta.env[varName]
        );

        if (missingEnvVars.length > 0) {
          throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }

        // Try to enable offline persistence
        try {
          await enableIndexedDbPersistence(db);
        } catch (err: any) {
          if (err.code === 'failed-precondition') {
            console.log('Offline persistence unavailable: Multiple tabs open');
          } else if (err.code === 'unimplemented') {
            console.log('Offline persistence unavailable: Browser not supported');
          }
          // Continue initialization even if persistence fails
        }

        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to initialize Firebase';
        console.error('Firebase initialization error:', err);
        setError(errorMessage);
        toast.error(errorMessage);
        // Still set initialized to true so the app can attempt to function
        setIsInitialized(true);
      }
    };

    initializeFirestore();
  }, []);

  return { isInitialized, error };
}
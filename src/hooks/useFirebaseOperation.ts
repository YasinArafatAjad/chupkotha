import { useState } from 'react';
import { retryOperation } from '../lib/firebase/utils/retry';
import { handleFirebaseError } from '../lib/firebase/utils/errors';

export function useFirebaseOperation<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      return await retryOperation(operation);
    } catch (error) {
      setError(error as Error);
      handleFirebaseError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
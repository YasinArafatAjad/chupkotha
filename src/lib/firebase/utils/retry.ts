import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: boolean;
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof FirebaseError && error.code === 'unavailable') {
        if (attempt === maxAttempts) {
          toast.error('Service temporarily unavailable. Please try again later.');
          break;
        }

        const delay = backoff ? delayMs * attempt : delayMs;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }

  throw lastError;
}
import { auth } from '../index';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createUserProfile } from './user';
import toast from 'react-hot-toast';

export async function signUp(email: string, password: string, displayName: string) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await createUserProfile(user);
    return user;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
}
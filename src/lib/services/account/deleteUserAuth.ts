import { deleteUser } from 'firebase/auth';
import { auth } from '../../firebase/config/firebase';

export async function deleteUserAuth() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user found');
  }
  await deleteUser(currentUser);
  return true;
}
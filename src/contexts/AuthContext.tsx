import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { updateUserStatus } from '../lib/firebase/users/userStatus';
import { createOrUpdateUser } from '../lib/firebase/users/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Create/update user document when user signs in
        await createOrUpdateUser(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update user status periodically
  useEffect(() => {
    if (!currentUser) return;

    // Update immediately when user logs in
    updateUserStatus(currentUser.uid);

<<<<<<< HEAD
    // Update every 10seconds
    const interval = setInterval(() => {
      updateUserStatus(currentUser.uid);
    }, 10000);
=======
    // Update every 5 minutes
    const interval = setInterval(() => {
      updateUserStatus(currentUser.uid);
    }, 300000);
>>>>>>> c988de1180cd1ecf0ce9e4db881888397e5cad28

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../lib/types';
import toast from 'react-hot-toast';

export function useRealtimeProfile(userId: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          setProfile({ id: doc.id, ...doc.data() } as User);
        } else {
          setProfile(null);
          toast.error('User not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { profile, loading };
}
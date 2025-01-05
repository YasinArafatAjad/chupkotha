import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ActiveUser {
  id: string;
  displayName: string;
  photoURL: string;
  lastActive: any;
  isOnline: boolean;
}

export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Set timeout for considering a user offline (10 seconds)
    const OFFLINE_THRESHOLD = 1 * 10 * 1000; // 10 seconds in milliseconds

    // Simplified query that only uses lastActive
    const q = query(
      collection(db, 'users'),
      orderBy('lastActive', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const now = Date.now();
        const users = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const lastActive = data.lastActive?.toDate?.();
            const timeSinceLastActive = lastActive ? now - lastActive.getTime() : Infinity;
            
            return {
              id: doc.id,
              ...data,
              // Consider user online only if their last activity was within threshold
              isOnline: timeSinceLastActive < OFFLINE_THRESHOLD
            } as ActiveUser;
          })
          .filter(user => 
            user.id !== currentUser?.uid && // Exclude current user
            user.isOnline // Only include online users
          );
        
        setActiveUsers(users);
      },
      (error) => {
        console.error('Error fetching active users:', error);
        setActiveUsers([]);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const getDisplayName = (name: string) => {
    if (!name) return 'User';
    const firstName = name.split(' ')[0];
    return firstName || 'User';
  };

  return (
    <div className="py-4 border-b dark:border-gray-800">
      <div className="flex space-x-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {activeUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/chat/${user.id}`} className="block relative">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`}
                alt={user.displayName || 'User'}
                className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800"
              />
              <span 
                className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <div className="mt-1 text-xs text-center text-gray-600 dark:text-gray-400 truncate max-w-[64px]">
                {getDisplayName(user.displayName)}
              </div>
            </Link>
          </motion.div>
        ))}
        {activeUsers.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
            No active users
          </div>
        )}
      </div>
    </div>
  );
}
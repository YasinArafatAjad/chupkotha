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
}

export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('lastActive', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ActiveUser))
        .filter(user => user.id !== currentUser?.uid);
      
      setActiveUsers(users);
    });

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
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              <div className="mt-1 text-xs text-center text-gray-600 dark:text-gray-400 truncate max-w-[64px]">
                {getDisplayName(user.displayName)}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
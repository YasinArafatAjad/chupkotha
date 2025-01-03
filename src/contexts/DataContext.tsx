import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { postCache } from '../lib/cache/postCache';
import { Post, User } from '../lib/types';
import toast from 'react-hot-toast';

interface DataContextType {
  posts: Post[];
  users: User[];
  refreshData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  posts: [],
  users: [],
  refreshData: async () => {},
  loading: true
});

export const useData = () => useContext(DataContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const loadData = async () => {
    try {
      // Try to load from cache first
      const cachedPosts = postCache.get();
      if (cachedPosts) {
        setPosts(cachedPosts);
        setLoading(false);
        return;
      }

      // Load fresh data with pagination
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const [postsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(postsQuery),
        getDocs(collection(db, 'users'))
      ]);

      const fetchedPosts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      const fetchedUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      setPosts(fetchedPosts);
      setUsers(fetchedUsers);
      postCache.set(fetchedPosts);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
      
      const cachedPosts = postCache.get();
      if (cachedPosts) {
        setPosts(cachedPosts);
        toast.success('Loaded from cache');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    postCache.clear();
    await loadData();
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  return (
    <DataContext.Provider value={{ posts, users, refreshData, loading }}>
      {children}
    </DataContext.Provider>
  );
}
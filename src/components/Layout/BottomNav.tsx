import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useUnreadMessages } from '../../hooks/useUnreadMessages';
import UnreadBadge from '../Chat/UnreadBadge';
import SettingsMenu from '../Settings/SettingsMenu';

export default function BottomNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { currentUser } = useAuth();
  const unreadCount = useUnreadMessages(currentUser?.uid);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around h-14">
              <Link to="/" className={`${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
                <Home className="w-6 h-6" />
              </Link>
              <Link to="/explore" className={`${isActive('/explore') ? 'text-primary' : 'text-gray-500'}`}>
                <Search className="w-6 h-6" />
              </Link>
              <Link to="/create" className="text-primary">
                <PlusSquare className="w-6 h-6" />
              </Link>
              <Link 
                to="/chat" 
                className={`relative ${isActive('/chat') ? 'text-primary' : 'text-gray-500'}`}
              >
                <MessageCircle className="w-6 h-6" />
                <UnreadBadge count={unreadCount} />
              </Link>
              <Link 
                to={`/profile/${currentUser?.uid}`} 
                className={`${isActive(`/profile/${currentUser?.uid}`) ? 'text-primary' : 'text-gray-500'}`}
              >
                <User className="w-6 h-6" />
              </Link>
              <SettingsMenu />
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
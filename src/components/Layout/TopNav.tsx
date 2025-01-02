import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Camera, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToUnreadMessages } from '../../lib/firebase/chat/messageService';
import toast from 'react-hot-toast';

export default function TopNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUnreadMessages(currentUser.uid, (count) => {
      setUnreadCount(count);
      if (count > 0) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore autoplay restrictions
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSearchClick = () => {
    navigate('/explore');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 border-b dark:border-gray-800"
        >
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">ChupKotha</span>
            </Link>
            
            <button
              onClick={handleSearchClick}
              className="relative w-full max-w-xs mx-4"
            >
              <div className="w-full pl-10 pr-4 py-1 rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer">
                Search...
              </div>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </button>

            <Link to="/chat" className="relative">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.div>
              )}
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
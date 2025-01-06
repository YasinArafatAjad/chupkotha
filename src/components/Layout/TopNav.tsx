import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBadge from '../common/NotificationBadge';
import NotificationItem from '../common/NotificationItem';
import Logo from './Logo';

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentUser } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < 10 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Hide top nav in chat
  const isChat = location.pathname.startsWith('/chat/');
  if (isChat) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 border-b dark:border-gray-800"
        >
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <NotificationBadge count={notifications.length} />
              </button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
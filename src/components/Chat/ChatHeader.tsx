import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ChatHeaderProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto: string;
}

export default function ChatHeader({ recipientId, recipientName, recipientPhoto }: ChatHeaderProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to user's online status
    const userRef = doc(db, 'users', recipientId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Consider user online if last active within last 2 minutes
        const lastActiveTime = data.lastActive?.toDate();
        if (lastActiveTime) {
          const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
          setIsOnline(lastActiveTime > twoMinutesAgo);
          setLastActive(lastActiveTime);
        }
      }
    });

    return () => unsubscribe();
  }, [recipientId]);

  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (lastActive) {
      return `Last active ${formatDistanceToNow(lastActive, { addSuffix: true })}`;
    }
    return 'Offline';
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center space-x-4">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={recipientPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}`}
              alt={recipientName}
              className="w-8 h-8 rounded-full"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{recipientName}</h2>
            <p className="text-xs text-gray-500">
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
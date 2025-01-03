import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingAnimation from '../common/LoadingAnimation';
import ActiveUsers from './ActiveUsers';
import ConversationItem from './ConversationItem';
import { 
  Conversation, 
  getConversationsQuery,
  mapConversationData,
  togglePinConversation 
} from '../../lib/services/conversationService';

export default function ChatUserList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const query = getConversationsQuery(currentUser.uid);
    
    const unsubscribe = onSnapshot(query, {
      next: async (snapshot) => {
        try {
          const conversationPromises = snapshot.docs.map(doc => 
            mapConversationData(doc.data())
          );

          const mappedConversations = await Promise.all(conversationPromises);
          const validConversations = mappedConversations.filter((conv): conv is Conversation => 
            conv !== null
          );

          // Sort conversations: pinned first, then by last message time
          const sortedConversations = validConversations.sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
              return a.isPinned ? -1 : 1;
            }
            return b.lastMessageTime?.toDate?.() - a.lastMessageTime?.toDate?.();
          });

          setConversations(sortedConversations);
        } catch (error) {
          console.error('Error loading conversations:', error);
          toast.error('Failed to load conversations');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('Conversation subscription error:', error);
        toast.error('Failed to load conversations');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleTogglePin = async (userId: string, isPinned: boolean) => {
    if (!currentUser) return;
    
    try {
      await togglePinConversation(currentUser.uid, userId, !isPinned);
      toast.success(isPinned ? 'Conversation unpinned' : 'Conversation pinned');
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ActiveUsers />
      
      <div className="p-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="divide-y dark:divide-gray-800">
        {filteredConversations.map((conversation) => (
          <motion.div
            key={conversation.userId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${conversation.isPinned ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
          >
            <ConversationItem 
              conversation={conversation}
              onTogglePin={handleTogglePin}
            />
          </motion.div>
        ))}

        {filteredConversations.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
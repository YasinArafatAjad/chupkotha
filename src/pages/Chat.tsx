import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ChatBox from '../components/Chat/ChatBox';
import ChatUserList from '../components/Chat/ChatUserList';
import LoadingAnimation from '../components/common/LoadingAnimation';

export default function Chat() {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    photo: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setSelectedUser(null);
        return;
      }

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setSelectedUser({
            id: userDoc.id,
            name: userDoc.data().displayName,
            photo: userDoc.data().photoURL
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (userId && selectedUser) {
    return (
      <ChatBox
        recipientId={selectedUser.id}
        recipientName={selectedUser.name}
        recipientPhoto={selectedUser.photo}
      />
    );
  }

  return <ChatUserList />;
}
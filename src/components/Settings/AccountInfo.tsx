import { useAuth } from '../../contexts/AuthContext';
import { User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountInfo() {
  const { currentUser } = useAuth();

  const handleCopyUser = async () => {
    try {
      const userId = `${currentUser?.uid}`;
      await navigator.clipboard.writeText(userId);
      toast.success('User name copied');
    } catch (error) {
      toast.error('Failed to copy user name');
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Account Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">User ID</span>
          </div>
          <code onClick={handleCopyUser} className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {currentUser?.uid}
          </code>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Email</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentUser?.email}
          </span>
        </div>
      </div>
    </section>
  );
}
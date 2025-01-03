import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Edit2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function AccountInfo() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleCopyUser = async () => {
    try {
      const userId = `${currentUser?.uid}`;
      await navigator.clipboard.writeText(userId);
      toast.success('User ID copied');
    } catch (error) {
      toast.error('Failed to copy user ID');
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser || !displayName.trim()) return;

    setLoading(true);
    try {
      await updateProfile(currentUser, { displayName: displayName.trim() });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
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
          <code 
            onClick={handleCopyUser} 
            className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {currentUser?.uid}
          </code>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Display Name</span>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter display name"
              />
              <button
                onClick={handleUpdateProfile}
                disabled={loading || !displayName.trim()}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(currentUser?.displayName || '');
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser?.displayName}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Edit display name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
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
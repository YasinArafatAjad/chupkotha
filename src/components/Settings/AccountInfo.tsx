import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Pencil } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { useUserProfile } from '../../hooks/useUserProfile';
import toast from 'react-hot-toast';
import { format } from 'date-fns';



export default function AccountInfo() {
  const { currentUser } = useAuth();
  const { loading: profileLoading, updateBirthDate } = useUserProfile();
  const [isEditing, setIsEditing] = useState<'displayName' | 'birthDate' | null>(null);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '');
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
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleUpdateBirthDate = async () => {
    if (!currentUser || !birthDate) {
      toast.error('Birth date is required');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    if (birth > today) {
      toast.error('Birth date cannot be in the future');
      return;
    }

    const age = calculateAge(birthDate);
    if (age < 13) {
      toast.error('You must be at least 13 years old');
      return;
    }

    const success = await updateBirthDate(currentUser.uid, birthDate);
    if (success) {
      setIsEditing(null);
      toast.success('Birth date updated successfully');
    }
  };

  const formatBirthDate = (date: string) => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch {
      return 'Not set';
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Account Information</h2>
      
      <div className="space-y-4">
        {/* User ID Section */}
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

        {/* Display Name Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Display Name</span>
          </div>
          {isEditing === 'displayName' ? (
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
                  setIsEditing(null);
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
                onClick={() => setIsEditing('displayName')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Edit display name"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Email</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentUser?.email}
          </span>
        </div>

        {/* Birth Date Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Birth Date</span>
          </div>
          {isEditing === 'birthDate' ? (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleUpdateBirthDate}
                disabled={profileLoading || !birthDate}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {profileLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(null);
                  setBirthDate(currentUser?.birthDate || '');
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser?.birthDate ? formatBirthDate(currentUser?.birthDate) : 'Not set'}
              </span>
              <button
                onClick={() => setIsEditing('birthDate')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Edit birth date"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
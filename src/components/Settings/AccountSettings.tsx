import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { deleteUserAccount } from '../../lib/services/accountService';
import DeleteAccountModal from './DeleteAccountModal';
import toast from 'react-hot-toast';

export default function AccountSettings({ onClose }: { onClose: () => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    try {
      await deleteUserAccount(currentUser.uid);
      toast.success('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
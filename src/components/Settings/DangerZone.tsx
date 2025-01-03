import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccountDeletion } from '../../hooks/useAccountDeletion';
import DeleteAccountModal from './DeleteAccountModal';
import toast from 'react-hot-toast';

export default function DangerZone() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentUser } = useAuth();
  const { deleting, handleDeleteAccount } = useAccountDeletion();

  const handleConfirmDelete = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to delete your account');
      return;
    }

    const success = await handleDeleteAccount(currentUser.uid);
    if (!success) {
      setShowDeleteModal(false);
    }
  };

  return (
    <section className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5" />
        Danger Zone
      </h2>
      
      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      <button
        onClick={() => setShowDeleteModal(true)}
        disabled={deleting}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete Account'}
      </button>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../lib/services/account/accountService';
import toast from 'react-hot-toast';

export function useAccountDeletion() {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (userId: string) => {
    setDeleting(true);
    try {
      await deleteUserAccount(userId);
      toast.success('Account deleted successfully');
      navigate('/login');
      return true;
    } catch (error) {
      // Error is already handled in deleteUserAccount
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    handleDeleteAccount
  };
}
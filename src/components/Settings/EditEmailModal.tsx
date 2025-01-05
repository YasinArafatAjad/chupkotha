import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock } from 'lucide-react';
import { updateUserEmail } from '../../lib/services/auth/emailAuth';
import LoadingAnimation from '../common/LoadingAnimation';

interface EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditEmailModal({ isOpen, onClose }: EditEmailModalProps) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !password) return;

    setLoading(true);
    try {
      await updateUserEmail(newEmail.trim(), password);
      setVerificationSent(true);
      // Don't close modal yet - show verification message
    } catch (error) {
      // Error is handled by the service
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setPassword('');
    setVerificationSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Change Email</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {verificationSent ? (
            <div className="mt-6 text-center">
              <div className="mb-4 text-green-500 dark:text-green-400">
                <Mail className="w-12 h-12 mx-auto mb-2" />
                <h4 className="text-lg font-semibold">Verification Email Sent</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please check your email and click the verification link to complete the email change.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newEmail.trim() || !password}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? <LoadingAnimation /> : 'Update Email'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
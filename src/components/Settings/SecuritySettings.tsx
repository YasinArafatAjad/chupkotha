import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import EditEmailModal from './EditEmailModal';

export default function SecuritySettings() {
  const [showEditEmail, setShowEditEmail] = useState(false);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-gray-500">Update your email address</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditEmail(true)}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Change Email
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </div>
          <button
            onClick={() => {/* Add password change handler */}}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      <EditEmailModal 
        isOpen={showEditEmail}
        onClose={() => setShowEditEmail(false)}
      />
    </section>
  );
}
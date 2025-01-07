import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface GoogleButtonProps {
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export default function GoogleButton({ onClick, disabled }: GoogleButtonProps) {
  const [showPopupHelp, setShowPopupHelp] = useState(false);

  const handleClick = async () => {
    try {
      await onClick();
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        setShowPopupHelp(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
        >
          <LazyLoadImage effect="blur" src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Google</span>
        </motion.button>

        {showPopupHelp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p>Popup was blocked. To sign in with Google:</p>
              <ol className="list-decimal ml-4 mt-1">
                <li>Look for a popup blocked icon in your browser's address bar</li>
                <li>Click it and select "Always allow popups from this site"</li>
                <li>Try signing in again</li>
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
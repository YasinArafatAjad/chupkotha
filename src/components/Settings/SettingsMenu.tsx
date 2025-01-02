import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Moon,
  Sun,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import EditProfileModal from "../Profile/EditProfileModal";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-primary transition-colors"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/users");
                    handleClose();
                  }}
                  className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="w-5 h-5" />
                  <span>View All Users</span>
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                    handleClose();
                  }}
                  className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </>
  );
}

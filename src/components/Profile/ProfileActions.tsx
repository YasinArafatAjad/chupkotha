import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, UserPlus, UserMinus, Settings } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileActionsProps {
  userId: string;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => Promise<void>;
  onEditProfile: () => void;
}

export default function ProfileActions({
  userId,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEditProfile,
}: ProfileActionsProps) {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate(`/chat/${userId}`);
  };

  const handleFollow = async () => {
    try {
      await onFollow();
      toast.success(isFollowing ? "Unfollowed user" : "Following user");
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="flex gap-2 p-4">
      {isOwnProfile ? (
        <button
          onClick={onEditProfile}
          className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      ) : (
        <>
          <button
            onClick={handleFollow}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isFollowing
                ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isFollowing ? (
                <>
                  <UserMinus className="w-4 h-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </>
              )}
            </div>
          </button>
          <button
            onClick={handleMessage}
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </div>
          </button>
        </>
      )}
    </div>
  );
}

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SaveButton from './SaveButton';
import toast from 'react-hot-toast';

interface PostActionsProps {
  postId: string;
  userId: string | undefined;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  likesCount: number;
  onCommentClick: () => void;
  onImageClick: () => void;
  onLike: () => Promise<boolean>;
}

export default function PostActions({
  postId,
  userId,
  isLiked,
  setIsLiked,
  likesCount,
  onCommentClick,
  onImageClick,
  onLike
}: PostActionsProps) {
  const handleLike = async () => {
    if (!userId) {
      toast.error('Please sign in to like posts');
      return;
    }

    const success = await onLike();
    if (success) {
      setIsLiked(!isLiked);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: `${window.location.origin}/post/${postId}`
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/post/${postId}`
        );
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share post');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={isLiked ? 'text-red-500' : 'text-gray-500'}
          >
            <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          <button onClick={onCommentClick} className="text-gray-500">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button onClick={handleShare} className="text-gray-500">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <SaveButton postId={postId} />
      </div>
      <div className="font-semibold">{likesCount} likes</div>
    </div>
  );
}
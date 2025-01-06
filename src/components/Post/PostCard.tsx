import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPostDate } from '../../lib/utils/date/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { PostService } from '../../lib/services/postService';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostActions from './PostActions';
import ImageModal from './ImageModal';
import { Post } from '../../lib/types';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onPrivacyChange?: (postId: string, isPublic: boolean) => void;
}

export default function PostCard({ post, onPrivacyChange }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isPublic, setIsPublic] = useState(post.isPublic ?? true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please sign in to like posts');
      return false;
    }

    try {
      const success = await PostService.toggleLike(post.id, currentUser.uid);
      return success;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  const handlePrivacyChange = (newIsPublic: boolean) => {
    setIsPublic(newIsPublic);
    onPrivacyChange?.(post.id, newIsPublic);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4"
    >
      <PostHeader
        userId={post.userId}
        userName={post.userName}
        userPhoto={post.userPhoto}
        imageUrl={post.imageUrl}
        postId={post.id}
        caption={post.caption}
        createdAt={post.createdAt}
        isPublic={isPublic}
        onPrivacyChange={handlePrivacyChange}
      />

      {post.caption && (
        <div className="px-4 py-2">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {post.caption}
          </p>
        </div>
      )}

      {post.imageUrl && (
        <PostImage
          imageUrl={post.imageUrl}
          caption={post.caption}
          onClick={() => setShowImageModal(true)}
        />
      )}

      <PostActions
        postId={post.id}
        userId={currentUser?.uid}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        likesCount={post.likes.length}
        onLike={handleLike}
      />

      <ImageModal
        imageUrl={post.imageUrl}
        caption={post.caption}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </motion.div>
  );
}
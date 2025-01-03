import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPostDate } from '../../lib/utils/date/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { PostService } from '../../lib/services/postService';
import { CommentService } from '../../lib/services/commentService';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostActions from './PostActions';
import PostComments from './PostComments';
import ImageModal from './ImageModal';
import { Post } from '../../lib/types';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser.uid));
    }
  }, [currentUser, post.likes]);

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

  const handleComment = async (text: string) => {
    if (!currentUser) {
      toast.error('Please sign in to comment');
      return false;
    }

    try {
      const commentData = {
        text,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
      };

      await CommentService.addComment(post.id, commentData, post.userId);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-4"
    >
      <PostHeader
        userId={post.userId}
        userName={post.userName}
        userPhoto={post.userPhoto}
        imageUrl={post.imageUrl}
        postId={post.id}
        createdAt={post.createdAt}
        isPublic={post.isPublic}
      />

      <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {post.caption}
          </p>          
      </div>

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
        onCommentClick={() => setShowComments(!showComments)}
        onImageClick={() => setShowImageModal(true)}
        onLike={handleLike}
      />

      <PostComments
        postId={post.id}
        comments={post.comments}
        isVisible={showComments}
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
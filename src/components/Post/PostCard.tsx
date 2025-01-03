import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import ImageModal from "./ImageModal";
import { motion } from "framer-motion";
import { useOfflineCache } from "../../hooks/useOfflineCache";
import { PostService } from "../../lib/services/postService";
import { CommentService } from "../../lib/services/commentService";
import LinesEllipsis from "react-lines-ellipsis";

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    userName: string;
    userPhoto: string;
    imageUrl?: string;
    caption: string;
    likes: string[];
    comments: any[];
    createdAt: any;
    isPublic?: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { currentUser } = useAuth();
  const { cachePost } = useOfflineCache();

  useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser.uid));
    }
  }, [currentUser, post.likes]);

  useEffect(() => {
    cachePost(post);
  }, [post]);

  const handleLike = async () => {
    if (!currentUser) return false;
    return PostService.toggleLike(post.id, currentUser.uid);
  };

  const handleComment = async (text: string) => {
    if (!currentUser) return false;
    
    const commentData = {
      text,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    };

    await CommentService.addComment(post.id, commentData, post.userId);
    return true;
  };

  // Rest of the component remains the same...
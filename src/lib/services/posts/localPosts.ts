import postsData from '../../../components/preReady_post/posts.json';
import { Post } from '../../types';

export function getLocalPosts(): Post[] {
  // Transform the local posts to match the Post type
  return postsData.posts.map(post => ({
    id: post.id.toString(),
    userId: post.userId,
    userName: post.userName,
    userPhoto: post.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}`,
    imageUrl: post.imageUrl || '',
    caption: post.caption,
    likes: post.likes || [],
    comments: post.comments || [],
    createdAt: new Date(post.createdAt),
    isPublic: true
  }));
}
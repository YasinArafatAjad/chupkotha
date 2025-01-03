import postsData from '../../../components/preReady_post/posts.json';
import { Post } from '../../types';

export function getLocalPosts(): Post[] {
  // Filter out private posts from local data
  return postsData.posts.filter(post => post.isPublic !== false);
}
import postsData from '../../../components/preReady_post/posts.json';
import { Post } from '../../types';

export function getLocalPosts(): Post[] {
  return postsData.posts;
}
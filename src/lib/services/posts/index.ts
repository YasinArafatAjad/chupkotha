import { Post } from '../../types';
import { fetchLivePosts } from './fetchPosts';

export async function getAllPosts(): Promise<Post[]> {
  const livePosts = await fetchLivePosts();
  
  // Filter out private posts
  const publicPosts = livePosts.filter(post => post.isPublic !== false);
  
  // Sort by createdAt in descending order
  return publicPosts.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

export { fetchLivePosts } from './fetchPosts';
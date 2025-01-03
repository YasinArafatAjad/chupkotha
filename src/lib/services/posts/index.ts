import { Post } from '../../types';
import { fetchLivePosts } from './fetchPosts';
import { getLocalPosts } from './localPosts';

export async function getAllPosts(): Promise<Post[]> {
  const [livePosts, localPosts] = await Promise.all([
    fetchLivePosts(),
    Promise.resolve(getLocalPosts())
  ]);

  // Filter out private posts
  const publicPosts = [...livePosts, ...localPosts].filter(post => post.isPublic !== false);
  
  // Sort by createdAt in descending order
  return publicPosts.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

export { fetchLivePosts } from './fetchPosts';
export { getLocalPosts } from './localPosts';
import { Post } from '../types';

// Convert likes/shares to formatted strings (e.g. 1.2K, 45K)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Transform raw post data into proper Post type
const transformPost = (rawPost: any): Post => ({
  id: rawPost.id.toString(),
  userId: 'yasin-arafat', // Since all posts are from same user
  userName: rawPost.user || 'Yasin Arafat Ajad',
  userPhoto: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40',
  imageUrl: rawPost.img.replace('./postImg/', 'https://source.unsplash.com/random/'),
  caption: rawPost.caption || '',
  likes: [], // Initialize empty array since we don't have actual user IDs
  likesCount: formatNumber(rawPost.like),
  sharesCount: formatNumber(rawPost.share),
  comments: [],
  createdAt: new Date(`${rawPost.date} ${rawPost.time}`).toISOString(),
  isPublic: true
});

// Import and transform all posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await import('../../../posts.json');
    return response.postData.map(transformPost);
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
};

// Get a single post by ID
export const getPost = async (id: string): Promise<Post | null> => {
  const posts = await getPosts();
  return posts.find(post => post.id === id) || null;
};
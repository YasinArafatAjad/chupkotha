import { nanoid } from 'nanoid';

// Types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: string;
}

class LocalStorageDB {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    const posts = this.getItem<Post>('posts');
    return posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const posts = this.getItem<Post>('posts');
    const newPost: Post = {
      ...postData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };
    
    posts.push(newPost);
    this.setItem('posts', posts);
    return newPost;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const posts = this.getItem<Post>('posts');
    const post = posts.find(p => p.id === postId);
    if (post) {
      const hasLiked = post.likes.includes(userId);
      post.likes = hasLiked 
        ? post.likes.filter(id => id !== userId)
        : [...post.likes, userId];
      this.setItem('posts', posts);
    }
  }

  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const posts = this.getItem<Post>('posts');
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newComment: Comment = {
        ...comment,
        id: nanoid(),
        createdAt: new Date().toISOString()
      };
      post.comments.push(newComment);
      this.setItem('posts', posts);
      return newComment;
    }
    throw new Error('Post not found');
  }

  // Users
  async getUser(userId: string): Promise<User | null> {
    const users = this.getItem<User>('users');
    return users.find(u => u.id === userId) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'followers' | 'following'>): Promise<User> {
    const users = this.getItem<User>('users');
    const newUser: User = {
      ...userData,
      id: nanoid(),
      followers: [],
      following: []
    };
    
    users.push(newUser);
    this.setItem('users', users);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getItem<User>('users');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.setItem('users', users);
      return users[userIndex];
    }
    throw new Error('User not found');
  }

  // Initialize with sample data
  async initializeSampleData(): Promise<void> {
    if (this.getItem<Post>('posts').length === 0) {
      const sampleUser: User = {
        id: 'sample-user',
        email: 'sample@example.com',
        displayName: 'Sample User',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        bio: 'Sample bio',
        followers: [],
        following: []
      };

      const samplePosts: Post[] = [
        {
          id: nanoid(),
          userId: sampleUser.id,
          userName: sampleUser.displayName,
          userPhoto: sampleUser.photoURL,
          imageUrl: 'https://images.unsplash.com/photo-1693761935441-ad0ffad6905b',
          caption: 'Beautiful sunset 🌅',
          likes: [],
          comments: [],
          createdAt: new Date().toISOString()
        },
        {
          id: nanoid(),
          userId: sampleUser.id,
          userName: sampleUser.displayName,
          userPhoto: sampleUser.photoURL,
          imageUrl: 'https://images.unsplash.com/photo-1693924538557-5cf随机e2b6a7a0',
          caption: 'City lights at night ✨',
          likes: [],
          comments: [],
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];

      this.setItem('users', [sampleUser]);
      this.setItem('posts', samplePosts);
    }
  }
}

export const localDB = new LocalStorageDB();
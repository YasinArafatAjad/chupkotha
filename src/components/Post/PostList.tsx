import { memo } from 'react';
import PostCard from './PostCard';
import { Post } from '../../lib/types';

interface PostListProps {
  posts: Post[];
}

const PostList = memo(({ posts }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
});

PostList.displayName = 'PostList';
export default PostList;
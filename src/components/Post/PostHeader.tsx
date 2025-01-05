import { Link } from 'react-router-dom';
import { Clock, Globe, Lock } from 'lucide-react';
import PostMenu from './PostMenu';
import { formatPostDate } from '../../lib/utils/date/formatters';

interface PostHeaderProps {
  userId: string;
  userName: string;
  userPhoto: string;
  imageUrl: string;
  postId: string;
  caption: string;
  createdAt: any;
  isPublic?: boolean;
}

export default function PostHeader({ 
  userId, 
  userName, 
  userPhoto, 
  imageUrl, 
  postId,
  caption,
  createdAt,
  isPublic = true 
}: PostHeaderProps) {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${userId}`} className="flex items-center space-x-3">
          <img
            src={userPhoto || 'https://via.placeholder.com/40'}
            alt={userName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{userName}</span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatPostDate(createdAt)}</span>
              {isPublic ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
          </div>
        </Link>
        <PostMenu 
          postId={postId} 
          imageUrl={imageUrl} 
          userId={userId} 
          caption={caption}
          isPublic={isPublic}
        />
      </div>
    </div>
  );
}


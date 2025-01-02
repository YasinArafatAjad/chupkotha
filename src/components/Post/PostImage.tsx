import { memo } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../common/LazyImage';

interface PostImageProps {
  imageUrl: string;
  caption: string;
  onClick: () => void;
}

const PostImage = memo(({ imageUrl, caption, onClick }: PostImageProps) => {
  return (
    <motion.div 
      className="aspect-square cursor-pointer"
      whileHover={{ scale: 0.995 }}
      onClick={onClick}
    >
      <LazyImage
        src={imageUrl}
        alt={caption}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
});

PostImage.displayName = 'PostImage';
export default PostImage;
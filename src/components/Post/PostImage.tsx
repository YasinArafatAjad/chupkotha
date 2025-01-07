import { memo } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface PostImageProps {
  imageUrl: string;
  caption: string;
  onClick: () => void;
}

const PostImage = memo(({ imageUrl, caption, onClick }: PostImageProps) => {
  return (
    <motion.div 
      className=" cursor-pointer"
      whileHover={{ scale: 0.995 }}
      onClick={onClick}
    >
      <LazyLoadImage
        src={imageUrl}
        alt={caption}
        effect="blur"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
});

PostImage.displayName = 'PostImage';
export default PostImage;
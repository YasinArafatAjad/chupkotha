import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function ImageWithFallback({ src, alt, className, onClick }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <UserCircle className="w-1/2 h-1/2 text-gray-400" />
      </div>
    );
  }

  return (
    <LazyLoadImage effect="blur"
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setError(true)}
      crossOrigin="anonymous"
    />
  );
}
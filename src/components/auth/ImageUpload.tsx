import { Camera, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File) => void;
}

export default function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      /* if (file.size > 5 * 1024 * 1024) {
         alert('Image size should be less than 5MB');
         return;
       }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      } */
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {imageUrl ? (
            <LazyLoadImage effect="blur"
              src={imageUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
          <Upload className="w-6 h-6 text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload profile picture
      </p>
    </div>
  );
}
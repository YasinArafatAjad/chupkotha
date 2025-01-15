import { Camera, X } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageUploadPreviewProps {
  preview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function ImageUploadPreview({ 
  preview, 
  onImageChange, 
  onRemoveImage 
}: ImageUploadPreviewProps) {
  return (
    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {preview ? (
        <>
          <LazyLoadImage effect="blur"
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Camera className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Choose a photo</span>
          <input
            type="file"
            accept="image/* , video/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

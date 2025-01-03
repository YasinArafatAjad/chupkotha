import { Image } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ImageUploadButtonProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUploadButton({ onImageSelect, disabled }: ImageUploadButtonProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    onImageSelect(file);
  };

  return (
    <motion.label
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Image className="w-5 h-5 text-gray-500" />
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </motion.label>
  );
}
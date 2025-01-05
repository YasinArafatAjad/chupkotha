import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Move } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { createCroppedImage } from '../../lib/utils/image/cropUtils';
import LoadingAnimation from '../common/LoadingAnimation';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: Blob) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export default function ImageCropper({ 
  image, 
  onCrop, 
  onClose,
  aspectRatio = 1
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await createCroppedImage(image, croppedAreaPixels);
      onCrop(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Move className="w-5 h-5 mr-2" />
            Crop Image
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-80">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <LoadingAnimation />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
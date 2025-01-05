import { cloudinaryConfig, cloudinaryUrls } from './config';
import { getPublicIdFromUrl } from './utils';
import { generateSignature } from './utils';
import toast from 'react-hot-toast';

export async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return true;
  
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) {
    console.warn('Invalid Cloudinary URL:', imageUrl);
    return true;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp, publicId);

    const response = await fetch(`${cloudinaryUrls.base}${cloudinaryUrls.destroy}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        signature,
        api_key: cloudinaryConfig.apiKey,
        timestamp
      })
    });

    if (!response.ok) {
      throw new Error('Failed to delete image from Cloudinary');
    }

    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    toast.error('Failed to delete image');
    return false;
  }
}
import { deleteFromCloudinary } from '../../cloudinary';
import { getCloudinaryPublicId } from '../../utils/cloudinary/urlParser';
import toast from 'react-hot-toast';

export async function deleteProfileImage(imageUrl: string | null): Promise<boolean> {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return true; // No image to delete or not a Cloudinary image
  }

  try {
    const publicId = getCloudinaryPublicId(imageUrl);
    if (!publicId) {
      console.warn('Invalid Cloudinary URL:', imageUrl);
      return false;
    }

    const success = await deleteFromCloudinary(imageUrl);
    if (!success) {
      throw new Error('Failed to delete image from Cloudinary');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting profile image:', error);
    toast.error('Failed to delete old profile image');
    return false;
  }
}
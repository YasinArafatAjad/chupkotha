import { uploadToCloudinary } from '../../cloudinary';
import toast from 'react-hot-toast';

export async function uploadChatImage(file: File): Promise<string> {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    // if (file.size > 5 * 1024 * 1024) {
    //   throw new Error('Image must be less than 5MB');
    // }

    return await uploadToCloudinary(file, 'chat');
  } catch (error: any) {
    console.error('Error uploading chat image:', error);
    toast.error(error.message || 'Failed to upload image');
    throw error;
  }
}
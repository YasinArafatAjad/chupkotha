import { cloudinaryConfig } from './config';
import { getCloudinaryPublicId } from '../utils/cloudinary/urlParser';
import toast from 'react-hot-toast';

export async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
  const publicId = getCloudinaryPublicId(imageUrl);
  if (!publicId) {
    console.warn('Invalid Cloudinary URL:', imageUrl);
    return false;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp.toString());

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.result !== 'ok') {
      throw new Error(result.error?.message || 'Failed to delete image');
    }

    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    toast.error('Failed to delete old image');
    return false;
  }
}

async function generateSignature(publicId: string, timestamp: number): Promise<string> {
  const strToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
  
  // Use Web Crypto API for SHA-1 hashing
  const msgBuffer = new TextEncoder().encode(strToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
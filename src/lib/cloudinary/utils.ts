import { cloudinaryConfig } from './config';

/**
 * Extracts the public ID from a Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Extract the public ID from URL format: 
    // https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
    const matches = url.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

/**
 * Generates a signature for Cloudinary API requests
 */
export async function generateSignature(timestamp: number, publicId: string): Promise<string> {
  // Create the string to sign
  const strToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
  
  // Use Web Crypto API to generate SHA-1 hash
  const msgBuffer = new TextEncoder().encode(strToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert hash to hex string
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
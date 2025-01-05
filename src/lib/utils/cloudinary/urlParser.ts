/**
 * Extracts the public ID from a Cloudinary URL
 * Example URL formats:
 * - https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
 * - https://res.cloudinary.com/cloud-name/image/upload/folder/image.jpg
 */
export function getCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Extract everything after /upload/ and before file extension
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!matches || !matches[1]) return null;

    // Remove any query parameters
    return matches[1].split('?')[0];
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return null;
  }
}
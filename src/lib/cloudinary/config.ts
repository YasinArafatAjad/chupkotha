// Cloudinary configuration and constants
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
};

export const cloudinaryUrls = {
  base: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}`,
  upload: `/image/upload`,
  destroy: `/image/destroy`
};
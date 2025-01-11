import toast from 'react-hot-toast';

export const validatePostInput = (image: File | null, caption: string) => {
  if (!image && !caption.trim()) {
    throw new Error('Please add an image or write a caption');
  }
};

export const validateImageFile = (file: File) => {
  //if (!file.type.startsWith('image/')) {
  //  throw new Error('Please select an image file');
  //}

  // if (file.size > 5 * 1024 * 1024) {
  //   throw new Error('Image size should be less than 5MB');
  // }
};
// Update handleImageChange function
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load image');
    }
  }
};
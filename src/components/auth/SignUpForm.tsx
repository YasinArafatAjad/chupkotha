// Update handleImageChange function
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  }
};
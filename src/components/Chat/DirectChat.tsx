// Update handleImageSelect function
const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !currentUser) return;

  // Validate file
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  setSending(true);
  try {
    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(file, 'chat');

    // Send message with image
    const messageData = {
      text: '📷 Image',
      imageUrl,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      userPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'Anonymous')}`
    };

    await sendChatMessage(messageData);
  } catch (error) {
    console.error('Error sending image:', error);
    toast.error('Failed to send image');
  } finally {
    setSending(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};
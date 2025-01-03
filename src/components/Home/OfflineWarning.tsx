interface OfflineWarningProps {
  isOnline: boolean;
}

export default function OfflineWarning({ isOnline }: OfflineWarningProps) {
  if (isOnline) return null;
  
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
      <p className="text-yellow-800 dark:text-yellow-200">
        You're currently offline. Showing cached posts.
      </p>
    </div>
  );
}
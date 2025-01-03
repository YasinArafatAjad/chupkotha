import { forwardRef } from 'react';

interface LoadMoreButtonProps {
  hasMore: boolean;
  loadMore: () => void;
}

const LoadMoreButton = forwardRef<HTMLDivElement, LoadMoreButtonProps>(
  ({ hasMore, loadMore }, ref) => {
    if (!hasMore) return null;

    return (
      <div ref={ref} className="flex justify-center py-4">
        <button
          onClick={loadMore}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Show More Posts
        </button>
      </div>
    );
  }
);

LoadMoreButton.displayName = 'LoadMoreButton';
export default LoadMoreButton;
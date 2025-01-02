import { useCallback, useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  pageSize?: number;
  onLoadMore?: () => void;
}

export default function VirtualList<T>({ 
  items, 
  renderItem, 
  pageSize = 10,
  onLoadMore 
}: VirtualListProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(false);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  const loadMoreItems = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const newItems = items.slice(start, end);
    
    setVisibleItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    loadingRef.current = false;
  }, [items, page, pageSize]);

  useEffect(() => {
    if (inView && onLoadMore) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);

  useEffect(() => {
    loadMoreItems();
  }, []);

  return (
    <div className="space-y-4">
      {visibleItems.map(renderItem)}
      <div ref={ref} className="h-4" />
    </div>
  );
}
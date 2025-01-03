import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SearchResult } from '../../lib/services/searchService';
import { User, MessageCircle, Image } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  onResultClick?: () => void;
}

export default function SearchResults({ results, loading, onResultClick }: SearchResultsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />;
      case 'post':
        return <Image className="w-5 h-5" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3 p-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      {results.map((result) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to={result.link}
            onClick={onResultClick}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0">
              {result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {getIcon(result.type)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium truncate">{result.title}</span>
                <span className="text-xs text-gray-500 capitalize">({result.type})</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
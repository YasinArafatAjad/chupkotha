import { format } from 'date-fns';

export function formatPostDate(timestamp: any): string {
  try {
    // Handle Firebase Timestamp
    if (timestamp?.toDate) {
      return format(timestamp.toDate(), 'MMM d, yyyy • hh:mm a');
    }
    
    // Handle ISO string from preloaded posts
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'MMM d, yyyy • hh:mm a');
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return format(timestamp, 'MMM d, yyyy • hh:mm a');
    }
    
    // Fallback to current date
    return format(new Date(), 'MMM d, yyyy • hh:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return format(new Date(), 'MMM d, yyyy • hh:mm a');
  }
}
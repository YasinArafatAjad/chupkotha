import { format } from 'date-fns';

export const formatPostTime = (timestamp: any): string => {
  try {
    // Handle Firebase Timestamp
    if (timestamp?.toDate) {
      return format(timestamp.toDate(), 'MMM d, yyyy • hh:mm a');
    }
    
    // Handle ISO string
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'MMM d, yyyy • hh:mm a');
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return format(timestamp, 'MMM d, yyyy • hh:mm a');
    }
    
    return format(new Date(), 'MMM d, yyyy • hh:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return format(new Date(), 'MMM d, yyyy • hh:mm a');
  }
};
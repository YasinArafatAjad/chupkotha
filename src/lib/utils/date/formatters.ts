import { format, isValid, parseISO } from 'date-fns';

/**
 * Safely formats a date with a fallback value
 */
export function formatDate(date: unknown, formatStr: string = 'MMM d, yyyy • HH:mm'): string {
  try {
    if (!date) {
      return 'No date';
    }

    // Handle Firebase Timestamp
    if (typeof date === 'object' && 'toDate' in date) {
      const dateObj = date.toDate();
      if (isValid(dateObj)) {
        return format(dateObj, formatStr);
      }
    }

    // Handle ISO string
    if (typeof date === 'string') {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, formatStr);
      }
    }

    // Handle Date object
    if (date instanceof Date && isValid(date)) {
      return format(date, formatStr);
    }

    return 'Invalid date';
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a post date consistently across the app
 */
export function formatPostDate(date: unknown): string {
  return formatDate(date, 'MMM d, yyyy • HH:mm');
}

/**
 * Formats a chat message date
 */
export function formatMessageDate(date: unknown): string {
  return formatDate(date, 'HH:mm');
}
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date string or Date object to Indonesian localized format
 */
export const formatDate = (date: string | Date, pattern: string = 'dd MMMM yyyy'): string => {
  return format(new Date(date), pattern, { locale: id });
};

/**
 * Get date range for current month in YYYY-MM-DD format
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
};

/**
 * Get date range for current week in YYYY-MM-DD format
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  return {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  };
};

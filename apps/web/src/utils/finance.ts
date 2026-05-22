import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format number to Indonesian Rupiah
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to Indonesian long format
 */
export const formatDate = (date: string | Date, pattern: string = 'dd MMMM yyyy'): string => {
  return format(new Date(date), pattern, { locale: id });
};

/**
 * Get date range for current month
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
};

/**
 * Get date range for current week
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  return {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  };
};

/**
 * Group transactions by category name
 */
export const groupTransactionsByCategory = (transactions: any[]) => {
  const groups: Record<string, { name: string; amount: number; color?: string }> = {};

  transactions.forEach((tx) => {
    if (tx.type !== 'expense') return;
    const catName = tx.category?.name || 'Lainnya';
    if (!groups[catName]) {
      groups[catName] = { name: catName, amount: 0 };
    }
    groups[catName].amount += Number(tx.amount);
  });

  return Object.values(groups).sort((a, b) => b.amount - a.amount);
};

/**
 * Group transactions by date for trend chart
 */
export const groupTransactionsByDateTrend = (transactions: any[], startDate: Date, endDate: Date) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTxs = transactions.filter(tx => tx.date === dayStr);
    
    const income = dayTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      name: format(day, 'dd MMM', { locale: id }),
      date: dayStr,
      income,
      expense,
    };
  });
};

/**
 * Get Score Label based on Health Score
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Sangat Baik';
  if (score >= 60) return 'Cukup Stabil';
  if (score >= 40) return 'Mulai Konsisten';
  return 'Perlu Dibangun';
};

/**
 * Trigger download of a CSV file
 */
export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

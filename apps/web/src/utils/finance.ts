import { format, eachDayOfInterval } from 'date-fns';
import { id } from 'date-fns/locale';

export * from './currency';
export * from './date';
export * from './file';

/**
 * Group transactions by category name (expenses only)
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

import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { dashboardService } from '@/services/dashboardService';
import { getCurrentMonthRange, groupTransactionsByDateTrend, groupTransactionsByCategory } from '@/utils/finance';
import type { UserStats, TransactionWithRelations } from '@/types';

export function useDashboardData() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithRelations[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { start, end } = getCurrentMonthRange();
      const sevenDaysAgo = subDays(new Date(), 6);

      const [statsData, totalBalance, monthTxs, trendTxs, recent] = await Promise.all([
        dashboardService.getUserStats(),
        dashboardService.getTotalActiveAccountsBalance(),
        dashboardService.getMonthTransactions(start, end),
        dashboardService.getTrendTransactions(format(sevenDaysAgo, 'yyyy-MM-dd')),
        dashboardService.getRecentTransactions(10),
      ]);

      const income =
        monthTxs?.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expense =
        monthTxs?.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats(statsData);
      setTotals({ balance: totalBalance, income, expense });
      setCategoryData(groupTransactionsByCategory(monthTxs || []).slice(0, 5));
      setTrendData(groupTransactionsByDateTrend(trendTxs || [], sevenDaysAgo, new Date()));
      setRecentTransactions(recent || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const netCashflow = totals.income - totals.expense;

  return {
    stats,
    totals,
    netCashflow,
    recentTransactions,
    trendData,
    categoryData,
    loading,
    fetchData,
  };
}

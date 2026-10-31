import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { reportService } from '@/services/reportService';
import { groupTransactionsByCategory } from '@/utils/finance';
import { downloadCSV } from '@/utils/file';

export interface CategorySummary {
  name: string;
  amount: number;
}

export interface AccountMovement {
  name: string;
  income: number;
  expense: number;
}

export function useReports() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const [reportData, setReportData] = useState<{
    income: number;
    expense: number;
    categories: CategorySummary[];
    accountMovements: AccountMovement[];
  }>({
    income: 0,
    expense: 0,
    categories: [],
    accountMovements: [],
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const txs = await reportService.getReportTransactions(dateRange.start, dateRange.end);

      const income =
        txs?.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expense =
        txs?.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const categories = groupTransactionsByCategory(txs || []);

      const accMovements: Record<string, AccountMovement> = {};
      txs?.forEach((tx) => {
        const accName = tx.account?.name || 'Unknown';
        if (!accMovements[accName]) {
          accMovements[accName] = { name: accName, income: 0, expense: 0 };
        }
        if (tx.type === 'income') accMovements[accName].income += Number(tx.amount);
        if (tx.type === 'expense') accMovements[accName].expense += Number(tx.amount);
      });

      setReportData({
        income,
        expense,
        categories,
        accountMovements: Object.values(accMovements),
      });
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const netCashflow = reportData.income - reportData.expense;
  const daysInRange = differenceInDays(new Date(dateRange.end), new Date(dateRange.start)) + 1;
  const avgDailyExpense = reportData.expense / (daysInRange || 1);

  const exportCSV = () => {
    const headers = ['Kategori', 'Total Pengeluaran'];
    const rows = reportData.categories.map((c) => [c.name, c.amount]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    downloadCSV(csvContent, `report_${dateRange.start}_to_${dateRange.end}.csv`);
  };

  const setMonthRange = () => {
    const now = new Date();
    setDateRange({
      start: format(startOfMonth(now), 'yyyy-MM-dd'),
      end: format(endOfMonth(now), 'yyyy-MM-dd'),
    });
  };

  return {
    loading,
    dateRange,
    setDateRange,
    reportData,
    netCashflow,
    avgDailyExpense,
    exportCSV,
    setMonthRange,
  };
}

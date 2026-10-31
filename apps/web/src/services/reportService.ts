import { supabase } from '@/lib/supabase';
import type { TransactionWithRelations } from '@/types';

export const reportService = {
  async getReportTransactions(startDate: string, endDate: string): Promise<TransactionWithRelations[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:category_id(name), account:account_id(name)')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    return (data as unknown as TransactionWithRelations[]) || [];
  },
};

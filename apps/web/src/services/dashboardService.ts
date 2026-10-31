import { supabase } from '@/lib/supabase';
import type { UserStats, TransactionWithRelations } from '@/types';

export const dashboardService = {
  async getUserStats(): Promise<UserStats | null> {
    const { data, error } = await supabase.from('user_stats').select('*').single();
    if (error && error.code !== 'PGRST116') {
      console.warn('Could not fetch user stats:', error);
    }
    return data || null;
  },

  async getTotalActiveAccountsBalance(): Promise<number> {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('is_active', true);

    if (error) throw error;
    return data?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;
  },

  async getMonthTransactions(startDate: string, endDate: string): Promise<TransactionWithRelations[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:category_id(name)')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    return (data as unknown as TransactionWithRelations[]) || [];
  },

  async getTrendTransactions(sinceDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, date')
      .gte('date', sinceDate);

    if (error) throw error;
    return data || [];
  },

  async getRecentTransactions(limit = 10): Promise<TransactionWithRelations[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:category_id(name)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as unknown as TransactionWithRelations[]) || [];
  },
};

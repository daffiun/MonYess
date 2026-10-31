import { supabase } from '@/lib/supabase';

export const exportImportService = {
  async getTableRecords(tableName: string) {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) throw error;
    return data || [];
  },

  async getAccountNamesMap() {
    const { data, error } = await supabase.from('accounts').select('id, name');
    if (error) throw error;
    return new Map((data || []).map((a) => [a.name.toLowerCase(), a.id]));
  },

  async getCategoryNamesMap() {
    const { data, error } = await supabase.from('categories').select('id, name, type');
    if (error) throw error;
    return new Map((data || []).map((c) => [`${c.name.toLowerCase()}_${c.type}`, c.id]));
  },

  async createTransactionBatchRPC(txPayload: {
    p_user_id?: string;
    p_account_id: string;
    p_target_account_id: string | null;
    p_category_id: string | null;
    p_amount: number;
    p_type: 'income' | 'expense' | 'transfer';
    p_date: string;
    p_note: string;
  }) {
    const { error } = await supabase.rpc('create_transaction_with_balance', txPayload);
    if (error) throw error;
  },
};

import { supabase } from '@/lib/supabase';
import type { TransactionWithRelations } from '@/types';

export interface TransactionFilterParams {
  type?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface CreateTransactionRPCParams {
  p_user_id?: string;
  p_account_id: string;
  p_target_account_id?: string | null;
  p_category_id?: string | null;
  p_amount: number;
  p_type: 'income' | 'expense' | 'transfer';
  p_date: string;
  p_note?: string;
}

export interface UpdateTransactionRPCParams extends CreateTransactionRPCParams {
  p_tx_id: string;
}

export interface DeleteTransactionRPCParams {
  p_tx_id: string;
  p_user_id?: string;
}

export const transactionService = {
  async getTransactions(params: TransactionFilterParams = {}): Promise<TransactionWithRelations[]> {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        account:account_id(name),
        target_account:target_account_id(name),
        category:category_id(name)
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (params.type && params.type !== 'all') {
      query = query.eq('type', params.type);
    }

    if (params.accountId && params.accountId !== 'all') {
      query = query.eq('account_id', params.accountId);
    }

    if (params.startDate) {
      query = query.gte('date', params.startDate);
    }

    if (params.endDate) {
      query = query.lte('date', params.endDate);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as unknown as TransactionWithRelations[]) || [];
  },

  async createTransaction(payload: CreateTransactionRPCParams) {
    const { data, error } = await supabase.rpc('create_transaction_with_balance', payload);
    if (error) throw error;
    return data;
  },

  async updateTransaction(payload: UpdateTransactionRPCParams) {
    const { data, error } = await supabase.rpc('update_transaction_with_balance_safe', payload);
    if (error) throw error;
    return data;
  },

  async deleteTransaction(payload: DeleteTransactionRPCParams) {
    const { data, error } = await supabase.rpc('delete_transaction_with_balance', payload);
    if (error) throw error;
    return data;
  },
};
